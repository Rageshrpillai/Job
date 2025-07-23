<?php

namespace App\Http\Controllers;

use App\Models\UserRole;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;

class UserRoleController extends Controller
{
    /**
     * This is a SECURE WHITELIST. Only permissions in this list can be
     * assigned by a regular user to their team roles.
     * These names MUST EXACTLY MATCH the names from the seeder.
     */
    private $allowedPermissions = [
        'create-events',
        'edit-events',
        'delete-events',
        'view-sub-users',
        'manage-sub-user-roles',
    ];

    public function index()
    {
        $roles = UserRole::where('parent_user_id', Auth::id())->get();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'in:' . implode(',', $this->allowedPermissions),
        ]);

        $role = UserRole::create([
            'name' => $validated['name'],
            'parent_user_id' => Auth::id(),
            'permissions' => $validated['permissions'] ?? [],
        ]);

        return response()->json($role, 201);
    }

    public function update(Request $request, UserRole $userRole)
    {
        if ($userRole->parent_user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'permissions' => 'nullable|array',
            'permissions.*' => 'in:' . implode(',', $this->allowedPermissions),
        ]);

        $userRole->update($validated);
        return response()->json($userRole);
    }

    public function destroy(UserRole $userRole)
    {
        if ($userRole->parent_user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userRole->delete();
        return response()->json(['message' => 'Role deleted successfully.']);
    }

    /**
     * This method provides the list of available permissions to the frontend.
     * It correctly queries the database for the names in the whitelist.
     */
    public function getPermissions()
    {
        $permissions = Permission::whereIn('name', $this->allowedPermissions)->get()->pluck('name');
        return response()->json($permissions);
    }
}