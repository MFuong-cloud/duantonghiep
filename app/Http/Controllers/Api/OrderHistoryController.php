<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderHistoryController extends Controller
{
    public function index()
    {
        // $history = OrderHistory::with(['order', 'user'])->get();
        // return response()->json($history);
         $user = auth()->user();

        // Bắt buộc đăng nhập
        if (!$user) {
            return response()->json([
                'message' => 'Vui lòng đăng nhập để xem lịch sử',
                'data' => []
            ], 401);
        }
        // Admin (owner, manager, employee) xem được TẤT CẢ lịch sử
        $adminRoles = ['owner', 'manager', 'employee'];
        if (in_array($user->role, $adminRoles)) {
            $history = OrderHistory::with(['order', 'user'])
                ->orderByDesc('id')
                ->get();
        } else {
            // User thường (customer) chỉ xem lịch sử của orders của mình
            $history = OrderHistory::with(['order', 'user'])
                ->whereHas('order', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->orderByDesc('id')
                ->get();
        }

        return response()->json(['data' => $history], 200);
    }

    public function store(Request $request)
    {
        // $data = $request->validate([
        //     'order_id' => 'required|exists:orders,id',
        //     'action_status' => 'required|integer|in:0,1,2,3',
        //     'old_value' => 'nullable|string|max:255',
        //     'new_value' => 'nullable|string|max:255',
        //     'changed_by' => 'nullable|exists:users,id',
        // ]);

        // $history = OrderHistory::create($data);
        // return response()->json([
        //     'message' => 'Thêm lịch sử đơn hàng thành công!',
        //     'data' => $history
        // ], 201);
        $data = $request->validate([
            'order_id'      => 'required|exists:orders,id',
            'action_status' => 'nullable|integer|in:0,1,2,3',
            'old_value'     => 'nullable|string|max:255',
            'new_value'     => 'nullable|string|max:255',
            'changed_by'    => 'nullable|exists:users,id',
        ]);

        $userId = Auth::id();

        $history = OrderHistory::create([
            'order_id' => $data['order_id'],
            'action_status' => $data['action_status'] ?? 0,
            'old_value' => $data['old_value'] ?? null,
            'new_value' => $data['new_value'] ?? null,
            'changed_by' => $data['changed_by'] ?? $userId,
            'created_by' => $userId ?? null,
            'updated_by' => $userId ?? null,
        ]);

        return response()->json([
            'message' => 'Tạo lịch sử thành công',
            'data'    => $history->load(['order','user','creator','updater']),
        ], 201);
    }

    public function show($id)
    {
        $history = OrderHistory::with(['order', 'user'])->find($id);
        if (!$history) {
            return response()->json(['message' => 'Không tìm thấy lịch sử đơn hàng!'], 404);
        }
        return response()->json($history);
    }

    public function update(Request $request, $id)
    {
        $history = OrderHistory::find($id);
        if (!$history) {
            return response()->json(['message' => 'Không tìm thấy lịch sử đơn hàng!'], 404);
        }

        $data = $request->validate([
            'action_status' => 'sometimes|integer|in:0,1,2,3',
            'old_value' => 'nullable|string|max:255',
            'new_value' => 'nullable|string|max:255',
        ]);

        $history->update($data);
        return response()->json([
            'message' => 'Cập nhật lịch sử đơn hàng thành công!',
            'data' => $history
        ]);
    }

    public function destroy($id)
    {
        $history = OrderHistory::find($id);
        if (!$history) {
            return response()->json(['message' => 'Không tìm thấy lịch sử đơn hàng!'], 404);
        }

        $history->delete();
        return response()->json(['message' => 'Xóa lịch sử đơn hàng thành công!']);
    }
}
