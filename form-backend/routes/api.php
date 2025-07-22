<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\SubUserController;
use App\Http\Controllers\EventController; // ** ADD THIS IMPORT **
use App\Http\Controllers\TicketController; // ** ADD THIS IMPORT **

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ===================================================================
// PUBLIC AUTHENTICATION ROUTES
// ===================================================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);


// ===================================================================
// PROTECTED ROUTES (Require Authentication)
// ===================================================================
Route::middleware('auth:sanctum')->group(function () {

    // --- General Authenticated User Routes ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

    Route::get('/dashboard-stats', [AuthController::class, 'getDashboardStats']);
    // --- Sub-User Management Routes ---
    Route::get('/sub-users', [SubUserController::class, 'index']);
    Route::post('/sub-users/{user}/assign-role', [SubUserController::class, 'assignRole']);
    Route::post('/sub-users/{user}/action', [SubUserController::class, 'performAction']);
    Route::post('/sub-users', [SubUserController::class, 'store']);

    // --- Event & Ticket Management Routes for Organizers ---
    Route::get('/roles', [RoleController::class, 'index']);
    Route::get('/events', [EventController::class, 'index']);
    Route::post('/events', [EventController::class, 'store']);
    Route::post('/events/{event}/tickets', [TicketController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);


    // ===============================================================
    // ADMIN-ONLY ROUTES
    // ===============================================================
    Route::middleware('admin')->prefix('admin')->group(function () {

        // --- Dashboard ---
        Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);

        // --- Administrator Management ---
        Route::get('/admins', fn(Request $request) => app(AdminController::class)->index($request, true));
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
        Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
        Route::get('/permissions', [RoleController::class, 'getAllPermissions']);
        Route::post('/users/{user}/assign-roles', [RoleController::class, 'assignRolesToUser']);
    });
});