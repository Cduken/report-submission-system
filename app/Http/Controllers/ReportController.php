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
            'form_schema' => 'nullable|json'
        ]);

        if (isset($validated['form_schema'])) {

            $validated['form_schema'] = json_decode($validated['form_schema'], true);
        }

        $report = auth()->user()->createdReports()->create($validated);

        return redirect()->back()->with('success', 'Report created successfully.');
    }
}
