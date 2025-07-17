<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use Spatie\Permission\Models\Permission; // Use the Permission model from Spatie

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // This Gate rule runs before all others.
        // If the user has the 'Super Admin' role, it grants them access to everything.
        Gate::before(function (User $user, string $ability) {
            if ($user->hasRole('Super Admin')) {
                return true;
            }
        });

        // Dynamically register a Gate for each permission in the database
        try {
            // Use the Spatie Permission model to get all permissions
            Permission::all()->each(function ($permission) {
                Gate::define($permission->name, function (User $user) use ($permission) {
                    // Use the Spatie hasPermissionTo method to check for permission
                    return $user->hasPermissionTo($permission->name);
                });
            });
        } catch (\Exception $e) {
            // This can happen when running migrations for the first time.
            // It's safe to ignore in that context.
            report($e);
        }
    }
}