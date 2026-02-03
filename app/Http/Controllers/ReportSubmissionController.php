<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\ReportSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportSubmissionController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'report_id' => ['required', 'uuid', 'exists:reports,id'],
        'description' => ['nullable', 'string'],
        'submission_data' => ['nullable', 'array'],
    ]);

    $report = Report::findOrFail($request->report_id);

    // Determine timeliness
    $submittedAt = now();
$deadline = $report->deadline;

$submittedDate = $submittedAt->startOfDay();
$deadlineDate = $deadline->startOfDay();

if ($submittedDate->lt($deadlineDate)) {
    $timeliness = 'early';
} elseif ($submittedDate->eq($deadlineDate)) {
    $timeliness = 'on_time';
} else {
    $timeliness = 'late';
}


    $submission = ReportSubmission::create([
        'report_id' => $request->report_id,
        'field_officer_id' => Auth::id(),
        'description' => $request->description,
        'status' => 'submitted',
        'submitted_at' => $submittedAt,
        'timeliness' => $timeliness,
        'data' => [],
    ]);

    $finalData = [];

    if ($request->file('submission_data')) {

        foreach ($request->file('submission_data') as $fieldId => $files) {

            $files = is_array($files) ? $files : [$files];
            $urls = [];

            foreach ($files as $file) {
                $media = $submission
                    ->addMedia($file)
                    ->toMediaCollection('submission_attachments');

                $urls[] = $media->getUrl();
            }

            $finalData[$fieldId] = $urls;
        }
    }

    $submission->update([
        'data' => $finalData
    ]);

    return redirect()->back()->with('success', 'Report submitted successfully.');
}

}