<?php

use Illuminate\Http\Request;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
| These routes are public, allowing users to register and log in.
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
| This group requires a user to be logged in (via Sanctum) to access.
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Add this line to fetch all users
    Route::get('/users', [AuthController::class, 'index']);

    // You can add all your admin-specific API routes here later
});
/*
|--------------------------------------------------------------------------
| Existing Event Participant Routes
|--------------------------------------------------------------------------
*/
Route::post('/event-register', [EventController::class, 'store']); // This line has been added
Route::get('/event-participants', [EventController::class, 'index']);
Route::get('/event-participants/{participant}', [EventController::class, 'show']);
Route::delete('/event-participants/{participant}', [EventController::class, 'destroy']);