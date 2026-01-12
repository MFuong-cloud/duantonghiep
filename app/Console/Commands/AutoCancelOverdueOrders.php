<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\OrderHistory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AutoCancelOverdueOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:auto-cancel';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Tự động hủy đơn hàng nếu quá giờ đặt 15 phút mà chưa được tiếp khách';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Bắt đầu quét các đơn hàng quá hạn...');

        // Lấy các đơn hàng chưa hoàn thành và chưa hủy (Status 0: Chờ xác nhận, 1: Đã xác nhận)
        // Status 4 là Đã tiếp khách (an toàn), 2 là Hoàn thành, 3 là Đã hủy
        $orders = Order::whereIn('status', [0, 1])
            ->get();

        $count = 0;
        $now = Carbon::now();

        foreach ($orders as $order) {
            try {
                // Kết hợp ngày và giờ đặt (đảm bảo format ngày đúng)
                $dateOnly = Carbon::parse($order->booking_date)->format('Y-m-d');
                $bookingDateTime = Carbon::parse($dateOnly . ' ' . $order->booking_time);
                
                // Thời gian giới hạn là giờ đặt + 15 phút
                $limitTime = $bookingDateTime->copy()->addMinutes(15);

                // Nếu thời gian hiện tại đã vượt quá thời gian giới hạn
                if ($now->greaterThan($limitTime)) {
                    DB::beginTransaction();

                    $oldStatus = $order->status;
                    
                    // Cập nhật trạng thái sang Đã hủy (3)
                    $order->update(['status' => 3]);

                    // Giải phóng bàn nếu có
                    if ($order->table_id) {
                        $table = \App\Models\RestaurantTable::find($order->table_id);
                        if ($table) {
                            $table->status = 'available';
                            $table->save();
                        }
                    }

                    // Ghi lịch sử
                    OrderHistory::create([
                        'order_id' => $order->id,
                        'action_status' => 3,
                        'old_value' => (string)$oldStatus,
                        'new_value' => '3',
                        'changed_by' => null, // null biểu thị hệ thống tự động
                        'note' => 'Hủy tự động do khách không đên sau 15 phút'
                    ]);

                    DB::commit();
                    
                    $this->info("Đã hủy đơn hàng #{$order->id} (Đặt lúc: {$bookingDateTime}, Hạn chót: {$limitTime})");
                    Log::channel('daily')->info("AUTO-CANCEL: Successfully cancelled Order #{$order->id}. Booking: {$bookingDateTime}. Now: {$now}");
                    
                    $count++;
                }
            } catch (\Exception $e) {
                DB::rollBack();
                $this->error("Lỗi khi xử lý đơn hàng #{$order->id}: " . $e->getMessage());
                Log::error("AUTO-CANCEL FAIL Order #{$order->id}: " . $e->getMessage());
            }
        }

        $this->info("Hoàn tất. Đã hủy tự động {$count} đơn hàng.");
    }
}
