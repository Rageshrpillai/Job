<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
         $request->validate([
            'first_name' => 'required_if:organization_type,individual,non-profit,event-organizer|nullable|string|max:255',
            'last_name' => 'required_if:organization_type,individual,non-profit,event-organizer|nullable|string|max:255',
            'company' => 'required_if:organization_type,corporate,company|nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'organization_type' => 'required|string|in:individual,corporate,company,non-profit,event-organizer',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $data = $request->all();

          $data['is_admin'] = false;
          
        if ($request->organization_type === 'corporate' || $request->organization_type === 'company') {
            $data['name'] = $request->company;
        } else {
            $data['name'] = trim($request->first_name . ' ' . $request->last_name);
        }
        $data['password'] = Hash::make($request->password);
        $user = User::create($data);
        return response()->json($user, 201);
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        $user = Auth::user();

        LoginHistory::create([
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'login_at' => now(),
        ]);

        if ($user->is_admin) {
            Auth::logout();
            return response()->json(['message' => 'This login is for users only.'], 403);
        }

        if ($user->status !== 'active' || $user->is_blocked) {
            Auth::logout();
            return response()->json(['message' => 'This login is for active users only.'], 403);
        }

        $request->session()->regenerate();
        return response()->json($user);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return response()->json(['message' => 'Successfully logged out']);
    }
}