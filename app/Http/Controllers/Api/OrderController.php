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
use Carbon\Carbon;

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
        } else {
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

                // Cập nhật trạng thái bàn nếu có
                if (!empty($data['table_id'])) {
                    $table = RestaurantTable::find($data['table_id']);
                    if ($table) {
                        $table->status = 'occupied';
                        $table->save();
                    }
                }

                OrderHistory::create([
                    'order_id' => $order->id,
                    'action_status' => 0,
                    'old_value' => null,
                    'new_value' => 'created',
                    'changed_by' => $userId,
                ]);

                DB::commit();

                $order->load(['details.dish', 'table', 'user']);

                if ($order->user && $order->user->email) {
                    try {
                        \Mail::to($order->user->email)->send(new \App\Mail\OrderConfirmationMail($order));
                    } catch (\Exception $mailError) {
                        \Log::error('Failed to send order confirmation email: ' . $mailError->getMessage());
                    }
                }

                return response()->json([
                    'message' => 'Tạo đơn hàng thành công',
                    'data' => $order,
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
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'message' => 'Vui lòng đăng nhập để xem chi tiết đơn hàng'
            ], 401);
        }

        $order = Order::with(['user', 'details.dish', 'history.user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        // Admin có thể xem bất kỳ order nào
        $adminRoles = ['owner', 'manager', 'employee'];
        $isAdmin = in_array($user->role, $adminRoles);

        // User thường chỉ được xem order của chính mình
        if (!$isAdmin && $order->user_id !== $user->id) {
            return response()->json([
                'message' => 'Bạn không có quyền xem đơn hàng này'
            ], 403);
        }

        return response()->json(['data' => $order], 200);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $user = auth()->user();
        $adminRoles = ['owner', 'manager', 'employee'];
        $isAdmin = in_array($user->role, $adminRoles);

        // AUTHORIZATION CHECK
        if (!$isAdmin) {
            // 1. Phải là đơn của chính mình
            if ($order->user_id !== $user->id) {
                return response()->json(['message' => 'Bạn không có quyền cập nhật đơn hàng này'], 403);
            }

            // 2. User thường CHỈ được phép HỦY đơn (status = 3)
            $newStatus = $request->input('status');
            if ($request->has('status') && $newStatus != 3) {
                 return response()->json(['message' => 'Bạn chỉ có quyền hủy đơn hàng'], 403);
            }

            // 3. Chỉ được hủy khi đơn đang ở trạng thái 'Chờ xác nhận' (0)
            if ($order->status != 0) {
                $statusText = 'không xác định';
                if ($order->status == 1) $statusText = 'đã xác nhận';
                if ($order->status == 2) $statusText = 'đã hoàn thành';
                if ($order->status == 3) $statusText = 'đã hủy';
                
                return response()->json(['message' => "Không thể hủy đơn hàng $statusText. Vui lòng liên hệ nhân viên."], 400);
            }
        }

        // Kiểm tra đơn hàng đã hoàn thành hoặc hủy thì không cho phép cập nhật (áp dụng cho cả admin nếu muốn chặt chẽ, hoặc user)
        // Hiện tại giữ logic cũ: Đã hoàn thành (2) hoặc Hủy (3) thì không được sửa tiếp (trừ khi admin muốn reopen - nhưng logic hiện tại cấm)
        if (in_array($order->status, [2, 3])) {
            return response()->json([
                'message' => 'Không thể cập nhật đơn hàng đã ' . ($order->status == 2 ? 'hoàn thành' : 'hủy'),
                'current_status' => $order->status,
            ], 400);
        }

        if ($request->has('status') && $request->status == 2) {
            return response()->json([
                'message' => 'Không thể chuyển thủ công sang trạng thái Hoàn thành. Trạng thái này sẽ tự động cập nhật khi thanh toán thành công.'
            ], 403);
        }

        if ($request->has('status') && $request->status == 4) {
            $bookingDate = Carbon::parse($order->booking_date);
            $today = Carbon::today();
            
            if ($bookingDate->gt($today)) {
                return response()->json([
                    'message' => 'Chưa đến ngày đặt bàn. Không thể chuyển sang trạng thái "Đã tiếp khách"',
                    'booking_date' => $bookingDate->format('d/m/Y'),
                    'current_date' => $today->format('d/m/Y'),
                ], 400);
            }
        }

        $rules = [
            'status' => 'nullable|integer|in:0,1,2,3,4',
            'note' => 'nullable|string',
        ];

        // Nếu là Admin, cho phép sửa thông tin chi tiết
        if ($isAdmin) {
             $rules = array_merge($rules, [
                 'booking_date' => 'sometimes|required|date',
                 'booking_time' => 'sometimes|required',
                 'ho_ten'       => 'sometimes|required|string',
                 'phone'        => 'sometimes|required|string',
                 'quantity'     => 'sometimes|required|integer|min:1',
                 'special_request' => 'nullable|string',
             ]);
        }

        $data = $request->validate($rules);

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

                // Giải phóng bàn khi order hoàn thành (2) hoặc hủy (3)
                if (in_array($data['status'], [2, 3]) && $order->table_id) {
                    $table = RestaurantTable::find($order->table_id);
                    if ($table) {
                        $table->status = 'available';
                        $table->save();
                    }
                }
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
        // Check Admin/Employee Role
        $user = auth()->user();
        if (!in_array($user->role, ['owner', 'manager', 'employee'])) {
            return response()->json(['message' => 'Bạn không có quyền thực hiện hành động này'], 403);
        }
        $order = Order::find($id);
        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        // Validate với bảng restaurant_tables
        $request->validate([
            'table_id' => 'required|exists:restaurant_tables,id',
        ]);
        $bookingDate = Carbon::parse($order->booking_date);
        $today = Carbon::today();
        
        if ($bookingDate->gt($today)) {
            return response()->json([
                'message' => 'Chua den ngay dat ban ' . $bookingDate->format('d/m/Y'),
                'booking_date' => $bookingDate->format('Y-m-d'),
                'current_date' => $today->format('Y-m-d'),
            ], 400);
        }

        $newTable = RestaurantTable::find($request->table_id);

        if (!$newTable) {
            return response()->json(['message' => 'Không tìm thấy bàn'], 404);
        }

        // Kiểm tra trạng thái bàn mới
        if ($newTable->status !== 'available') {
            return response()->json(['message' => 'Bàn này hiện không khả dụng'], 400);
        }

        DB::beginTransaction();
        try {
            // Giải phóng bàn cũ nếu có
            if ($order->table_id) {
                $oldTable = RestaurantTable::find($order->table_id);
                if ($oldTable) {
                    $oldTable->status = 'available';
                    $oldTable->save();
                }
            }

            // Gán bàn mới cho order
            $order->table_id = $newTable->id;
            $order->save();

            // Cập nhật trạng thái bàn mới
            $newTable->status = 'occupied';
            $newTable->save();

            DB::commit();

            return response()->json([
                'message' => 'Gán bàn thành công!',
                'order' => $order->load('table'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Lỗi khi gán bàn',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        $user = auth()->user();
        $adminRoles = ['owner', 'manager', 'employee'];
        
        // User thường KHÔNG được phép xóa đơn hàng
        if (!in_array($user->role, $adminRoles)) {
            return response()->json([
                'message' => 'Bạn không có quyền xóa đơn hàng. Chỉ được phép hủy đơn.'
            ], 403);
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

    /**
     * Kiểm tra spam và trùng lịch đặt (Re-usable logic)
     */
    private function performSpamCheck(Request $request) {
        // Cố gắng lấy user từ Token (nếu có, kể cả route public) hoặc session
        $user = $request->user('sanctum') ?? $request->user();
        
        $adminRoles = ['owner', 'manager', 'employee'];
        // Nếu user là admin -> Pass luôn
        if ($user && in_array($user->role, $adminRoles)) {
            return null;
        }
        
        // Logic cho Customer hoặc Guest
        $phone = $request->input('phone');
        
        if (!$user && !$phone) return null; 

        $lastOrderQuery = Order::query();
        if ($user) {
             $lastOrderQuery->where('user_id', $user->id);
        } elseif ($phone) {
             $lastOrderQuery->where('phone', $phone);
        }

        $lastOrder = $lastOrderQuery->latest()->first();

        // 1. Rate Check (5 phút)
        if ($lastOrder && $lastOrder->created_at->diffInMinutes(now()) < 5) {
            return response()->json([
                'message' => 'Bạn thao tác quá nhanh! Vui lòng đợi 5 phút trước khi tạo đơn hàng mới.',
                'remaining_seconds' => 300 - $lastOrder->created_at->diffInSeconds(now())
            ], 429);
        }

        // 2. Strict Active Order Check
        // Chặn nếu người dùng CÓ BẤT KỲ đơn hàng nào chưa hoàn thành (Status 0, 1)
        $activeOrdersQuery = Order::query()->whereIn('status', [0, 1]);
        
        if ($user) {
            $activeOrdersQuery->where('user_id', $user->id);
        } elseif ($phone) {
            $activeOrdersQuery->where('phone', $phone);
        }

        $existingOrder = $activeOrdersQuery->first();

        if ($existingOrder) {
            $statusText = $existingOrder->status == 0 ? 'Chờ xác nhận' : 'Đã xác nhận';
            
            try {
                // Fix lỗi Double time specification: Chỉ lấy phần ngày Y-m-d
                $dateOnly = \Carbon\Carbon::parse($existingOrder->booking_date)->format('Y-m-d');
                $bookingTime = \Carbon\Carbon::parse($dateOnly . ' ' . $existingOrder->booking_time)->format('H:i d/m/Y');
            } catch (\Exception $e) {
                // Fallback nếu parse lỗi
                $bookingTime = $existingOrder->booking_time . ' ' . $existingOrder->booking_date; 
            }
            
            return response()->json([
                'message' => "Bạn đang có đơn hàng chưa hoàn thành (#{$existingOrder->id} lúc $bookingTime - $statusText). Vui lòng hoàn tất hoặc hủy đơn hàng cũ trước khi đặt mới.",
            ], 400);
        }
        return null;
    }

    /**
     * API Check sớm tính khả dụng của đơn hàng
     */
    public function preCheck(Request $request) {
        if ($error = $this->performSpamCheck($request)) {
            return $error;
        }
        return response()->json(['message' => 'Valid']);
    }
}

