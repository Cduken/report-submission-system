<?php

namespace App\Http\Controllers\ProvincialDirector;

use App\Http\Controllers\Controller;
use App\Models\Program;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard(){
        return inertia('provincial-director/dashboard/page');
    }

    public function programs(){

    $programs  = Program::query()
    ->select('id', 'name', 'description','coordinator_id', 'created_at', 'updated_at')
    ->with([
        'coordinator:id,name,email,avatar,created_at'
    ])
    ->get();


        return Inertia::render('provincial-director/programs/page',[
            'programs' => Inertia::defer(fn () => $programs)
        ]);
    }
}