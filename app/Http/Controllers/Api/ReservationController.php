<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json(Reservation::with(['branch', 'table', 'user'])->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'table_id' => 'required|exists:restaurant_tables,id',
            'user_id' => 'required|exists:users,id',
            'reservation_time' => 'required|date',
            'status' => 'integer|in:0,1,2,3',
            'note' => 'nullable|string|max:500',
        ]);

        $reservation = Reservation::create($data);
        return response()->json(['message' => 'Đặt bàn thành công!', 'data' => $reservation], 201);
    }

    public function show($id)
    {
        $res = Reservation::with(['branch', 'table', 'user'])->find($id);
        if (!$res) return response()->json(['message' => 'Không tìm thấy đặt bàn!'], 404);
        return response()->json($res);
    }

    public function update(Request $request, $id)
    {
        $res = Reservation::find($id);
        if (!$res) return response()->json(['message' => 'Không tìm thấy đặt bàn!'], 404);

        $data = $request->validate([
            'status' => 'integer|in:0,1,2,3',
            'note' => 'nullable|string|max:500',
        ]);

        $res->update($data);
        return response()->json(['message' => 'Cập nhật đặt bàn thành công!', 'data' => $res]);
    }

    public function destroy($id)
    {
        $res = Reservation::find($id);
        if (!$res) return response()->json(['message' => 'Không tìm thấy đặt bàn!'], 404);
        $res->delete();
        return response()->json(['message' => 'Xóa đặt bàn thành công!']);
    }
}
