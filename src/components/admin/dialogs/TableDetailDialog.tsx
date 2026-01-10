import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table } from "@/model/Table";
import { Order } from "@/model/Order";
import { LayoutGrid, Users, Calendar, ShoppingCart, DollarSign, Clock } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface TableDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    table: Table | null;
    ordersToday: number;
    activeOrders: Order[];
}

export default function TableDetailDialog({
    open,
    onOpenChange,
    table,
    ordersToday,
    activeOrders
}: TableDetailDialogProps) {
    if (!table) return null;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "available":
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Trống</span>;
            case "occupied":
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Đang dùng</span>;
            case "reserved":
                return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Đã đặt</span>;
            default:
                return null;
        }
    };

    const getOrderStatusText = (status: number) => {
        switch (status) {
            case 0: return "Chờ xác nhận";
            case 1: return "Đã xác nhận";
            case 2: return "Đã hoàn thành";
            case 3: return "Đã hủy";
            default: return "Không xác định";
        }
    };

    const formatTime = (time: string | number) => {
        if (!time) return "N/A";
        if (typeof time === 'string') return time.substring(0, 5);
        const hours = Math.floor(time);
        return `${hours.toString().padStart(2, '0')}:00`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[900px] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                Chi tiết {table.name}
                            </DialogTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Sức chứa: {table.capacity} người • Trạng thái: {getStatusBadge(table.status)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-medium text-blue-900 dark:text-blue-200">Đơn hôm nay</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{ordersToday}</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2 mb-2">
                                <ShoppingCart className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span className="text-xs font-medium text-green-900 dark:text-green-200">Đơn đang hoạt động</span>
                            </div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeOrders.length}</p>
                        </div>
                    </div>

                    {/* Active Orders */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-blue-600" />
                            Đơn hàng đang hoạt động
                        </h3>

                        {activeOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3 inline-block">
                                    <ShoppingCart className="w-8 h-8 opacity-50" />
                                </div>
                                <p>Không có đơn hàng nào</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {activeOrders.map((order) => (
                                    <div key={order.id} className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{order.code || order.id} - {order.ho_ten}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{order.phone}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 0
                                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {getOrderStatusText(order.status)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 text-sm mb-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-300">{formatDate(order.booking_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-300">{formatTime(order.booking_time)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-gray-600 dark:text-gray-300">{order.quantity} người</span>
                                            </div>
                                        </div>

                                        {order.details && order.details.length > 0 && (
                                            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3">
                                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Món đã chọn:</p>
                                                <div className="space-y-1">
                                                    {order.details.map((detail) => (
                                                        <div key={detail.id} className="flex justify-between text-sm">
                                                            <span className="text-gray-700 dark:text-gray-300">
                                                                {detail.dish?.name || `Món ${detail.dish_id}`} x{detail.quantity}
                                                            </span>
                                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                                {formatPrice(detail.price * detail.quantity)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mt-3 flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tổng tiền:</span>
                                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{formatPrice(order.total_price)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8">Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
