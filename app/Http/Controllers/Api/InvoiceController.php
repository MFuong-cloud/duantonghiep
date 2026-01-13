<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentGroup;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * Xuất hóa đơn cho đơn hàng đơn lẻ
     * 
     * GET /api/invoices/order/{id}
     * Query params: ?download=1 (để tải về)
     */
    public function generateOrderInvoice(Request $request, $id)
    {
        try {
            set_time_limit(300); // Tăng thời gian chờ lên 5 phút
            $order = Order::with(['details.dish', 'table', 'user'])->find($id);

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Đơn hàng không tồn tại',
                ], 404);
            }

            // Kiểm tra quyền truy cập (chỉ cho phép user sở hữu hoặc admin)
            $user = auth()->user();
            if (!$user) {
                 return response()->json([
                     'success' => false,
                     'message' => 'Vui lòng đăng nhập',
                 ], 401);
            }

            // Chuẩn hóa role về chữ thường để so sánh
            $userRole = strtolower($user->role ?? '');

            $isAdmin = in_array($userRole, ['admin', 'quản lý', 'manager', 'staff', 'nhân viên', 'owner']); // Updated to include owner
            $isOwner = $order->user_id === $user->id;

            if (!$isAdmin && !$isOwner) {
                 \Log::warning("Invoice Access Denied: User {$user->id} (Role: {$userRole}) is not privileged and not owner.");
                 return response()->json([
                     'success' => false,
                     'message' => 'Bạn không có quyền xem hóa đơn này',
                 ], 403);
            }

            // Xác định phương thức thanh toán
            // Nếu có quan hệ payment thì lấy, không thì mặc định là cash (hoặc kiểm tra logic khác)
            $paymentMethod = $order->payment ? $order->payment->method : 'cash';

            $pdf = Pdf::loadView('invoices.order', [
                'order' => $order,
                'paymentMethod' => $paymentMethod
            ]);

            $pdf->setPaper('a4', 'portrait');

            $filename = 'hoa-don-' . ($order->code ?? $order->id) . '.pdf';

            // Nếu có param download=1 thì tải về, không thì hiển thị inline
            if ($request->query('download') == '1') {
                return $pdf->download($filename);
            }

            return $pdf->stream($filename);
        } catch (\Exception $e) {
            \Log::error('Error generating invoice for order ' . $id);
            \Log::error('Error message: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Không thể tạo hóa đơn. Vui lòng thử lại sau.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Xuất hóa đơn cho nhóm thanh toán gộp
     * 
     * GET /api/invoices/payment-group/{id}
     * Query params: ?download=1 (để tải về)
     */
    public function generatePaymentGroupInvoice(Request $request, $id)
    {
        set_time_limit(300); // Tăng thời gian chờ lên 5 phút
        $paymentGroup = PaymentGroup::with(['orders.details.dish', 'orders.table', 'orders.user', 'creator'])
            ->find($id);

        if (!$paymentGroup) {
            return response()->json([
                'success' => false,
                'message' => 'Nhóm thanh toán không tồn tại',
            ], 404);
        }

        $pdf = Pdf::loadView('invoices.payment-group', [
            'paymentGroup' => $paymentGroup
        ]);

        $pdf->setPaper('a4', 'portrait');

        $filename = 'hoa-don-gop-' . $paymentGroup->group_code . '.pdf';

        // Nếu có param download=1 thì tải về, không thì hiển thị inline
        if ($request->query('download') == '1') {
            return $pdf->download($filename);
        }

        return $pdf->stream($filename);
    }
}
