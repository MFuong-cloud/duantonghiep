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
        'name' => 'required|string|max:255|unique:tables,name',
        'seats' => 'required|integer|min:1',
        'status' => 'required|string|in:available,occupied,reserved',
        'branch_id' => 'required|integer|exists:branches,id'
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

        $res =  Reservation::find($id);
        if (!$res) return response()->json(['message' => 'Không tìm thấy đặt bàn!'], 404);

        $data = $request->validate([
            'name' => 'sometimes|required|string|max:100|unique:tables,name,' . $id,
            'seats' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|required|string|in:available,occupied,reserved',
            'branch_id' => 'sometimes|required|integer|exists:branches,id',
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

    public function available()
{
    // 1️⃣ Lấy danh sách bàn có trạng thái "available"
    $tables = Reservation::where('status', 'available')->get();

    // 2️⃣ Nếu không có bàn trống
    if ($tables->isEmpty()) {
        return response()->json([
            'message' => 'Hiện không còn bàn trống!',
            'data' => []
        ], 200);
    }

    // 3️⃣ Trả danh sách bàn trống
    return response()->json([
        'message' => 'Danh sách bàn trống hiện tại:',
        'data' => $tables
    ], 200);
}

}
