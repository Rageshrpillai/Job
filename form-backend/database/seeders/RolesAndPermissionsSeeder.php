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
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create Permissions
        $permissions = [
            'view-users', 'edit-users', 'delete-users', 'force-delete-users',
            'view-roles', 'manage-roles', 'assign-roles',
            'view-user-details', 'view-login-history', 'impersonate-users',
            'view-payments', 'manage-subscriptions',
        ];

        foreach ($permissions as $permission) {
            // Create permission if it doesn't exist
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // 2. Create Roles and Assign Permissions
        
        // Super Admin Role
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        // Assign all permissions to the Super Admin
        $superAdminRole->syncPermissions(Permission::all());

        // Administrator Role
        $adminRole = Role::firstOrCreate(['name' => 'Administrator', 'guard_name' => 'web']);
        $adminRole->syncPermissions([
            'view-users', 'edit-users', 'delete-users',
            'view-user-details', 'view-login-history', 'assign-roles',
        ]);

        // Support Specialist Role
        $supportRole = Role::firstOrCreate(['name' => 'Support Specialist', 'guard_name' => 'web']);
        $supportRole->syncPermissions([
            'view-users', 'view-user-details', 'view-login-history',
        ]);
        
        // 3. Assign Super Admin role to the first admin user
        // Find the first user marked as an admin
        $adminUser = User::where('is_admin', true)->first();
        if($adminUser){
            // Use syncRoles to safely assign the role. It removes old roles and adds the new ones.
            $adminUser->syncRoles(['Super Admin']);
        }
    }
}