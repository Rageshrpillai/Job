<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use App\Models\UserRole; 
class SubUserController extends Controller
{
    /**
     * Display a listing of the sub-users for the authenticated user.
     */
    public function index()
    {
        $parentUser = Auth::user();
          $subUsers = $parentUser->subUsers()->with('roles')->get(); // Eager load roles
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



         $subUser->assignRole('Sub-User');
        return response()->json($subUser, 201);
    }


  public function assignRole(Request $request, User $user)
    {
        // Validation: Ensure the role exists
        $validated = $request->validate([
            'role' => 'required|string|exists:roles,name',
        ]);

        // Security Check: CRITICAL!
        // Ensure the user being modified is a sub-user of the authenticated user.
        if ($user->parent_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized. You can only assign roles to your own sub-users.'], 403);
        }

        // Assign the role
        $user->syncRoles($validated['role']);

        return response()->json(['message' => 'Role assigned successfully.']);
    }


     
    public function getAssignableRoles()
    {
        // Fetch the default, site-wide "Sub-User" role
        $defaultRole = Role::where('name', 'Sub-User')->first();

        // Fetch all custom roles created by the currently authenticated user
        $customRoles = UserRole::where('parent_user_id', Auth::id())->get();

        // Start with the custom roles
        $assignableRoles = collect($customRoles);

        // If the default role exists, add it to the beginning of the list
        if ($defaultRole) {
            $assignableRoles->prepend($defaultRole);
        }

        return response()->json($assignableRoles);
    }
    public function performAction(Request $request, User $user)
    {
        // Validate the incoming request
        $validated = $request->validate([
            'action' => 'required|string|in:block,unblock,remove',
            'reason' => 'nullable|string|max:255',
        ]);

        // CRITICAL: Security check to ensure the user is a sub-user
        if ($user->parent_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $action = $validated['action'];
        $reason = $validated['reason'] ?? 'No reason provided.';

        switch ($action) {
            case 'block':
                $user->status = 'blocked';
                // You would typically log the reason here
                $user->save();
                return response()->json(['message' => 'User has been blocked.']);
            case 'unblock':
                $user->status = 'active';
                $user->save();
                return response()->json(['message' => 'User has been unblocked.']);
            case 'remove':
                // We use soft delete, so the user record is kept but marked as deleted
                $user->delete();
                return response()->json(['message' => 'User has been removed.']);
        }

        return response()->json(['message' => 'Invalid action.'], 400);
    }
}