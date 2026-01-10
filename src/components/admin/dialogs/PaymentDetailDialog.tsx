"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Payment } from "@/model/Payment";
import { CreditCard, User, Calendar, Clock, Receipt, Hash, CheckCircle2, UtensilsCrossed } from "lucide-react";

interface PaymentDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    payment: Payment | null;
}

export default function PaymentDetailDialog({ open, onOpenChange, payment }: PaymentDetailDialogProps) {
    if (!payment) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        return d.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'momo':
                return 'MoMo';
            case 'cash':
                return 'Tiền mặt';
            default:
                return method;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl h-[95vh] flex flex-col">
                <DialogTitle className="sr-only">Chi tiết thanh toán</DialogTitle>

                {/* Header - Fixed */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] shrink-0">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Receipt className="w-6 h-6 text-green-600" />
                        Chi tiết thanh toán
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Mã đơn hàng: <span className="font-mono font-semibold">{payment.order?.code || payment.order_id}</span>
                    </p>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                        {/* Payment Status */}
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-full">
                                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-green-900 dark:text-green-100">Thanh toán thành công</p>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                        {formatDateTime(payment.paid_at || payment.created_at)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-blue-600" />
                                        Thông tin thanh toán
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
                                            <span className="font-mono font-semibold text-blue-600">{payment.order?.code || payment.order_id}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Số tiền:</span>
                                            <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                                                {formatCurrency(payment.amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Phương thức:</span>
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase ${payment.method === 'momo'
                                                ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                                                }`}>
                                                {getPaymentMethodLabel(payment.method)}
                                            </span>
                                        </div>
                                        {payment.transaction_code && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Mã giao dịch:</span>
                                                <span className="font-mono text-sm text-gray-900 dark:text-gray-100">
                                                    {payment.transaction_code}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4 text-purple-600" />
                                        Thông tin khách hàng
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Họ tên:</span>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {payment.order?.ho_ten || payment.user?.name || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                                            <span className="font-mono text-gray-900 dark:text-gray-100">
                                                {payment.order?.phone || 'N/A'}
                                            </span>
                                        </div>
                                        {payment.user?.email && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                                    {payment.user.email}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Details */}
                        {payment.order && (
                            <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                                    Thông tin đặt bàn
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">Ngày đặt:</span>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {payment.order.booking_date ? new Date(payment.order.booking_date).toLocaleDateString('vi-VN') : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">Giờ đặt:</span>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {payment.order.booking_time || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="w-4 h-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">Số người:</span>
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                {payment.order.quantity} người
                                            </span>
                                        </div>
                                        {payment.order.table && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Hash className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-600 dark:text-gray-400">Bàn:</span>
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {payment.order.table.name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {payment.order.note && (
                                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Ghi chú:</p>
                                        <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">{payment.order.note}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Order Items */}
                        {payment.order?.details && payment.order.details.length > 0 && (
                            <div className="bg-gray-50 dark:bg-[#2a2a2a] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Món ăn đã đặt</h3>
                                <div className="space-y-2">
                                    {payment.order.details.map((detail) => (
                                        <div key={detail.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {detail.dish?.name || `Món ${detail.dish_id}`}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatCurrency(detail.price)} x {detail.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                                                {formatCurrency(detail.price * detail.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300 dark:border-gray-600">
                                        <p className="font-bold text-gray-900 dark:text-white">Tổng cộng:</p>
                                        <p className="font-bold text-green-600 dark:text-green-400 text-xl">
                                            {formatCurrency(payment.amount)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
