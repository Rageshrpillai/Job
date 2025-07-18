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



    public function performAction(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|string|in:block,remove,delete',
        ]);

        $organizer = auth()->user();
        
        // Use withTrashed to find the user even if they have been soft-deleted (removed)
        $subUser = User::withTrashed()->where('id', $id)
                                      ->where('parent_id', $organizer->id)
                                      ->firstOrFail();

        switch ($request->action) {
            case 'block':
                $subUser->is_blocked = !$subUser->is_blocked;
                $subUser->save();
                break;
            case 'remove':
                // Soft delete or restore
                if ($subUser->trashed()) {
                    $subUser->restore();
                } else {
                    $subUser->delete();
                }
                break;
            case 'delete':
                // Permanent deletion
                $subUser->forceDelete();
                return response()->json(['message' => 'User permanently deleted']);
        }
        
        // We need to reload the role relationship to return it in the response
        $subUser->load('roles');
        return response()->json($subUser);
    }
}
