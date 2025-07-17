<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Models\LoginHistory;

class AdminAuthController extends Controller
{
    /**
     * Handle an admin authentication attempt.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $user = Auth::user();

        if (!$user->is_admin) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => ['You do not have administrator access.'],
            ]);
        }

        LoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'login_at' => now(),
        ]);
        
        $request->session()->regenerate();

        return response()->json($user);
    }
}