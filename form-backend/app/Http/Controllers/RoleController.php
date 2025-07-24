<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\DB; // <-- CORRECT IMPORT
use Illuminate\Support\Facades\Log; 
// REMOVED: use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    // ... (index, getAllPermissions, store, and update methods are unchanged) ...

    public function index()
    {
        $user = auth()->user();
        if ($user && $user->is_admin) {
            $roles = Role::where('type', 'admin')->get();
        } else {
            $roles = Role::where('type', 'user')->get();
        }
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
        $role = Role::findOrFail($id);
        Log::info("Attempting to delete role ID: {$id}.");
        Log::info("Role details: " . json_encode($role->toArray()));
        // Log::info("Role users count: " . $role->users()->count()); // Removed because it causes an error
        Log::info("Role permissions: " . json_encode($role->permissions()->pluck('name')));

        DB::beginTransaction();
        Log::info("Transaction started for role deletion.");

        try {
            $role->delete();
            DB::commit();
            Log::info("Role ID: {$id} deleted and transaction committed successfully.");
            return response()->json(['message' => 'Role deleted successfully.']);
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Failed to delete role ID: {$id}. Transaction rolled back.");
            Log::error("Error: " . $e->getMessage());
            Log::error("Stack Trace: " . $e->getTraceAsString());
            // Removed: Log::error("Role users: " . json_encode($role->users()->pluck('id')));
            Log::error("Role permissions: " . json_encode($role->permissions()->pluck('id')));
            return response()->json(['message' => 'Failed to delete role.'], 500);
        }
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