<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'program_id' => 'required|exists:programs,id',
            'deadline' => 'required|date',
            'final_deadline' => 'nullable|date|after_or_equal:deadline',
            'form_schema' => 'nullable|json',

            'template_files' => 'nullable|array',
            'template_files.*' => 'file|max:10240',
        ]);


        if (isset($validated['form_schema'])) {

            $validated['form_schema'] = json_decode($validated['form_schema'], true);
        }

        $report = auth()->user()->createdReports()->create($validated);

        if($request->hasFile('template_files')){
            foreach($request->file('template_files') as $file){
                $report->addMedia($file)->toMediaCollection('templates');
            }
        }


        return redirect()->back()->with('success', 'Report created successfully.');
    }
}