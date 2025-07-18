<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Before: The original run() method was here.
        // The following code replaces the entire run() method.

        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // ** THE FIX IS HERE **
        // All permissions are now created with 'guard_name' => 'sanctum'
        $permissions = [
            'view-users', 'edit-users', 'delete-users', 'force-delete-users',
            'view-roles', 'manage-roles', 'assign-roles',
            'view-user-details', 'view-login-history', 'impersonate-users',
            'view-payments', 'manage-subscriptions',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'sanctum']); // Changed to sanctum
        }

        // --- All roles are now created with 'guard_name' => 'sanctum' ---
        
        // Super Admin Role
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'sanctum']); // Changed to sanctum
        $superAdminRole->syncPermissions(Permission::all());

        // Administrator Role
        $adminRole = Role::firstOrCreate(['name' => 'Administrator', 'guard_name' => 'sanctum']); // Changed to sanctum
        $adminRole->syncPermissions([
            'view-users', 'edit-users', 'delete-users',
            'view-user-details', 'view-login-history', 'assign-roles',
        ]);

        // Support Specialist Role
        $supportRole = Role::firstOrCreate(['name' => 'Support Specialist', 'guard_name' => 'sanctum']); // Changed to sanctum
        $supportRole->syncPermissions([
            'view-users', 'view-user-details', 'view-login-history',
        ]);
        
        // Assign Super Admin role to the first admin user
        $adminUser = User::where('is_admin', true)->first();
        if($adminUser){
            $adminUser->syncRoles(['Super Admin']);
        }
        
        // After: No changes after this method.
    }
}