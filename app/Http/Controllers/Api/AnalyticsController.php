<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function daily(Request $request)
    {
        $date = $request->input('date', Carbon::today()->toDateString());

        $stats = Order::whereDate('created_at', $date)
            ->select(
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(total_price) as total_revenue'),
                DB::raw('COUNT(CASE WHEN status = 2 THEN 1 END) as completed_orders'),
                DB::raw('COUNT(CASE WHEN status = 3 THEN 1 END) as cancelled_orders'),
                DB::raw('COUNT(CASE WHEN status IN (0, 1) THEN 1 END) as pending_orders')
            )
            ->first();

        return response()->json([
            'period' => 'daily',
            'date' => $date,
            'stats' => $stats
        ]);
    }

    public function monthly(Request $request)
    {
        $month = $request->input('month', Carbon::now()->month);
        $year = $request->input('year', Carbon::now()->year);

        $stats = Order::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->select(
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(total_price) as total_revenue'),
                DB::raw('COUNT(CASE WHEN status = 2 THEN 1 END) as completed_orders'),
                DB::raw('COUNT(CASE WHEN status = 3 THEN 1 END) as cancelled_orders')
            )
            ->first();

        // Get daily breakdown for chart
        $breakdown = Order::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get([
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total_price) as revenue')
            ]);

        return response()->json([
            'period' => 'monthly',
            'month' => $month,
            'year' => $year,
            'stats' => $stats,
            'breakdown' => $breakdown
        ]);
    }

    public function yearly(Request $request)
    {
        $year = $request->input('year', Carbon::now()->year);

        $stats = Order::whereYear('created_at', $year)
            ->select(
                DB::raw('COUNT(*) as total_orders'),
                DB::raw('SUM(total_price) as total_revenue'),
                DB::raw('COUNT(CASE WHEN status = 2 THEN 1 END) as completed_orders')
            )
            ->first();

        // Get monthly breakdown for chart
        $breakdown = Order::whereYear('created_at', $year)
            ->groupBy('month')
            ->orderBy('month', 'ASC')
            ->get([
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as orders'),
                DB::raw('SUM(total_price) as revenue')
            ]);

        return response()->json([
            'period' => 'yearly',
            'year' => $year,
            'stats' => $stats,
            'breakdown' => $breakdown
        ]);
    }

    public function upcoming(Request $request)
    {
        // Lấy các đơn đặt bàn từ hôm nay trở đi, chưa hoàn thành (2) hoặc hủy (3)
        // Status: 0 (Pending), 1 (Confirmed/Processing)
        $bookings = Order::with('table')
            ->whereDate('booking_date', '>=', Carbon::today())
            ->whereIn('status', [0, 1]) 
            ->orderBy('booking_date', 'asc')
            ->orderBy('booking_time', 'asc')
            ->limit(5)
            ->get();

        return response()->json($bookings);
    }
}
