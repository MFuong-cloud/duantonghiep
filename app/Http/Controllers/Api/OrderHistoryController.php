<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderHistory;
use Illuminate\Support\Facades\Auth;

class OrderHistoryController extends Controller
{
    /** Lấy toàn bộ lịch sử */
    public function index()
    {
        $history = OrderHistory::with(['order', 'user'])
            ->orderByDesc('id')
            ->get();

        return response()->json(['data' => $history], 200);
    }

    /** Tạo lịch sử mới */
    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id'      => 'required|exists:orders,id',
            'action_status' => 'nullable|integer|in:0,1,2,3',
            'old_value'     => 'nullable|string|max:255',
            'new_value'     => 'nullable|string|max:255',
            'changed_by'    => 'nullable|exists:users,id',
        ]);

        $userId = Auth::id();

        $history = OrderHistory::create([
            'order_id'      => $data['order_id'],
            'action_status' => $data['action_status'] ?? 0,
            'old_value'     => $data['old_value'] ?? null,
            'new_value'     => $data['new_value'] ?? null,
            'changed_by'    => $data['changed_by'] ?? $userId,
            'created_by'    => $userId,
            'updated_by'    => $userId,
        ]);

        return response()->json([
            'message' => 'Tạo lịch sử thành công',
            'data'    => $history->load(['order','user','creator','updater']),
        ], 201);
    }


    /** Lấy chi tiết lịch sử theo ID */
    public function show($id)
    {
        $h = OrderHistory::with(['order', 'user'])->find($id);

        if (!$h)
            return response()->json(['message' => 'Không tìm thấy lịch sử'], 404);

        return response()->json(['data' => $h], 200);
    }

    /** Cập nhật lịch sử (không cho sửa old_value) */
    public function update(Request $request, $id)
    {
        $h = OrderHistory::find($id);

        if (!$h)
            return response()->json(['message' => 'Không tìm thấy lịch sử'], 404);

        $data = $request->validate([
            'action_status' => 'sometimes|integer|in:0,1,2,3',
            'new_value'     => 'nullable|string|max:255',
        ]);

        unset($data['old_value']);

        $data['updated_by'] = Auth::id();

        $h->update($data);

        return response()->json([
            'message' => 'Cập nhật lịch sử thành công',
            'data'    => $h->fresh()->load(['order','user','creator','updater']),
        ], 200);
    }


    /** Xóa lịch sử */
    public function destroy($id)
    {
        $h = OrderHistory::find($id);

        if (!$h)
            return response()->json(['message' => 'Không tìm thấy lịch sử'], 404);

        $h->delete();

        return response()->json(['message' => 'Xóa lịch sử thành công'], 200);
    }
}
