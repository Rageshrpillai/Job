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
        // Validate the incoming request data.
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'], // 'confirmed' checks for a 'password_confirmation' field.
        ]);

        // Create the new user.
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Always hash passwords!
            'is_admin' => true, // We are hardcoding this to true for admin registration.
        ]);

        // Return a success response.
        return response()->json([
            'message' => 'Admin user registered successfully.',
            'user' => $user
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
        // 1. Validate the incoming request.
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Attempt to authenticate the user using Laravel's built-in system.
        if (!Auth::attempt($request->only('email', 'password'))) {
            // This handles incorrect email or password.
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }
        
        // 3. Security Check: Make sure the user is an admin.
        if (! Auth::user()->is_admin) {
            // If they are not an admin, log them out immediately and deny access.
            Auth::logout();
            return response()->json(['message' => 'Unauthorized. Admin access required.'], 403);
        }

        // 4. Security Best Practice: Regenerate the session to prevent session fixation attacks.
        $request->session()->regenerate();

        // 5. Return the authenticated user's data to the frontend.
        return response()->json(Auth::user());
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