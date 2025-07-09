<?php

use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
/*
|--------------------------------------------------------------------------
| Public User Routes
|--------------------------------------------------------------------------
| These routes are for regular user registration and login.
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Public Admin Route
|--------------------------------------------------------------------------
| This route is exclusively for administrator login.
*/
Route::post('/admin/login', [AdminAuthController::class, 'login']);


/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
| These routes require a user to be authenticated via a Sanctum session cookie.
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Returns the currently logged-in user's data
    Route::get('/user', fn(Request $request) => $request->user());

    // An admin-only route to view all registered users (this route is now redundant with admin/users, can be removed later if not used elsewhere)
    Route::get('/users', [AuthController::class, 'index']);
});



/*
|--------------------------------------------------------------------------
| Admin-Only Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'is.admin'])->prefix('admin')->group(function () {
    // GET /api/admin/users - Get all non-admin users (including blocked, soft-deleted)
    Route::get('/users', [AdminController::class, 'index']);

    // POST /api/admin/users/{user}/approve
    Route::post('/users/{user}/approve', [AdminController::class, 'approveUser']);

    // POST /api/admin/users/{user}/block - Block a user with a reason
    Route::post('/users/{user}/block', [AdminController::class, 'blockUser']);

    // POST /api/admin/users/{user}/unblock - Unblock a user
    Route::post('/users/{user}/unblock', [AdminController::class, 'unblockUser']);

    // DELETE /api/admin/users/{user} - Soft delete a user with a reason
    Route::delete('/users/{user}', [AdminController::class, 'softDeleteUser']);

    // POST /api/admin/users/{user}/restore - Restore a soft-deleted user
    Route::post('/users/{user}/restore', [AdminController::class, 'restoreUser']);

    // DELETE /api/admin/users/{user}/force-delete - Permanently delete a user (use with caution)
    Route::delete('/users/{user}/force-delete', [AdminController::class, 'forceDeleteUser']);
});