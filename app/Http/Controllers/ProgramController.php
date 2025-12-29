<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'description' => ['required', 'string'],
        'coordinator_id' => ['required', 'integer', 'exists:users,id'],
    ]);

    $program = \App\Models\Program::create([
        'name' => $validated['name'],
        'description' => $validated['description'],
        'coordinator_id' => (int) $validated['coordinator_id'],
    ]);

    return redirect()->back()->with('success', 'Program created successfully.');
}
}
