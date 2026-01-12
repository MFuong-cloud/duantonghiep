import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Phone, Calendar, Clock, Users, LayoutGrid, FileText, UtensilsCrossed, DollarSign } from "lucide-react";
import { Order } from "@/model/Order";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    order: Order | null;
}

export default function OrderDetailDialog({ open, onOpenChange, order }: OrderDetailDialogProps) {
    if (!order) return null;

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return "Chờ xác nhận";
            case 1: return "Đã xác nhận";
            case 2: return "Đã hoàn thành";
            case 3: return "Đã hủy";
            case 4: return "Đã tiếp khách";
            default: return "Không xác định";
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
            case 1: return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            case 2: return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            case 3: return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
            case 4: return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const formatTime = (time: string | number) => {
        if (!time) return "N/A";
        if (typeof time === 'string') return time.substring(0, 5); // HH:mm
        const hours = Math.floor(time);
        return `${hours.toString().padStart(2, '0')}:00`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
                <div className="relative px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết đơn đặt chỗ</DialogTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400 block mt-1">Mã đơn: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{order.code || order.id}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-4 h-full">
                        {/* Cột trái */}
                        <div className="space-y-4">
                            {/* Thông tin khách hàng */}
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <User className="w-3.5 h-3.5 text-blue-600" />
                                    Thông tin khách hàng
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                                            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Họ và tên</label>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{order.ho_ten}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg shrink-0">
                                            <Phone className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Số điện thoại</label>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{order.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin đặt chỗ */}
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                                    Thông tin đặt chỗ
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg shrink-0">
                                            <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Ngày đặt</label>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatDate(order.booking_date)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg shrink-0">
                                            <Clock className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Giờ đặt</label>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatTime(order.booking_time)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shrink-0">
                                            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Số người</label>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{order.quantity} người</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg shrink-0">
                                            <LayoutGrid className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Bàn</label>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                                {order.table
                                                    ? `${order.table.name}${order.table.deleted_at ? ' (Đã xóa)' : ''} (${order.table.capacity} người)`
                                                    : "Chưa chọn bàn"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ghi chú */}
                            {order.note && (
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-2 flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5 text-gray-600" />
                                        Ghi chú
                                    </h3>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-2 border-gray-300 dark:border-gray-600">{order.note}</p>
                                </div>
                            )}
                        </div>

                        {/* Cột phải */}
                        <div className="flex flex-col gap-4 h-full">
                            {/* Món đã chọn */}
                            {order.details && order.details.length > 0 && (
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 flex flex-col min-h-0">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 flex items-center gap-2 shrink-0">
                                        <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                                        Món đã chọn ({order.details.length})
                                    </h3>
                                    <div className="space-y-2.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                        {order.details.map((detail) => (
                                            <div key={detail.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg shrink-0">
                                                        <UtensilsCrossed className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-semibold truncate ${detail.dish?.deleted_at ? 'text-red-500 dark:text-red-400 italic' : 'text-gray-900 dark:text-gray-100'}`}>
                                                            {detail.dish ? (detail.dish.deleted_at ? `${detail.dish.name} (Đã xóa)` : detail.dish.name) : `Món #${detail.dish_id}`}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Số lượng: {detail.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="text-base font-bold text-green-600 dark:text-green-400 ml-2">{formatPrice(detail.price * detail.quantity)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tổng tiền */}
                            {/* Tổng tiền */}
                            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 shadow-sm border border-green-200 dark:border-green-800 shrink-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-green-600 dark:bg-green-500 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-white" />
                                    </div>
                                    <label className="text-xs font-bold text-green-900 dark:text-green-200 uppercase tracking-wider">Tổng tiền</label>
                                </div>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatPrice(order.total_price)}</p>
                            </div>

                            {/* Trạng thái */}
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 shrink-0">
                                <label className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider block mb-2">Trạng thái</label>
                                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-5 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8 h-11 text-base">Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
