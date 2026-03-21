<?php

namespace App\Http\Responses;

use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request)
    {
        $user = Auth::user();

        $route = match (true) {
            $user->hasRole('field_officer')       => 'field-officer.dashboard',
            $user->hasRole('focal_person')        => 'focal-person.dashboard',
            $user->hasRole('program_head')        => 'program-head.dashboard',
            $user->hasRole('provincial_director') => 'provincial-director.dashboard',
            default                               => 'dashboard',
        };

        return redirect()->route($route)
            ->with('success', 'Welcome back, ' . $user->name . '!');
    }
}
