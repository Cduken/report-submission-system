<?php

namespace App\Http\Controllers;

use App\Models\Program;
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

        $program = Program::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'coordinator_id' => (int) $validated['coordinator_id'],
        ]);

        return redirect()->back()->with('success', 'Program created successfully.');
    }

    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'name'           => ['required', 'string', 'max:255'],
            'description'    => ['required', 'string'],
            'coordinator_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $program->update([
            'name'           => $validated['name'],
            'description'    => $validated['description'],
            'coordinator_id' => (int) $validated['coordinator_id'],
        ]);

        return redirect()->back()->with('success', 'Program updated successfully.');
    }

    public function destroy(Program $program)
    {
        $program->delete();
        return redirect()->back()->with('success', 'Program deleted successfully.');
    }
}