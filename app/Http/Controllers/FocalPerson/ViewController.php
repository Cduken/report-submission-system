<?php

namespace App\Http\Controllers\FocalPerson;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use App\Models\ReportSubmission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard(): \Inertia\Response
    {
        $user = auth()->user();

        return inertia('focal-person/dashboard/page', [
            'pending_count'           => $this->getPendingCount($user->id),
            'approved_today'          => $this->getApprovedToday($user->id),
            'approved_this_week'      => $this->getApprovedThisWeek($user->id),
            'returned_count'          => $this->getReturnedCount($user->id),
            'overdue_count'           => $this->getOverdueCount($user->id),
            'assigned_programs_count' => $this->getAssignedProgramsCount($user->id),
            'pending_submissions'     => $this->getPendingSubmissions($user->id),
            'overdue_reports'         => $this->getOverdueReports($user->id),
            'recent_activity'         => $this->getRecentActivity($user->id),
            'assigned_programs'       => $this->getAssignedPrograms($user->id),
        ]);
    }

public function programs(Request $request)
{
    $query = auth()->user()
        ->programsAsCoordinator()
        ->with('coordinator');

    // Add year filter if provided
    if ($request->has('year') && $request->year) {
        $query->whereYear('created_at', $request->year);
    }

    $programs = $query->paginate(15)
        ->through(fn ($program) => [
            'id' => $program->id,
            'name' => $program->name,
            'description' => $program->description,
            'created_at' => $program->created_at->toISOString(),
            'updated_at' => $program->updated_at->toISOString(),
            'coordinator' => [
                'id' => $program->coordinator->id,
                'name' => $program->coordinator->name,
                'email' => $program->coordinator->email,
                'avatar' => $program->coordinator->avatar,
                'email_verified_at' => $program->coordinator->email_verified_at,
                'two_factor_enabled' => $program->coordinator->two_factor_enabled ?? false,
                'created_at' => $program->coordinator->created_at->toISOString(),
                'updated_at' => $program->coordinator->updated_at->toISOString(),
                'role' => $program->coordinator->role,
            ],
        ]);

    return inertia('focal-person/programs/page', [
        'programs' => $programs,
        'filters' => $request->only(['year']), // Pass filters back to frontend
    ]);
}

    public function reports(Program $program)
{
    $reports = auth()->user()
        ->createdReports()
        ->where('program_id', $program->id)
        ->latest()
        ->with(['program', 'coordinator', 'media'])
        ->get()
        ->map(fn ($report) => [
            'id' => $report->id,
            'title' => $report->title,
            'content' => $report->content,
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
                ->map(fn ($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                    'url' => $media->getFullUrl(),
                ]),

            'created_at' => $report->created_at->toISOString(),
            'updated_at' => $report->updated_at->toISOString(),
        ]);


    return inertia('focal-person/programs/reports/page', [
        'program' => $program,
        'reports' => $reports,
    ]);
}


    public function reportSubmissions(Program $program, Report $report){

        $report->load('submissions.fieldOfficer');

        $submissions = $report->submissions()->with(['fieldOfficer:id,name,email', 'media'])->get();


        return inertia('focal-person/programs/reports/report-submissions/page', [
            'program' => $program,
            'reportSubmissions' => $submissions,
            'report' => $report
        ]);

    }

    public function notifications(){

        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(20)
            ->through(function ($notification){
                return [
                    'id' => $notification->id,
                    'title' => $notification->data['title'] ?? '',
                    'message' => $notification->data['message'] ?? '',
                    'created_at' => $notification->created_at,
                    'read_at' => $notification->read_at,
                    'action_url' => $notification->data['action_url']
                ];
            });

        return inertia('focal-person/notifications/page', [
            'notifications' => Inertia::scroll($notifications)
        ]);
    }



    // PRIVATE FUNCTIONS

    private function assignedProgramIds(int $userId): array
    {
        return Program::where('coordinator_id', $userId)->pluck('id')->all();
    }

    // ── Stats ─────────────────────────────────────────────────────────────────────

    private function getPendingCount(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'submitted')
        ->count();
    }

    private function getApprovedToday(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'accepted')
        ->whereDate('updated_at', today())
        ->count();
    }

    private function getApprovedThisWeek(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'approved')
        ->whereBetween('updated_at', [now()->startOfWeek(), now()->endOfWeek()])
        ->count();
    }

    private function getReturnedCount(int $userId): int
    {
        return ReportSubmission::whereHas('report', fn ($q) =>
            $q->whereIn('program_id', $this->assignedProgramIds($userId))
        )
        ->where('status', 'returned')
        ->count();
    }

    private function getOverdueCount(int $userId): int
    {
        return Report::whereIn('program_id', $this->assignedProgramIds($userId))
            ->where('deadline', '<', now())
            ->count();
    }

    private function getAssignedProgramsCount(int $userId): int
    {
        return Program::where('coordinator_id', $userId)->count();
    }

    // ── Pending submissions queue ─────────────────────────────────────────────────

    private function getPendingSubmissions(int $userId): array
    {
        return ReportSubmission::with(['report.program', 'fieldOfficer'])
            ->whereHas('report', fn ($q) =>
                $q->whereIn('program_id', $this->assignedProgramIds($userId))
            )
            ->where('status', 'submitted')
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($sub) => [
                'id'             => $sub->id,
                'report_title'   => $sub->report?->title ?? 'N/A',
                'program'        => $sub->report?->program?->name ?? 'N/A',
                'officer'        => $sub->fieldOfficer?->name ?? 'N/A',
                'officer_avatar' => $this->getInitials($sub->fieldOfficer?->name),
                'cluster'        => $sub->fieldOfficer?->cluster ?? 'N/A',
                'submitted_at'   => $sub->created_at->toISOString(),
                'deadline'       => $sub->report?->deadline?->toDateString(),
                'is_overdue'     => $sub->report?->deadline
                                        ? $sub->report->deadline->isPast()
                                        : false,
            ])
            ->all();
    }

    // ── Overdue reports ───────────────────────────────────────────────────────────

    private function getOverdueReports(int $userId): array
    {
        $totalOfficers = User::role('field_officer')->count();

        return Report::with(['program', 'submissions'])
            ->whereIn('program_id', $this->assignedProgramIds($userId))
            ->where('deadline', '<', now())
            ->orderBy('deadline')
            ->take(5)
            ->get()
            ->map(fn ($report) => [
                'id'             => $report->id,
                'report_title'   => $report->title,
                'program'        => $report->program?->name ?? 'N/A',
                'deadline'       => $report->deadline->toDateString(),
                'days_overdue'   => (int) now()->diffInDays($report->deadline),
                'submitted'      => $report->submissions()
                                        ->where('status', '!=', 'returned')
                                        ->count(),
                'total_officers' => $totalOfficers,
            ])
            ->all();
    }

    // ── Recent activity ───────────────────────────────────────────────────────────
    // Inferred from approved/returned submissions under assigned programs.
    // If you have an audit/activity log table, query that instead.

    private function getRecentActivity(int $userId): array
    {
        return ReportSubmission::with(['report', 'fieldOfficer'])
            ->whereHas('report', fn ($q) =>
                $q->whereIn('program_id', $this->assignedProgramIds($userId))
            )
            ->whereIn('status', ['accepted', 'returned'])
            ->latest('updated_at')
            ->take(8)
            ->get()
            ->map(fn ($sub) => [
                'id'             => $sub->id,
                'type'           => $sub->status,
                'report_title'   => $sub->report?->title ?? 'N/A',
                'officer'        => $sub->fieldOfficer?->name ?? 'N/A',
                'officer_avatar' => $this->getInitials($sub->fieldOfficer?->name),
                'program'        => $sub->report?->program?->name ?? 'N/A',
                'actioned_at'    => $sub->updated_at->toISOString(),
            ])
            ->all();
    }

    // ── Assigned programs with pending counts ─────────────────────────────────────

    private function getAssignedPrograms(int $userId): array
    {
        return Program::with(['reports.submissions'])
            ->where('coordinator_id', $userId)
            ->get()
            ->map(fn ($program) => [
                'id'            => $program->id,
                'name'          => $program->name,
                'total_reports' => $program->reports->count(),
                'pending_count' => $program->reports
                    ->flatMap(fn ($r) => $r->submissions)
                    ->where('status', 'pending')
                    ->count(),
            ])
            ->sortByDesc('pending_count')
            ->values()
            ->all();
    }

    // ── Helpers ───────────────────────────────────────────────────────────────────

    private function getInitials(?string $name): string
    {
        if (!$name) return '??';
        $words = explode(' ', trim($name));
        return count($words) >= 2
            ? strtoupper(substr($words[0], 0, 1) . substr($words[1], 0, 1))
            : strtoupper(substr($name, 0, 2));
    }
}