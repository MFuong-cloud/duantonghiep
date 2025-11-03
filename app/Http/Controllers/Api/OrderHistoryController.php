<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderHistory;
use Illuminate\Http\Request;

class OrderHistoryController extends Controller
{
    public function index()
    {
        $history = OrderHistory::with(['order', 'user'])->get();
        return response()->json($history);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'action_status' => 'required|integer|in:0,1,2,3',
            'old_value' => 'nullable|string|max:255',
            'new_value' => 'nullable|string|max:255',
            'changed_by' => 'nullable|exists:users,id',
        ]);

        $history = OrderHistory::create($data);
        return response()->json([
            'message' => 'Thêm lịch sử đơn hàng thành công!',
            'data' => $history
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
