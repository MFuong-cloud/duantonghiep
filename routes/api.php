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
use App\Http\Controllers\Api\AnalyticsController;

// NEWS + COMMENT
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\Admin\NewsController as AdminNewsController;
use App\Http\Controllers\Api\Admin\CommentController as AdminCommentController;

/*
|--------------------------------------------------------------------------
| AUTH
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {

    // Public
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Assign table
    Route::patch('/orders/{id}/assign-table', [OrderController::class, 'assignTable']);

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

        // 💬 USER COMMENT
        Route::post('/comments', [CommentController::class, 'store']);
    });

    // Admin routes
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

        // 📊 Analytics
        Route::get('/analytics/daily', [AnalyticsController::class, 'daily']);
        Route::get('/analytics/monthly', [AnalyticsController::class, 'monthly']);
        Route::get('/analytics/yearly', [AnalyticsController::class, 'yearly']);
        Route::get('/analytics/upcoming', [AnalyticsController::class, 'upcoming']);

        // 👤 USERS (trash phải đặt trước)
        Route::get('/users/trash', [UserManagementController::class, 'trash']);
        Route::post('/users/{id}/restore', [UserManagementController::class, 'restore']);
        Route::delete('/users/{id}/force-delete', [UserManagementController::class, 'forceDelete']);

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

        // 📰 ADMIN NEWS (trash routes phải đặt trước apiResource)
        Route::get('/news/trash', [AdminNewsController::class, 'trash']);
        Route::post('/news/{id}/restore', [AdminNewsController::class, 'restore']);
        Route::delete('/news/{id}/force-delete', [AdminNewsController::class, 'forceDelete']);
        Route::apiResource('/news', AdminNewsController::class);

        // 💬 ADMIN COMMENTS
        Route::get('/comments', [AdminCommentController::class, 'index']);
        Route::patch('/comments/{id}/approve', [AdminCommentController::class, 'approve']);
        Route::delete('/comments/{id}', [AdminCommentController::class, 'destroy']);
    });
});

/*
|--------------------------------------------------------------------------
| NEWS (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::prefix('news')->group(function () {
    Route::get('/', [NewsController::class, 'index']);
    Route::get('/{slug}', [NewsController::class, 'show']);
});

/*
|--------------------------------------------------------------------------
| BRANCHES
|--------------------------------------------------------------------------
*/
Route::prefix('branches')->group(function () {
    Route::get('/', [BranchController::class, 'index']);
    Route::post('/', [BranchController::class, 'store']);
    Route::get('/{id}', [BranchController::class, 'show']);
    Route::put('/{id}', [BranchController::class, 'update']);
    Route::delete('/{id}', [BranchController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| TABLE CATEGORIES
|--------------------------------------------------------------------------
*/
Route::prefix('table-categories')->group(function () {
    Route::get('/', [TableCategoryController::class, 'index']);
    Route::post('/', [TableCategoryController::class, 'store']);
    Route::get('/{id}', [TableCategoryController::class, 'show']);
    Route::put('/{id}', [TableCategoryController::class, 'update']);
    Route::delete('/{id}', [TableCategoryController::class, 'destroy']);
});

/*
|--------------------------------------------------------------------------
| RESTAURANT TABLES
|--------------------------------------------------------------------------
*/
Route::prefix('restaurant-tables')->group(function () {

    // Trash
    Route::get('/trash', [RestaurantTableController::class, 'trash']);
    Route::post('/{id}/restore', [RestaurantTableController::class, 'restore']);
    Route::delete('/{id}/force-delete', [RestaurantTableController::class, 'forceDelete']);

    Route::get('/', [RestaurantTableController::class, 'index']);
    Route::post('/', [RestaurantTableController::class, 'store']);
    Route::get('/{id}', [RestaurantTableController::class, 'show']);
    Route::put('/{id}', [RestaurantTableController::class, 'update']);
    Route::delete('/{id}', [RestaurantTableController::class, 'destroy']);
    Route::get('/tables/available', [RestaurantTableController::class, 'available']);
    Route::get('/tables/occupied', [RestaurantTableController::class, 'occupied']);
});

/*
|--------------------------------------------------------------------------
| CATEGORIES & DISHES (TRASH)
|--------------------------------------------------------------------------
*/
Route::get('categories/trash', [CategoryController::class, 'trash']);
Route::post('categories/{id}/restore', [CategoryController::class, 'restore']);
Route::delete('categories/{id}/force-delete', [CategoryController::class, 'forceDelete']);

Route::get('dishes/trash', [DishController::class, 'trash']);
Route::post('dishes/{id}/restore', [DishController::class, 'restore']);
Route::delete('dishes/{id}/force-delete', [DishController::class, 'forceDelete']);

Route::apiResource('categories', CategoryController::class);
Route::apiResource('dishes', DishController::class);

/*
|--------------------------------------------------------------------------
| ORDERS (AUTH)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::apiResource('orders', OrderController::class);
    Route::apiResource('order-details', OrderDetailController::class);
    Route::apiResource('order-history', OrderHistoryController::class);
});

use App\Http\Controllers\Api\PaymentController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/payments/fake', [PaymentController::class, 'fakePayment']);
});
