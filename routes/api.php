<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\TableCategoryController;
use App\Http\Controllers\Api\RestaurantTableController;
use App\Http\Controllers\Api\CategoryController;

use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderDetailController;
use App\Http\Controllers\Api\OrderHistoryController;
use App\Http\Controllers\Api\UserProfileController;
use App\Http\Controllers\Api\UserManagementController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Đây là nơi định nghĩa các route API cho ứng dụng.
| Mọi route ở đây đều sẽ có prefix là /api/
*/

// =============================
// 🔹 AUTH (Người dùng)
// =============================
Route::prefix('auth')->group(function () {
    // 🟢 Đăng ký
    Route::post('/register', [AuthController::class, 'register']);

    // 🟢 Đăng nhập
    Route::post('/login', [AuthController::class, 'login']);

    // 🟢 Các route cần token
    Route::middleware('auth:sanctum')->group(function () {
        // 🔴 Đăng xuất
        Route::post('/logout', [AuthController::class, 'logout']);

        // 🟢 Lấy thông tin người dùng hiện tại
        Route::get('/me', function (\Illuminate\Http\Request $request) {
            return response()->json($request->user());
        });
    });
});


// =============================
// 🔹 CHI NHÁNH (branches)
// =============================
Route::prefix('branches')->group(function () {
    Route::get('/', [BranchController::class, 'index']);     // Danh sách chi nhánh
    Route::post('/', [BranchController::class, 'store']);    // Thêm chi nhánh
    Route::get('/{id}', [BranchController::class, 'show']);  // Xem chi tiết chi nhánh
    Route::put('/{id}', [BranchController::class, 'update']); // Cập nhật chi nhánh
    Route::delete('/{id}', [BranchController::class, 'destroy']); // Xóa chi nhánh
});


// =============================
// 🔹 LOẠI BÀN (table_categories)
// =============================
Route::prefix('table-categories')->group(function () {
    Route::get('/', [TableCategoryController::class, 'index']);    // Danh sách loại bàn
    Route::post('/', [TableCategoryController::class, 'store']);   // Thêm loại bàn
    Route::get('/{id}', [TableCategoryController::class, 'show']); // Xem chi tiết loại bàn
    Route::put('/{id}', [TableCategoryController::class, 'update']); // Cập nhật loại bàn
    Route::delete('/{id}', [TableCategoryController::class, 'destroy']); // Xóa loại bàn
});


// =============================
// 🔹 DANH SÁCH BÀN (restaurant_tables)
// =============================
Route::prefix('restaurant-tables')->group(function () {
    Route::get('/', [RestaurantTableController::class, 'index']);     // Danh sách bàn
    Route::post('/', [RestaurantTableController::class, 'store']);    // Thêm bàn
    Route::get('/{id}', [RestaurantTableController::class, 'show']);  // Xem chi tiết bàn
    Route::put('/{id}', [RestaurantTableController::class, 'update']); // Cập nhật bàn
    Route::delete('/{id}', [RestaurantTableController::class, 'destroy']); // Xóa bàn
});


Route::apiResource('categories', CategoryController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('dishes', DishController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('orders', OrderController::class);
Route::apiResource('order-details', OrderDetailController::class);
Route::apiResource('order-history', OrderHistoryController::class);


Route::get('/reservations', [ReservationController::class, 'index']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::get('/reservations/{id}', [ReservationController::class, 'show']);
Route::put('/reservations/{id}', [ReservationController::class, 'update']);
Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

Route::post('/tables/available', [ReservationController::class, 'getAvailableTables']);


// API CHECK SỨC CHỨA
Route::get('/check-capacity', [ReservationController::class, 'checkCapacity']);
Route::post('/check-capacity', [ReservationController::class, 'checkCapacity']);

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        // Các route yêu cầu đã đăng nhập (đang có token Sanctum)
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/profile', [UserProfileController::class, 'show']);
            Route::post('/profile/update', [UserProfileController::class, 'update']);
            Route::post('/profile/change-password', [UserProfileController::class, 'changePassword']);
        });

        // 🟢 Quản lý phiên đăng nhập
        Route::get('/sessions', [AuthController::class, 'sessions']);
        Route::post('/logout-session/{id}', [AuthController::class, 'logoutSession']);
    });
    Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::get('/users/{id}', [UserManagementController::class, 'show']);
        Route::put('/users/{id}', [UserManagementController::class, 'update']);
        Route::patch('/users/{id}/role', [UserManagementController::class, 'updateRole']);
        Route::delete('/users/{id}', [UserManagementController::class, 'destroy']);
    });

    Route::get('/dishes', [DishController::class, 'index']);
    Route::post('/dishes', [DishController::class, 'store']);
    Route::get('/dishes/{id}', [DishController::class, 'show']);
    Route::put('/dishes/{id}', [DishController::class, 'update']);
    Route::delete('/dishes/{id}', [DishController::class, 'destroy']);

});
