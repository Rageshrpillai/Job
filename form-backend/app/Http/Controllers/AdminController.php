<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of all non-admin users.
     */
    public function index()
    {
        // Fetch all users who are not admins
        $users = User::where('is_admin', false)->get();

        return response()->json($users);
    }

    /**
     * Approve a user's account.
     */
    public function approveUser(User $user)
    {
        // Check if the user is already active
        if ($user->status === 'active') {
            return response()->json(['message' => 'User is already approved.'], 422);
        }

        // Update the user's status to 'active'
        $user->status = 'active';
        $user->save();

        return response()->json([
            'message' => 'User has been successfully approved.',
            'user' => $user,
        ]);
    }
}