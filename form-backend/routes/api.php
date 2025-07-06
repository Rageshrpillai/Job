<?php

use Illuminate\Http\Request;
use App\Http\Controllers\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/event-register', [EventController::class, 'store']);
Route::get('/event-participants', [EventController::class, 'index']);
Route::get('/event-participants/{participant}', [EventController::class, 'show']);
Route::delete('/event-participants/{participant}', [EventController::class, 'destroy']);