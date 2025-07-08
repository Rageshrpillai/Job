<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new admin user.
     * For a real SaaS, you might make this an invitation-only system,
     * but for now, we'll allow registration to create the first admin.
     */
    public function register(Request $request)
{
    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8',
    ]);

    $user = User::create([
        'name' => $validatedData['name'],
        'email' => $validatedData['email'],
        'password' => Hash::make($validatedData['password']),
        // 'status' will be 'pending_approval' by default
    ]);

    return response()->json([
        'message' => 'Registration successful. Your account is pending admin approval.'
    ], 201);
}

public function index()
    {
        // Ensure only admins can access this list
        if (!auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Return all users
        return \App\Models\User::all();
    }

    /**
     * Handle an authentication attempt for an admin user.
     */
    public function login(Request $request)
{
    $request->validate(['email' => 'required|email', 'password' => 'required']);

    if (!Auth::attempt($request->only('email', 'password'))) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials do not match our records.'],
        ]);
    }

    $user = Auth::user();

    if ($user->is_admin || $user->status !== 'active') {
        Auth::logout();
        return response()->json(['message' => 'This login is for active users only.'], 403);
    }

    $request->session()->regenerate();

    return response()->json($user);
}
    /**
     * Log the user out of the application.
     */
    public function logout(Request $request)
    {
        // Invalidate the user's session on the server.
        Auth::logout();

        // Invalidate the session data.
        $request->session()->invalidate();

        // Regenerate the CSRF token for security.
        $request->session()->regenerateToken();

        // Return a success message.
        return response()->json(['message' => 'Successfully logged out']);
    }
}