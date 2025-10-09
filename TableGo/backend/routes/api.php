<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Manager\BranchController;


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
Route::middleware(['auth:sanctum', 'role:manager,owner'])->group(function () {
    Route::prefix('branches')->group(function () {
        Route::get('/', [BranchController::class, 'index']);
        Route::post('/', [BranchController::class, 'store']);
        Route::get('/trashed', [BranchController::class, 'trashed']);
        Route::post('/restore/{id}', [BranchController::class, 'restore']);
        Route::get('/{branch}', [BranchController::class, 'show']);
        Route::put('/{branch}', [BranchController::class, 'update']);
        Route::delete('/{branch}', [BranchController::class, 'destroy']);
    });
});
