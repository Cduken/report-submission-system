<?php

namespace App\Http\Controllers;

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


        $submission = ReportSubmission::create([
            'report_id' => $request->report_id,
            'field_officer_id' => Auth::id(),
            'description' => $request->description,
            'status' => 'submitted',
            'data' => [],
        ]);


        $finalData = [];
        $inputs = $request->input('submission_data', []);
        $files = $request->file('submission_data', []);

        // dd($files);

        $allKeys = array_unique(array_merge(array_keys($inputs), array_keys($files)));

        foreach ($allKeys as $fieldId) {


            if ($request->hasFile("submission_data.{$fieldId}")) {
                $file = $request->file("submission_data.{$fieldId}");


                $media = $submission->addMedia($file)
                                    ->toMediaCollection('submission_attachments');


                $finalData[$fieldId] = $media->getUrl();

            }

            else {
                $finalData[$fieldId] = $request->input("submission_data.{$fieldId}");
            }
        }



        $submission->update([
            'data' => $finalData
        ]);

        return redirect()->back()->with('success', 'Report submitted successfully.');
    }
}
