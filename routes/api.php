<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\TableCategoryController;
use App\Http\Controllers\Api\RestaurantTableController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderDetailController;
use App\Http\Controllers\Api\OrderHistoryController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\UserManagementController;


/*
| AUTH
*/
Route::prefix('auth')->group(function () {

    // Public
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Private
    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        // User profile
        Route::get('/profile', [UserProfileController::class, 'show']);
        Route::post('/profile/update', [UserProfileController::class, 'update']);
        Route::post('/profile/change-password', [UserProfileController::class, 'changePassword']);

        // Sessions
        Route::get('/sessions', [AuthController::class, 'sessions']);
        Route::post('/logout-session/{id}', [AuthController::class, 'logoutSession']);
    });

    // Admin routes
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

        Route::get('/users', [UserManagementController::class, 'index']);
        Route::post('/users', [UserManagementController::class, 'store']);
        Route::get('/users/{id}', [UserManagementController::class, 'show']);
        Route::put('/users/{id}', [UserManagementController::class, 'update']);
        Route::patch('/users/{id}/role', [UserManagementController::class, 'updateRole']);
        Route::patch('/users/{id}/status', [UserManagementController::class, 'updateStatus']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);

        // Avatar
        Route::post('/users/{id}/avatar', [UserManagementController::class, 'updateAvatar']);
        Route::delete('/users/{id}/avatar', [UserManagementController::class, 'deleteAvatar']);
    });
});



/*
| BRANCHES
*/
Route::prefix('branches')->group(function () {
    Route::get('/', [BranchController::class, 'index']);
    Route::post('/', [BranchController::class, 'store']);
    Route::get('/{id}', [BranchController::class, 'show']);
    Route::put('/{id}', [BranchController::class, 'update']);
    Route::delete('/{id}', [BranchController::class, 'destroy']);
});



/*
| TABLE CATEGORIES
*/
Route::prefix('table-categories')->group(function () {
    Route::get('/', [TableCategoryController::class, 'index']);
    Route::post('/', [TableCategoryController::class, 'store']);
    Route::get('/{id}', [TableCategoryController::class, 'show']);
    Route::put('/{id}', [TableCategoryController::class, 'update']);
    Route::delete('/{id}', [TableCategoryController::class, 'destroy']);
});



/*
| RESTAURANT TABLES
*/
Route::prefix('restaurant-tables')->group(function () {
    Route::get('/', [RestaurantTableController::class, 'index']);
    Route::post('/', [RestaurantTableController::class, 'store']);
    Route::get('/{id}', [RestaurantTableController::class, 'show']);
    Route::put('/{id}', [RestaurantTableController::class, 'update']);
    Route::delete('/{id}', [RestaurantTableController::class, 'destroy']);
    Route::get('tables/available', [RestaurantTableController::class, 'available']);
    Route::get('tables/occupied', [RestaurantTableController::class, 'occupied']);

});




/*
| RESOURCE API
*/
Route::apiResource('categories', CategoryController::class);
Route::apiResource('dishes', DishController::class);

// Guest order - không cần đăng nhập
Route::post('orders', [OrderController::class, 'store']);

// Orders và Order History - cần đăng nhập
Route::middleware('auth:sanctum')->group(function () {
    // Orders (trừ store đã tách ra ngoài)
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::put('orders/{order}', [OrderController::class, 'update']);
    Route::patch('orders/{order}', [OrderController::class, 'update']);
    Route::delete('orders/{order}', [OrderController::class, 'destroy']);
    
    // Assign table to order
    Route::patch('orders/{id}/assign-table', [OrderController::class, 'assignTable']);
    
    // Order Details
    Route::apiResource('order-details', OrderDetailController::class);
    
    // Order History
    Route::apiResource('order-history', OrderHistoryController::class);
});
