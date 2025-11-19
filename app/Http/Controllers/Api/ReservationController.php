<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Branch;
use Illuminate\Support\Facades\DB;

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

        // Kiểm tra trạng thái và giờ mở cửa
        $branch = Branch::find($data['branch_id']);
        if (!$branch || !$branch->status) {
            return response()->json(['message' => 'Chi nhánh đang đóng cửa, không thể đặt bàn'], 400);
        }

        $reservationHour = date('H:i', strtotime($data['reservation_time']));
        if ($reservationHour < $branch->open_time || $reservationHour > $branch->close_time) {
            return response()->json([
                'message' => "Thời gian đặt bàn ngoài giờ hoạt động ({$branch->open_time} - {$branch->close_time})"
            ], 400);
        }

        DB::transaction(function() use ($data, &$reservation, &$order) {
            $reservation = Reservation::create($data);

            $order = Order::create([
                'user_id' => $data['user_id'],
                'branch_id' => $data['branch_id'],
                'table_id' => $data['table_id'],
                'total_price' => 0,
                'status' => 0,
            ]);
        });

        return response()->json([
            'message' => 'Đặt bàn thành công, đơn hàng đã được tạo!',
            'reservation' => $reservation,
            'order' => $order,
        ], 201);
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

        $branch = Branch::find($data['branch_id']);
        if (!$branch || !$branch->status) {
            return response()->json([
                'available' => false,
                'message' => 'Chi nhánh đang đóng cửa',
                'open_time' => $branch?->open_time,
                'close_time' => $branch?->close_time,
            ]);
        }

        $reservationHour = date('H:i', strtotime($data['date'] . ' ' . $data['time']));
        if ($reservationHour < $branch->open_time || $reservationHour > $branch->close_time) {
            return response()->json([
                'available' => false,
                'message' => "Ngoài giờ hoạt động ({$branch->open_time} - {$branch->close_time})",
            ]);
        }

        $startDateTime = $data['date'] . ' ' . $data['time'];
        $endDateTime = date("Y-m-d H:i:s", strtotime($startDateTime . " +2 hours"));

        $totalCapacity = \App\Models\RestaurantTable::where('branch_id', $data['branch_id'])->sum('seats');
        $totalBookedPeople = Reservation::where('branch_id', $data['branch_id'])
            ->whereBetween('reservation_time', [$startDateTime, $endDateTime])
            ->sum('people');

        $remaining = $totalCapacity - $totalBookedPeople;

        return response()->json([
            'available' => $remaining >= $data['people'],
            'capacity_total' => $totalCapacity,
            'already_booked' => $totalBookedPeople,
            'remaining' => $remaining,
            'requested' => $data['people'],
            'time_start' => $startDateTime,
            'time_end' => $endDateTime,
            'open_time' => $branch->open_time,
            'close_time' => $branch->close_time,
        ]);
    }

    public function getAvailableTables(Request $request)
    {
        $data = $request->validate([
            'branch_id' => 'required|exists:branches,id',
            'date' => 'required|date',
            'time' => 'required',
        ]);

        $branch = Branch::find($data['branch_id']);
        if (!$branch) {
            return response()->json(['message' => 'Chi nhánh không tồn tại'], 404);
        }
        if (!$branch->status) {
            return response()->json([
                'branch' => $branch,
                'total_tables' => 0,
                'reserved_tables' => 0,
                'available_tables_count' => 0,
                'available_tables' => [],
                'message' => 'Chi nhánh đang đóng cửa',
                'open_time' => $branch->open_time,
                'close_time' => $branch->close_time,
            ]);
        }

        $reservationHour = date('H:i', strtotime($data['date'] . ' ' . $data['time']));
        if ($reservationHour < $branch->open_time || $reservationHour > $branch->close_time) {
            return response()->json([
                'branch' => $branch,
                'total_tables' => 0,
                'reserved_tables' => 0,
                'available_tables_count' => 0,
                'available_tables' => [],
                'message' => "Ngoài giờ hoạt động ({$branch->open_time} - {$branch->close_time})",
                'open_time' => $branch->open_time,
                'close_time' => $branch->close_time,
            ]);
        }

        $startDateTime = $data['date'] . ' ' . $data['time'];
        $endDateTime = date("Y-m-d H:i:s", strtotime($startDateTime . " +2 hours"));

        $allTables = \App\Models\RestaurantTable::where('branch_id', $data['branch_id'])->with('branch')->get();
        $reservedTableIds = Reservation::where('branch_id', $data['branch_id'])
            ->whereBetween('reservation_time', [$startDateTime, $endDateTime])
            ->pluck('table_id')
            ->toArray();

        $availableTables = $allTables->filter(fn($table) => !in_array($table->id, $reservedTableIds))->values();

        return response()->json([
            'branch' => $allTables->first()?->branch,
            'total_tables' => $allTables->count(),
            'reserved_tables' => count($reservedTableIds),
            'available_tables_count' => $availableTables->count(),
            'available_tables' => $availableTables,
            'time_start' => $startDateTime,
            'time_end' => $endDateTime,
            'open_time' => $branch->open_time,
            'close_time' => $branch->close_time,
        ]);
    }
}
