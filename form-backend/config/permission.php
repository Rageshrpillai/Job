<?php

return [

    'models' => [
        /*
         * When using the "HasPermissions" trait from this package, we need to know which
         * Eloquent model should be used to retrieve your permissions. Of course, it
         * is often just the "Permission" model but you may use whatever you like.
         *
         * The model you want to use as a Permission model needs to implement the
         * `Spatie\Permission\Contracts\Permission` contract.
         */
        'permission' => Spatie\Permission\Models\Permission::class,

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * Eloquent model should be used to retrieve your roles. Of course, it
         * is often just the "Role" model but you may use whatever you like.
         *
         * The model you want to use as a Role model needs to implement the
         * `Spatie\Permission\Contracts\Role` contract.
         */
        'role' => Spatie\Permission\Models\Role::class,

        /*
         * This is the line that was added. It explicitly tells the package
         * that your users are handled by the App\Models\User class.
         */
        'user' => App\Models\User::class, // ✨ THIS IS THE FIX

    ],

    'table_names' => [
        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * table should be used to retrieve your roles. We have chosen a basic
         * default value but you may change it to anything you like.
         */
        'roles' => 'roles',

        /*
         * When using the "HasPermissions" trait from this package, we need to know which
         * table should be used to retrieve your permissions. We have chosen a basic
         * default value but you may change it to anything you like.
         */
        'permissions' => 'permissions',

        /*
         * When using the "HasPermissions" trait from this package, we need to know which
         * table should be used to retrieve your models permissions. We have chosen a
         * basic default value but you may change it to anything you like.
         */
        'model_has_permissions' => 'model_has_permissions',

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * table should be used to retrieve your models roles. We have chosen a
         * basic default value but you may change it to anything you like.
         */
        'model_has_roles' => 'model_has_roles',

        /*
         * When using the "HasRoles" trait from this package, we need to know which
         * table should be used to retrieve your role permissions. We have chosen a
         * basic default value but you may change it to anything you like.
         */
        'role_has_permissions' => 'role_has_permissions',
    ],

    'column_names' => [
        /*
         * Change this if you want to name the related model primary key differently.
         *
         * For example, if you've changed the key name of the user model to `user_id`,
         * so you need to change this value here.
         */
        'model_morph_key' => 'model_id',
    ],

    /*
     * When set to true, the package will register `permission` and `role` middleware automatically.
     */
    'register_permission_check_method' => true,

    /*
     * When set to true, the package will register the blade directives.
     */
    'register_blade_directives' => true,

    'teams' => false,
    
    'defaults' => [
        'guard' => 'sanctum',
    ],

    'display_permission_in_exception' => false,

    'display_role_in_exception' => false,
    
    'enable_wildcard_permission' => false,
    
    'cache' => [
        /*
         * By default all permissions are cached for 24 hours to speed up performance.
         * When permissions or roles are updated the cache is flushed automatically.
         */
        'expiration_time' => \DateInterval::createFromDateString('24 hours'),

        /*
         * The cache key used to store all permissions.
         */
        'key' => 'spatie.permission.cache',

        /*
         * When checking for a permission against a model, a key is generated with the model id
         * and the key from above. This key is used to store only the permissions specific
         * to a model.
         */
        'model_key' => 'spatie.permission.cache.model',

        /*
         * You may optionally indicate a specific cache driver to use for permission and
         * role caching using any of the `store` drivers listed in the cache.php config
         * file. Using 'default' here means to use the `default` set in cache.php.
         */
        'store' => 'default',
    ],
];