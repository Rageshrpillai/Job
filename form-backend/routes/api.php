<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\SubUserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\CouponController;
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
// PROTECTED ROUTES (Require User Authentication)
// ===================================================================
Route::middleware('auth:sanctum')->group(function () {

    // --- General Authenticated User Routes ---
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());
    Route::get('/dashboard-stats', [AuthController::class, 'getDashboardStats']);


    // --- Event, Ticket, and Coupon Management Routes for Organizers ---
    Route::apiResource('events', EventController::class);
    Route::apiResource('events.tickets', TicketController::class)->shallow();
    Route::apiResource('events.coupons', CouponController::class)->shallow();   


    // --- Sub-User Management Routes (User Dashboard) ---
    Route::get('/sub-users', [SubUserController::class, 'index']);
    Route::post('/sub-users', [SubUserController::class, 'store']);
    Route::get('/assignable-roles', [SubUserController::class, 'getAssignableRoles']);
    Route::post('/sub-users/{user}/assign-role', [SubUserController::class, 'assignRole']);
    Route::post('/sub-users/{user}/action', [SubUserController::class, 'performAction']);

    // --- User-Defined Role Management (User Dashboard) ---
    Route::get('/user/roles/permissions', [UserRoleController::class, 'getPermissions']);
    Route::apiResource('/user/roles', UserRoleController::class);


    // ===============================================================
    // ADMIN-ONLY ROUTES (Require Admin Authentication & Role)
    // ===============================================================
    Route::middleware('admin')->prefix('admin')->group(function () {

        // --- Dashboard ---
        Route::get('/dashboard-stats', [AdminController::class, 'getDashboardStats']);

        // --- User & Administrator Management ---
        Route::get('/users', [AdminController::class, 'index']);
        Route::get('/admins', fn(Request $request) => app(AdminController::class)->index($request, true));
        Route::post('/admins', [AdminController::class, 'createAdmin']);
        Route::get('/users/search-for-promotion', [AdminController::class, 'searchUsersForPromotion']);
        Route::get('/users/{user}/login-history', [AdminController::class, 'getLoginHistory']);
        Route::post('/users/{user}/promote', [AdminController::class, 'promoteUser']);
        Route::post('/users/{user}/approve', [AdminController::class, 'approveUser']);
        Route::post('/users/{user}/block', [AdminController::class, 'blockUser']);
        Route::post('/users/{user}/unblock', [AdminController::class, 'unblockUser']);
        Route::post('/users/bulk-action', [AdminController::class, 'bulkAction']);
        Route::delete('/users/{id}', [AdminController::class, 'softDeleteUser']);
        Route::post('/users/{id}/restore', [AdminController::class, 'restoreUser']);
        Route::delete('/users/{id}/force-delete', [AdminController::class, 'forceDeleteUser']);
        
        // --- Site-Wide Role & Permission Management (Admin Dashboard) ---
        Route::get('/permissions', [RoleController::class, 'getAllPermissions']);
        Route::post('/users/{user}/assign-roles', [RoleController::class, 'assignRolesToUser']);
        Route::apiResource('/roles', RoleController::class);
    });

});