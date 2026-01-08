<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\OrderHistory;
use App\Mail\OrderReminderMail;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SendOrderReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:remind';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Gửi email nhắc nhở khách hàng trước giờ đặt 15 phút';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Bắt đầu quét gửi email nhắc nhở...");

        // Lấy đơn Status 1 (Đã xác nhận)
        $orders = Order::where('status', 1)->get();
        $now = Carbon::now(); // Timezone App (Asia/Ho_Chi_Minh)
        
        $count = 0;

        foreach ($orders as $order) {
            try {
                $dateOnly = Carbon::parse($order->booking_date)->format('Y-m-d');
                $bookingDateTime = Carbon::parse($dateOnly . ' ' . $order->booking_time);

                // Tính thời gian còn lại (phút)
                // bookingDateTime - now
                $diffInMinutes = $now->diffInMinutes($bookingDateTime, false); 
                
                // Logic: Gửi nếu còn khoảng 13-17 phút (để bao phủ nếu cron chạy lệch 1-2 phút)
                if ($diffInMinutes >= 13 && $diffInMinutes <= 17) {
                    
                    // Check xem đã gửi chưa (dựa vào OrderHistory action_status = 9)
                    $sent = OrderHistory::where('order_id', $order->id)
                        ->where('action_status', 9) 
                        ->exists();

                    if (!$sent) {
                        // Xác định người nhận
                        $recipient = null;
                        
                        if ($order->user && $order->user->email) {
                            $recipient = $order->user->email;
                        }
                        // Nếu sau này Order có cột email cho guest thì thêm vào đây:
                        // elseif ($order->guest_email) { $recipient = $order->guest_email; }

                        if ($recipient) {
                            Mail::to($recipient)->send(new OrderReminderMail($order));
                            
                            // Ghi Log đã gửi (Đánh dấu đã gửi)
                            OrderHistory::create([
                                'order_id' => $order->id,
                                'action_status' => 9, // 9 = Reminder Sent (Quy ước mới)
                                'old_value' => (string)$order->status,
                                'new_value' => (string)$order->status,
                                'changed_by' => null, // System
                                'note' => 'Đã gửi email nhắc nhở trước 15 phút'
                            ]);
                            
                            $this->info("Đã gửi nhắc nhở cho Order #{$order->id} tới email {$recipient}");
                            Log::channel('daily')->info("REMINDER SENT: Order #{$order->id} - Email: {$recipient}");
                            $count++;
                        } else {
                             // $this->warn("Order #{$order->id} sắp đến giờ nhưng không có email.");
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error("Reminder Error Order #{$order->id}: " . $e->getMessage());
            }
        }
        
        $this->info("Hoàn tất. Đã gửi {$count} email.");
    }
}
