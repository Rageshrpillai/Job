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

    // An admin-only route to view all registered users
    Route::get('/users', [AuthController::class, 'index']);
});



/*
|--------------------------------------------------------------------------
| Admin-Only Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'is.admin'])->prefix('admin')->group(function () {
    // GET /api/admin/users
    Route::get('/users', [AdminController::class, 'index']);

    // POST /api/admin/users/{user}/approve
    Route::post('/users/{user}/approve', [AdminController::class, 'approveUser']);
});