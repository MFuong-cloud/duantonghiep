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
            'table_id' => 'required|exists:tables,id',
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

    public function checkCapacity(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|integer|exists:branches,id',
            'date' => 'required|date',
            'time' => 'required',
            'people' => 'required|integer|min:1',
        ]);

        // Tạo datetime đầy đủ
        $startDateTime = $data['date'] . ' ' . $data['time'];
        $endDateTime = date("Y-m-d H:i:s", strtotime($startDateTime . " +2 hours"));

        // 1. Tổng sức chứa chi nhánh
        $totalCapacity = \App\Models\RestaurantTable::where('branch_id', $data['branch_id'])
            ->sum('seats'); // sử dụng seats

        // 2. Tổng số người đã đặt trong khoảng thời gian
        $totalBookedPeople = Reservation::where('branch_id', $data['branch_id'])
            ->whereBetween('reservation_time', [$startDateTime, $endDateTime])
            ->sum('people');

        // 3. Số lượng còn lại
        $remaining = $totalCapacity - $totalBookedPeople;

        return response()->json([
            'available' => $remaining >= $data['people'],
            'capacity_total' => $totalCapacity,
            'already_booked' => $totalBookedPeople,
            'remaining' => $remaining,
            'requested' => $data['people'],
            'time_start' => $startDateTime,
            'time_end' => $endDateTime,
        ]);
    }


    public function getAvailableTables(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'date' => 'required|date',
            'time' => 'required',
        ]);

        // Tạo datetime đầy đủ
        $startDateTime = $data['date'] . ' ' . $data['time'];
        $endDateTime = date("Y-m-d H:i:s", strtotime($startDateTime . " +2 hours"));

        // Lấy tất cả bàn của chi nhánh
        $allTables = \App\Models\RestaurantTable::where('branch_id', $data['branch_id'])
            ->with('branch')
            ->get();

        // Lấy các bàn đã bị đặt trong khung giờ này
        $reservedTableIds = Reservation::where('branch_id', $data['branch_id'])
            ->whereBetween('reservation_time', [$startDateTime, $endDateTime])
            ->pluck('table_id')
            ->toArray();

        // Lọc bàn còn trống
        $availableTables = $allTables->filter(function ($table) use ($reservedTableIds) {
            return !in_array($table->id, $reservedTableIds);
        })->values();

        return response()->json([
            'branch' => $allTables->first()?->branch,
            'total_tables' => $allTables->count(),
            'reserved_tables' => count($reservedTableIds),
            'available_tables_count' => $availableTables->count(),
            'available_tables' => $availableTables,
            'time_start' => $startDateTime,
            'time_end' => $endDateTime,
        ]);
    }


}
