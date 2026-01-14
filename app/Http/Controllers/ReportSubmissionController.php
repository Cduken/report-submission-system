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

        if($request->file('submission_data')){


            foreach($request->file('submission_data') as $fieldId => $files){



                $files = is_array($files) ? $files : [$files];
                $urls = [];

                foreach ($files as $file){
                    $media = $submission->addMedia($file)->toMediaCollection('submission_attachments');

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