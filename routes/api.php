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

Route::get('reservations',[ ReservationController::class, 'index']); // danh sách đặt bàn
Route::post('add-reservations',[ ReservationController::class, 'store']); //thêm bàn ăn
Route::put('update-reservations/{id}',[ ReservationController::class, 'update']); 
Route::delete('delete-reservations/{id}',[ ReservationController::class, 'destroy']); 
Route::get('reservations/available',[ ReservationController::class, 'available']);

Route::get('orders',[ OrderController::class, 'index']); // danh sách hoá đơn
Route::post('add-orders',[ OrderController::class, 'store']); //thêm danh sách
Route::get('order-details/{id}',[ OrderController::class, 'show']);
Route::put('order-update/{id}',[ OrderController::class, 'update']);

Route::get('list-order-details', [OrderDetailController::class, 'index']);
Route::post('add-order-details', [OrderDetailController::class, 'store']);
Route::put('update-order-details/{id}', [OrderDetailController::class, 'update']);
Route::delete('delete-order-details/{id}', [OrderDetailController::class, 'destroy']);
// Route::apiResource('order-history', OrderHistoryController::class);
