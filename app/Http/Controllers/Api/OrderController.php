<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\OrderHistory;
use App\Models\Dish;
use App\Models\RestaurantTable;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'details.dish', 'history.user'])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $orders], 200);
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'table_id' => 'nullable|integer|exists:tables,id',
                'ho_ten' => 'required|string|max:50',
                'phone' => 'required|string|max:15',
                'booking_date' => 'required|date',
                'booking_time' => 'required|date_format:H:i',
                'quantity' => 'required|integer|min:1',
                'note' => 'nullable|string',
                'items' => 'nullable|array',
                'items.*.dish_id' => 'required|integer|exists:dishes,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.note' => 'nullable|string|max:500',
            ]);

            DB::beginTransaction();

            try {
                $userId = auth()->id();
                
                $order = Order::create([
                    'user_id' => $userId,
                    'table_id' => $data['table_id'] ?? null,
                    'ho_ten' => $data['ho_ten'],
                    'phone' => $data['phone'],
                    'booking_date' => $data['booking_date'],
                    'booking_time' => $data['booking_time'],
                    'quantity' => $data['quantity'],
                    'note' => $data['note'] ?? null,
                    'total_price' => 0,
                    'status' => 0,
                    'created_by' => $userId,
                ]);

                $total = 0;

                if (!empty($data['items']) && is_array($data['items'])) {
                    foreach ($data['items'] as $item) {
                        $dish = Dish::findOrFail($item['dish_id']);
                        
                        $lineTotal = $dish->price * $item['quantity'];
                        $total += $lineTotal;

                        OrderDetail::create([
                            'order_id' => $order->id,
                            'dish_id' => $dish->id,
                            'quantity' => $item['quantity'],
                            'price' => $dish->price,
                            'note' => $item['note'] ?? null,
                            'status' => 0,
                            'created_by' => $userId,
                        ]);
                    }
                }

                $order->update(['total_price' => $total]);

                OrderHistory::create([
                    'order_id' => $order->id,
                    'action_status' => 0,
                    'old_value' => null,
                    'new_value' => 'created',
                    'changed_by' => $userId,
                ]);

                DB::commit();

                return response()->json([
                    'message' => 'Tạo đơn hàng thành công',
                    'data' => $order->load(['details.dish', 'history']),
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Lỗi khi tạo đơn hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $order = Order::with(['user', 'details.dish', 'history.user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        return response()->json(['data' => $order], 200);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $data = $request->validate([
            'status' => 'nullable|integer|in:0,1,2,3',
            'note' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            if (array_key_exists('status', $data) && $data['status'] != $order->status) {
                OrderHistory::create([
                    'order_id' => $order->id,
                    'action_status' => 1,
                    'old_value' => $order->status,
                    'new_value' => $data['status'],
                    'changed_by' => auth()->id() ?? null,
                ]);
            }

            $data['updated_by'] = auth()->id() ?? null;
            $order->update($data);

            DB::commit();

            return response()->json([
                'message' => 'Cập nhật đơn hàng thành công',
                'data' => $order->fresh()->load('details.dish', 'history.user'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi cập nhật đơn hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function assignTable(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        // Validate với bảng tables
        $request->validate([
            'table_id' => 'required|exists:tables,id',
        ]);

        $table = RestaurantTable::find($request->table_id);

        if (!$table) {
            return response()->json(['message' => 'Không tìm thấy bàn'], 404);
        }

        // Kiểm tra trạng thái bàn
        if ($table->status !== 'available') {
            return response()->json(['message' => 'Bàn này hiện không khả dụng'], 400);
        }

        // Gán bàn cho order
        $order->table_id = $table->id;
        $order->save();

        // Cập nhật trạng thái bàn
        $table->status = 'occupied';
        $table->save();

        return response()->json([
            'message' => 'Gán bàn thành công!',
            'order' => $order->load('table'),
        ]);
    }

    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        DB::beginTransaction();

        try {
            OrderHistory::create([
                'order_id' => $order->id,
                'action_status' => 3,
                'old_value' => $order->status,
                'new_value' => 'deleted',
                'changed_by' => auth()->id() ?? null,
            ]);

            $order->delete();

            DB::commit();

            return response()->json(['message' => 'Xóa đơn hàng thành công']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi xóa đơn hàng',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
