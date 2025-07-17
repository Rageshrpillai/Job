<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\Auth\AdminAuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

    Route::middleware('admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'index']);
        Route::get('/admins', fn(Request $request) => app(AdminController::class)->index($request, true));
        Route::post('/users/{user}/promote', [AdminController::class, 'promoteUser']);
        Route::get('/users/search-for-promotion', [AdminController::class, 'searchUsersForPromotion']);
        Route::post('/users/{user}/approve', [AdminController::class, 'approveUser']);
        Route::post('/users/{user}/block', [AdminController::class, 'blockUser']);
        Route::post('/users/{user}/unblock', [AdminController::class, 'unblockUser']);
        Route::delete('/users/{id}', [AdminController::class, 'softDeleteUser']);
        Route::post('/users/{id}/restore', [AdminController::class, 'restoreUser']);
        Route::delete('/users/{id}/force-delete', [AdminController::class, 'forceDeleteUser']);
        Route::get('/users/{user}/login-history', [AdminController::class, 'getLoginHistory']);
        Route::post('/users/bulk-action', [AdminController::class, 'bulkAction']);
        Route::get('/roles', [RoleController::class, 'index']);
        Route::post('/roles', [RoleController::class, 'store']);
        Route::get('/permissions', [RoleController::class, 'getAllPermissions']);
        Route::put('/roles/{role}', [RoleController::class, 'update']);
        Route::delete('/roles/{role}', [RoleController::class, 'destroy']);
        Route::post('/users/{user}/assign-roles', [RoleController::class, 'assignRolesToUser']);
    });
});