<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // --- 1. CREATE ALL PERMISSIONS ---

        // Admin-level Permissions
        $adminPermissions = [
            'view-users', 'edit-users', 'delete-users', 'force-delete-users',
            'view-roles', 'manage-roles', 'assign-roles',
            'view-user-details', 'view-login-history', 'impersonate-users',
            'view-payments', 'manage-subscriptions'
        ];

        // User-level Permissions (for their own teams)
        $userPermissions = [
            'create-events',
            'edit-events',
            'delete-events',
            'view-sub-users',
            'manage-sub-user-roles',
        ];

        // Create all permissions in the database
        foreach (array_merge($adminPermissions, $userPermissions) as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'sanctum']);
        }

        // --- 2. CREATE ROLES AND ASSIGN PERMISSIONS ---

        // Administrator Role
        $adminRole = Role::firstOrCreate(['name' => 'Administrator', 'guard_name' => 'sanctum']);
        $adminRole->syncPermissions($adminPermissions);
        
        // Support Specialist Role
        $supportRole = Role::firstOrCreate(['name' => 'Support Specialist', 'guard_name' => 'sanctum']);
        $supportRole->syncPermissions(['view-users', 'view-user-details', 'view-login-history']);

        // Sub-User Role (for user's team members, has no permissions by default)
        Role::firstOrCreate(['name' => 'Sub-User', 'guard_name' => 'sanctum']);

        // Super Admin Role (gets all permissions)
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'sanctum']);
        $superAdminRole->givePermissionTo(Permission::all());

        // --- 3. CREATE ADMIN USER ---
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => bcrypt('password'),
                'organization_type' => 'business',
                'status' => 'active',
            ]
        );
        $adminUser->assignRole('Super Admin');
    }
}