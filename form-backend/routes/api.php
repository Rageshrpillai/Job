<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Auth\AdminAuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| This file is where you can register API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// ===================================================================
// PUBLIC AUTHENTICATION ROUTES
// ===================================================================
// These routes are for user registration and login.

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);


// ===================================================================
// PROTECTED ROUTES (Require Authentication)
// ===================================================================
// Routes within this group require a valid Sanctum token to be accessed.

Route::middleware('auth:sanctum')->group(function () {
    
    // --- General Authenticated User Routes ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());


    // ===============================================================
    // ADMIN-ONLY ROUTES
    // ===============================================================
    // These routes are protected by the 'admin' middleware,
    // ensuring only authenticated administrators can access them.
    
    Route::middleware('admin')->prefix('admin')->group(function () {

        // --- Administrator Management ---
        Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);
        Route::get('/admins', fn(Request $request) => app(AdminController::class)->index($request, true));
        
        // **NEW ROUTE ADDED HERE**
        // This is the new route to handle the creation of an administrator.
        // It listens for POST requests to '/api/admin/admins'.
        // Assuming the method in your AdminController is named 'storeAdmin'.
        Route::post('/admins', [AdminController::class, 'createAdmin']);

        // --- User Management ---
        Route::get('/users', [AdminController::class, 'index']);
        Route::get('/users/search-for-promotion', [AdminController::class, 'searchUsersForPromotion']);
        Route::get('/users/{user}/login-history', [AdminController::class, 'getLoginHistory']);
        Route::post('/users/{user}/promote', [AdminController::class, 'promoteUser']);
        Route::post('/users/{user}/approve', [AdminController::class, 'approveUser']);
        Route::post('/users/{user}/block', [AdminController::class, 'blockUser']);
        Route::post('/users/{user}/unblock', [AdminController::class, 'unblockUser']);
        Route::post('/users/bulk-action', [AdminController::class, 'bulkAction']);
        
        // --- User Deletion & Restoration ---
        Route::delete('/users/{id}', [AdminController::class, 'softDeleteUser']);
        Route::post('/users/{id}/restore', [AdminController::class, 'restoreUser']);
        Route::delete('/users/{id}/force-delete', [AdminController::class, 'forceDeleteUser']);

        // --- Role & Permission Management ---
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::put('/roles/{role}', [RoleController::class, 'update']);
       Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

        Route::get('/permissions', [RoleController::class, 'getAllPermissions']);
        Route::post('/users/{user}/assign-roles', [RoleController::class, 'assignRolesToUser']);
    });
});