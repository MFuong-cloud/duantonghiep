<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Models\OrderDetail;

class OrderController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Bắt buộc đăng nhập
        if (!$user) {
            return response()->json([
                'message' => 'Vui lòng đăng nhập để xem lịch sử đặt hàng',
                'data' => []
            ], 401);
        }
        // Admin (owner, manager, employee) xem được TẤT CẢ orders
        $adminRoles = ['owner', 'manager', 'employee'];
        if (in_array($user->role, $adminRoles)) {
            $orders = Order::with(['user:id,name,phone,email', 'table', 'details.dish', 'history.user:id,name'])
                ->orderByDesc('id')
                ->get();
        }else {
            // User thường (customer) chỉ xem orders của mình
            $orders = Order::with(['user:id,name,phone,email', 'table', 'details.dish', 'history.user:id,name'])
                ->where('user_id', $user->id)
                ->orderByDesc('id')
                ->get();
        }
        return response()->json(['data' => $orders], 200);
    }
    


   public function store(Request $request)
{
    try {
            // Anti-spam & Availability Check
            if ($spamError = $this->performSpamCheck($request)) {
                return $spamError;
            }
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
                
                // Đảm bảo user đã đăng nhập
                if (!$userId) {
                    throw new \Exception('Vui lòng đăng nhập để đặt hàng');
                }

                // Kiểm tra bàn nếu có table_id
                if (!empty($data['table_id'])) {
                    $table = RestaurantTable::find($data['table_id']);
                    if (!$table) {
                        throw new \Exception('Không tìm thấy bàn');
                    }
                    if ($table->status !== 'available') {
                        throw new \Exception('Bàn này hiện không khả dụng');
                    }
                }

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
}


    public function show($id)
    {       
        $order = Order::with(['user'])->find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);
        return response()->json($order);
        
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);

         $data = $request->validate([
        'booking_id'       => 'required|exists:bookings,id',
        'user_id'          => 'required|exists:users,id',
        'menu_id'          => 'required|exists:menus,id',
        'quantity'         => 'required|integer|min:1',
        'special_request'  => 'nullable|string|max:255',
        'status'           => 'nullable', // 0: chờ, 1: đang làm, 2: hoàn thành, 3: hủy (ví dụ)
    ]);

        $order->update($data);
        return response()->json(['message' => 'Cập nhật đơn hàng thành công!', 'data' => $order]);
    }

    public function destroy($id)
    {
        $order = Order::find($id);
        if (!$order) return response()->json(['message' => 'Không tìm thấy đơn hàng!'], 404);
        $order->delete();
        return response()->json(['message' => 'Xóa đơn hàng thành công!']);
    }
}
