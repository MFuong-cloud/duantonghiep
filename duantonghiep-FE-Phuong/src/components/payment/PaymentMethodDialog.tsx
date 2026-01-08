'use client';

import React, { useState } from 'react';
import { X, Wallet, CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethodDialogProps {
    orderId: number;
    orderAmount: number;
    onClose: () => void;
    onSuccess?: () => void;
}

const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
    orderId,
    orderAmount,
    onClose,
    onSuccess
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'cash' | 'momo'>('momo');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handleCashPayment = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                toast.error('Vui lòng đăng nhập');
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/api/payments/fake', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: orderId,
                    method: 'cash'
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Thanh toán tiền mặt thành công!');
                toast.success(`Đơn hàng #${orderId} đã hoàn thành`);
                onSuccess?.();
                setTimeout(() => onClose(), 1500);
            } else {
                toast.error(data.message || 'Thanh toán thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra');
            console.error('Cash payment error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMoMoPayment = async () => {
        setIsLoading(true);

        const token = localStorage.getItem('authToken');
        if (!token) {
            toast.error('Vui lòng đăng nhập');
            setIsLoading(false);
            return;
        }

        toast.loading('Đang chuyển đến trang thanh toán MoMo...');

        // Tạo form và submit
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'http://127.0.0.1:8000/api/momo/payment';

        // Thêm order_id
        const orderInput = document.createElement('input');
        orderInput.type = 'hidden';
        orderInput.name = 'order_id';
        orderInput.value = orderId.toString();
        form.appendChild(orderInput);

        document.body.appendChild(form);
        form.submit();
    };

    const handlePayment = () => {
        if (selectedMethod === 'cash') {
            handleCashPayment();
        } else {
            handleMoMoPayment();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        Chọn phương thức thanh toán
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Order Info */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
                            <span className="font-semibold text-gray-800 dark:text-gray-200">#{orderId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tổng tiền:</span>
                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(orderAmount)}
                            </span>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-3">
                        {/* MoMo */}
                        <label
                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedMethod === 'momo'
                                ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                        >
                            <input
                                type="radio"
                                name="payment-method"
                                value="momo"
                                checked={selectedMethod === 'momo'}
                                onChange={(e) => setSelectedMethod(e.target.value as 'momo')}
                                disabled={isLoading}
                                className="sr-only"
                            />
                            <div className="p-2 rounded-lg bg-pink-500 mr-3">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold ${selectedMethod === 'momo' ? 'text-pink-700 dark:text-pink-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Ví MoMo
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Quét mã QR để thanh toán</p>
                            </div>
                            {selectedMethod === 'momo' && (
                                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </label>

                        {/* Cash */}
                        <label
                            className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedMethod === 'cash'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
                        >
                            <input
                                type="radio"
                                name="payment-method"
                                value="cash"
                                checked={selectedMethod === 'cash'}
                                onChange={(e) => setSelectedMethod(e.target.value as 'cash')}
                                disabled={isLoading}
                                className="sr-only"
                            />
                            <div className="p-2 rounded-lg bg-green-500 mr-3">
                                <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-semibold ${selectedMethod === 'cash' ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Tiền mặt
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Thanh toán trực tiếp</p>
                            </div>
                            {selectedMethod === 'cash' && (
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg shadow-blue-500/30"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Thanh toán ngay'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethodDialog;
