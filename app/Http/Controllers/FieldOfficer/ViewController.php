<?php

namespace App\Http\Controllers\FieldOfficer;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use App\Models\ReportSubmission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard()
    {
        return inertia('field-officer/dashboard/page');
    }

    public function programs(Request $request)
    {
        $user = auth()->user();
        $programs = Program::with('coordinator')
            ->paginate(10)
            ->through(function ($program) use ($user) {
                return [
                    'id' => $program->id,
                    'name' => $program->name,
                    'description' => $program->description,
                    'coordinator' => $program->coordinator,

                    // add this indicator
                    'has_pending_reports' => $program->hasPendingReportsForUser($user->id),
                ];
            });

        return inertia('field-officer/programs/page', compact('programs'));
    }

    public function reports(Program $program)
    {
        $user = auth()->user();

        $reports = $program->reports()
            ->with('coordinator')
            ->paginate(12)
            ->through(function ($report) use ($user) {
                return [
                    'id'                => $report->id,
                    'title'             => $report->title,
                    'description'       => $report->description,
                    'deadline'          => $report->deadline,
                    'final_deadline'    => $report->final_deadline,
                    'submission_status' => $report->submissionStatusForUser($user->id),
                ];
            });

        return inertia('field-officer/programs/reports/page', [
            'reports' => Inertia::scroll($reports),
            'program' => $program,
        ]);
    }

    public function reportSubmissions(Program $program, Report $report)
    {
        $hasSubmitted = $report->hasSubmissionFromUser(Auth::id());

        $report->load([
            'submissions.fieldOfficer',
            'media',
        ]);

        $serializedReport = [
            'id' => $report->id,
            'title' => $report->title,
            'content' => $report->content,
            'deadline' => $report->deadline,
            'final_deadline' => $report->final_deadline,
            'form_schema' => $report->form_schema,

            'program' => [
                'id' => $report->program->id,
                'name' => $report->program->name,
                'description' => $report->program->description,
            ],

            'coordinator' => [
                'id' => $report->coordinator->id,
                'name' => $report->coordinator->name,
                'email' => $report->coordinator->email,
                'avatar' => $report->coordinator->avatar,
            ],

            'templates' => $report
                ->getMedia('templates')
                ->map(fn($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'original_url' => $media->original_url,
                ]),

            'created_at' => $report->created_at->toISOString(),
            'updated_at' => $report->updated_at->toISOString(),
        ];

        $submission = $report->submissions()
            ->select('id', 'report_id', 'field_officer_id', 'description', 'data', 'status', 'created_at', 'updated_at')
            ->whereBelongsTo(auth()->user(), 'fieldOfficer')
            ->with([
                'fieldOfficer:id,name,email',
                'media'
            ])
            ->first();

        if ($submission) {
            $submission->media->transform(function ($media) {
                return [
                    'id' => $media->id,
                    'uuid' => $media->uuid,
                    'file_name' => $media->file_name,
                    'size' => $media->size,
                    'url' => $media->getUrl(),
                    'field_id' => $media->getCustomProperty('field_id') ?? null, // ✅ THIS IS WHAT YOU NEED
                    'collection_name' => $media->collection_name,
                    'created_at' => $media->created_at,
                    'download_url' => route('media.download', $media),
                ];
            });
        }

        return inertia('field-officer/programs/reports/report-submissions/page', [
            'program' => $program,
            'report' => $serializedReport,
            'reportSubmission' => $submission,
            'hasSubmitted' => $hasSubmitted
        ]);
    }

    public function myReportSubmissions(Request $request)
    {
        $perPage = $request->get('per_page', 12);
        $filter = $request->get('filter', 'all');

        $query = ReportSubmission::query()
            ->select('id', 'report_id', 'field_officer_id', 'status', 'created_at', 'updated_at')
            ->whereBelongsTo(auth()->user(), 'fieldOfficer')
            ->with([
                'fieldOfficer:id,name,email',
                'media',
                'report.program', // Eager load the report relationship

            ])
            ->orderBy('created_at', 'desc');

        // Apply filter - We'll implement this later
        if ($filter !== 'all') {
            switch ($filter) {
                case 'pending':
                    $query->whereIn('status', ['pending', 'submitted']);
                    break;
                case 'accepted':
                    $query->whereIn('status', ['accepted', 'approved']);
                    break;
                case 'rejected':
                    $query->where('status', 'rejected');
                    break;
            }
        }

        // Get paginated results using Laravel's built-in paginator
        $submissions = $query->paginate($perPage);

        return inertia('field-officer/my-report-submissions/page', [
            'mySubmissions' => $submissions, // Pass the full paginator object
            'filter' => $filter
        ]);
    }

public function pendingReports()
{
    $user = auth()->user();
    
    $pendingReports = Report::with([
            'program:id,name,description',
            'coordinator:id,name,email,avatar',
            'media' // Load all media at once
        ])
        ->where(function ($query) use ($user) {
            $query->whereDoesntHave('submissions', function ($q) use ($user) {
                $q->where('field_officer_id', $user->id);
            })
            ->orWhereHas('submissions', function ($q) use ($user) {
                $q->where('field_officer_id', $user->id)
                    ->where('status', 'returned');
            });
        })
        ->orderBy('deadline')
        ->get()
        ->map(function ($report) {
            // Filter media by collection
            $templates = $report->media->where('collection_name', 'templates');
            $references = $report->media->where('collection_name', 'references');
            
            // Helper function to format media
            $formatMedia = fn($media) => [
                'id' => $media->id,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'original_url' => $media->original_url,
            ];
            
            return [
                'id' => $report->id,
                'title' => $report->title,
                'description' => $report->description,
                'program' => $report->program,
                'created_by' => $report->coordinator,
                'deadline' => $report->deadline->toISOString(),
                'final_deadline' => $report->final_deadline ? $report->final_deadline->toISOString() : null,
                'form_schema' => $report->form_schema,
                'templates' => $templates->map($formatMedia)->values(),
                'references' => $references->map($formatMedia)->values(),
                'created_at' => $report->created_at,
                'updated_at' => $report->updated_at,
                'submission_status' => $report->submission_status
            ];
        });
      
    return inertia('field-officer/pending-reports/page', [
        'pendingReports' => $pendingReports
    ]);
}
    public function notifications()
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(5)
            ->through(function ($notification){
                return [
                    'id' => $notification->id,
                    'title' => $notification->data['title'] ?? '',
                    'message' => $notification->data['message'] ?? '',
                    'created_at' => $notification->created_at,
                    'read_at' => $notification->read_at,
                    'action_url' => $notification->data['action_url'] ?? null
                ];
            });

        return inertia('field-officer/notifications/page', [
            'notifications' => Inertia::scroll($notifications)
        ]);
    }
}
