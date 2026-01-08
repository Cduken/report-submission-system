<?php

namespace App\Http\Controllers\FieldOfficer;

use App\Http\Controllers\Controller;
use App\Models\Program;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ViewController extends Controller
{
    public function dashboard(){
        return inertia('field-officer/dashboard/page');
    }

    public function programs(){

        $programs = Program::with('coordinator')->get();

        return inertia('field-officer/programs/page', compact('programs'));
    }

    public function reports(Program $program){

        $reports = $program->reports()->get();

        return inertia('field-officer/programs/reports/page', compact('reports', 'program'));
    }

    public function reportSubmissions(Program $program, Report $report){

        $hasSubmitted = $report->hasSubmissionFromUser(Auth::id());

        
        $report->load([
            'submissions.fieldOfficer',
            'media',
        ]);

        $serializedReport = [
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
    ];

        return inertia('field-officer/programs/reports/report-submissions/page', [
            'program' => $program,
            'report' => $serializedReport,
            'reportSubmissions' => $report->submissions,
            'hasSubmitted' => $hasSubmitted
        ]);
    }
}