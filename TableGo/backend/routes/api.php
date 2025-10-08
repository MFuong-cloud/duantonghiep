<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AdminAuthController;


Route::prefix('auth')->group(function () {
    Route::post('register', [UserAuthController::class, 'register']);
    Route::post('login', [UserAuthController::class, 'login']);
    Route::middleware('auth:sanctum')->post('logout', [UserAuthController::class, 'logout']);
    Route::middleware('auth:sanctum')->get('me', [UserAuthController::class, 'me']);
});

Route::prefix('admin')->group(function () {
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::middleware(['auth:sanctum', 'role:manager,owner'])->post('logout', [AdminAuthController::class, 'logout']);
    Route::middleware(['auth:sanctum', 'role:manager,owner'])->get('me', [AdminAuthController::class, 'me']);
});
