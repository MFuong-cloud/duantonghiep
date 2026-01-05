<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Payment;
use App\Models\OrderHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MoMoController extends Controller
{
    /**
     * Tạo thanh toán MoMo
     */
    public function momo_payment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
        ]);

        $order = Order::findOrFail($request->order_id);

        // Kiểm tra số tiền (MoMo yêu cầu: 1,000 - 50,000,000 VNĐ)
        if ($order->total_price < 1000) {
            return response()->json([
                'success' => false,
                'message' => 'Số tiền thanh toán tối thiểu là 1,000 VNĐ'
            ], 400);
        }

        if ($order->total_price > 50000000) {
            return response()->json([
                'success' => false,
                'message' => 'Số tiền thanh toán tối đa là 50,000,000 VNĐ'
            ], 400);
        }

        // Cấu hình MoMo
        $endpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
        $partnerCode = 'MOMOBKUN20180529';
        $accessKey = 'klm05TvNBzhg7h7j';
        $secretKey = 'at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa';
        
        $orderInfo = "Thanh toán đơn hàng #{$order->id}";
        $amount = $order->total_price;
        $orderId = $order->id . '_' . time();
        $redirectUrl = url('/api/momo/return');
        $ipnUrl = url('/api/momo/notify');
        $extraData = base64_encode(json_encode(['order_id' => $order->id]));

        $requestId = time() . "";
        $requestType = "captureWallet"; // Quét QR code (ổn định hơn cho test)

        // Tạo signature
        $rawHash = "accessKey=" . $accessKey . 
                   "&amount=" . $amount . 
                   "&extraData=" . $extraData . 
                   "&ipnUrl=" . $ipnUrl . 
                   "&orderId=" . $orderId . 
                   "&orderInfo=" . $orderInfo . 
                   "&partnerCode=" . $partnerCode . 
                   "&redirectUrl=" . $redirectUrl . 
                   "&requestId=" . $requestId . 
                   "&requestType=" . $requestType;

        $signature = hash_hmac("sha256", $rawHash, $secretKey);

        $data = array(
            'partnerCode' => $partnerCode,
            'partnerName' => "Restaurant",
            "storeId" => "RestaurantStore",
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $redirectUrl,
            'ipnUrl' => $ipnUrl,
            'lang' => 'vi',
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature
        );

        $result = $this->execPostRequest($endpoint, json_encode($data));
        $jsonResult = json_decode($result, true);

        Log::info('MoMo Payment Request:', $jsonResult);

        // Kiểm tra response từ MoMo
        if (!isset($jsonResult['payUrl'])) {
            Log::error('MoMo Error Response:', $jsonResult);
            
            $errorMessage = $jsonResult['message'] ?? 'Không thể tạo link thanh toán MoMo';
            
            return response()->json([
                'success' => false,
                'message' => $errorMessage,
                'error' => $jsonResult
            ], 500);
        }

        // Redirect đến trang thanh toán MoMo
        return redirect()->to($jsonResult['payUrl']);
    }

    /**
     * Xử lý khi user quay lại từ MoMo
     */
    public function momo_return(Request $request)
    {
        Log::info('MoMo Return:', $request->all());

        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        
        if ($request->resultCode == 0) {
            // Thanh toán thành công - Cập nhật order ngay
            DB::beginTransaction();
            try {
                $extraData = json_decode(base64_decode($request->extraData), true);
                $orderId = $extraData['order_id'] ?? null;

                if ($orderId) {
                    $order = Order::find($orderId);

                    if ($order && $order->status != 2) {
                        // Tạo payment
                        Payment::create([
                            'user_id' => $order->user_id,
                            'order_id' => $order->id,
                            'amount' => $request->amount,
                            'method' => 'momo',
                            'status' => 'success',
                            'transaction_code' => $request->transId,
                            'paid_at' => now(),
                        ]);

                        // Update order status
                        $oldStatus = $order->status;
                        $order->update(['status' => 2]); // 2 = Hoàn thành

                        // Lưu lịch sử
                        OrderHistory::create([
                            'order_id' => $order->id,
                            'action_status' => 2,
                            'old_value' => (string)$oldStatus,
                            'new_value' => '2',
                            'changed_by' => $order->user_id,
                            'created_by' => $order->user_id,
                        ]);

                        DB::commit();
                        Log::info('MoMo: Order #' . $orderId . ' updated to completed');
                    }
                }
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('MoMo Return Error:', ['message' => $e->getMessage()]);
            }
            
            // Redirect về frontend với thông báo thành công
            return redirect($frontendUrl . '/admin/orders?payment=success&order_id=' . $orderId);
        }

        // Thanh toán thất bại - Redirect về frontend
        return redirect($frontendUrl . '/admin/orders?payment=failed&message=' . urlencode($request->message));
    }

    /**
     * Webhook từ MoMo (IPN)
     */
    public function momo_notify(Request $request)
    {
        Log::info('MoMo IPN:', $request->all());

        if ($request->resultCode == 0) {
            DB::beginTransaction();
            try {
                $extraData = json_decode(base64_decode($request->extraData), true);
                $orderId = $extraData['order_id'] ?? null;

                if ($orderId) {
                    $order = Order::find($orderId);

                    if ($order && $order->status != 2) {
                        // Tạo payment
                        Payment::create([
                            'user_id' => $order->user_id,
                            'order_id' => $order->id,
                            'amount' => $request->amount,
                            'method' => 'momo',
                            'status' => 'success',
                            'transaction_code' => $request->transId,
                            'paid_at' => now(),
                        ]);

                        // Update order
                        $oldStatus = $order->status;
                        $order->update(['status' => 2]);

                        // Lưu lịch sử
                        OrderHistory::create([
                            'order_id' => $order->id,
                            'action_status' => 2,
                            'old_value' => (string)$oldStatus,
                            'new_value' => '2',
                            'changed_by' => $order->user_id,
                            'created_by' => $order->user_id,
                        ]);

                        DB::commit();
                    }
                }
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('MoMo IPN Error:', ['message' => $e->getMessage()]);
            }
        }

        return response()->json(['message' => 'OK'], 200);
    }

    /**
     * Helper: Gửi POST request
     */
    private function execPostRequest($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data)
        ));
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        
        $result = curl_exec($ch);
        curl_close($ch);
        
        return $result;
    }
}
