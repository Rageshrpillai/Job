<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
// REMOVED: use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    // ... (index, getAllPermissions, store, and update methods are unchanged) ...

    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    public function getAllPermissions()
    {
        $permissions = Permission::all();
        return response()->json($permissions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'guard_name' => 'sanctum'
        ]);

        if ($request->filled('permissions')) {
            $permissions = Permission::where('guard_name', 'sanctum')
                                     ->whereIn('id', $request->permissions)
                                     ->get();
            $role->syncPermissions($permissions);
        }

        return response()->json($role->load('permissions'), 201);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update(['name' => $request->name]);

        if ($request->filled('permissions')) {
            $permissions = Permission::where('guard_name', 'sanctum')
                                     ->whereIn('id', $request->permissions)
                                     ->get();
            $role->syncPermissions($permissions);
        } else {
            $role->syncPermissions([]);
        }

        return response()->json($role->load('permissions'));
    }

    /**
     * Remove the specified role from storage.
     */
    public function destroy($id)
    {
        // Before: The version with logging code was here.
        // **THIS IS THE FINAL, CLEAN VERSION**
        // It correctly finds and deletes the role by its ID.
        
        $role = Role::findOrFail($id);

        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot delete the Super Admin role.'], 403);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully.']);
        // After: No changes after this method.
    }
    
    public function assignRolesToUser(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $roles = Role::whereIn('id', $request->roles)->get();
        $user->syncRoles($roles);

        return response()->json(['message' => 'Roles assigned successfully.', 'user' => $user->load('roles')]);
    }
}