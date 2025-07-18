<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class SubUserController extends Controller
{
    /**
     * Display a listing of the sub-users for the authenticated user.
     */
    public function index()
    {
        $parentUser = Auth::user();
        $subUsers = $parentUser->subUsers()->get();
        return response()->json($subUsers);
    }

    /**
     * Store a newly created sub-user in storage.
     */
    public function store(Request $request)
    {
        $parentUser = Auth::user();

        // Before: The check was only for 'event-organizer'.
        // ** THIS IS THE FIX **
        // The rule is now changed to block only 'individual' users
        // from creating sub-users. All other types are allowed.
        if ($parentUser->organization_type === 'individual') {
            return response()->json(['message' => 'Individual users cannot create sub-users.'], 403);
        }
        // After: The rest of the method logic is the same.

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $subUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'parent_id' => $parentUser->id,
            'organization_type' => 'sub-user',
            'is_approved' => true,
            'status' => 'active',
        ]);

        return response()->json($subUser, 201);
    }
}