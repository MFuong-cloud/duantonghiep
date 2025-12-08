"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Utensils, Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppPromoSection from "@/components/aboutSection/page";
import { OrderService } from "@/api/orders/order.service";
import { Order } from "@/model/Order";
import { toast } from "sonner";

export default function BookingHistoryPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const data = await OrderService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Không thể tải lịch sử đặt hàng");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatTime = (time: number | string) => {
        let hours = 0;
        let minutes = 0;

        // Nếu là số (ví dụ: 18)
        if (typeof time === 'number') {
            hours = time;
            minutes = 0;
        }
        // Nếu là chuỗi dạng 00:00:21 (lỗi từ database)
        else if (typeof time === 'string' && time.match(/^00:00:\d+$/)) {
            hours = parseInt(time.split(':')[2]);
            minutes = 0;
        }
        // Nếu đã đúng format HH:MM hoặc HH:MM:SS
        else if (typeof time === 'string' && time.includes(':')) {
            const parts = time.split(':');
            hours = parseInt(parts[0]);
            minutes = parseInt(parts[1]);
        }
        // Fallback
        else {
            return time.toString();
        }

        // Giữ format 24h nhưng thêm AM/PM
        const period = hours >= 12 ? 'PM' : 'AM';

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 0: return "Chờ xác nhận";
            case 1: return "Đã xác nhận";
            case 2: return "Hoàn thành";
            case 3: return "Đã hủy";
            default: return "Không xác định";
        }
    };

    const getStatusColor = (status: number) => {
        switch (status) {
            case 0: return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            case 1: return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case 2: return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case 3: return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    // Filter states
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | number>("all");
    const [filterMonth, setFilterMonth] = useState<string>("all");
    const [filterYear, setFilterYear] = useState<string>("all");

    // Filtered orders
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchSearch =
                order.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
                order.id.toString().includes(search) ||
                order.phone.includes(search);

            const matchStatus = filterStatus === "all" ? true : order.status === filterStatus;

            const orderDate = new Date(order.booking_date);
            const matchMonth = filterMonth === "all" ? true : (orderDate.getMonth() + 1).toString() === filterMonth;
            const matchYear = filterYear === "all" ? true : orderDate.getFullYear().toString() === filterYear;

            return matchSearch && matchStatus && matchMonth && matchYear;
        });
    }, [orders, search, filterStatus, filterMonth, filterYear]);

    // Get unique years from orders
    const availableYears = useMemo(() => {
        const years = orders.map(o => new Date(o.booking_date).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, [orders]);

    return (
        <main className="min-h-screen bg-[#fdfdfc] text-[#1a1a1a] dark:bg-[#121212] dark:text-[#e5e5e5] transition-colors">
            {/* 🖼️ Banner đầu trang */}
            <section className="relative h-[600px] w-full overflow-hidden">
                <Image
                    src="/image/banner3.png"
                    alt="Restaurant banner"
                    fill
                    className="object-cover brightness-[0.55]"
                    priority
                />
            </section>

            {/* 📖 Nội dung chính */}
            <section className="container mx-auto px-6 lg:px-10 py-16">
                {/* Loading state */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b97a57] mx-auto mb-4"></div>
                        <p className="text-gray-500">Đang tải lịch sử đặt hàng...</p>
                    </div>
                ) : (
                    <>
                        {/* Bộ lọc */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="relative flex-1 w-full sm:max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm theo tên, mã đơn, số điện thoại..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#b97a57]/20 focus:border-[#b97a57] transition-all"
                                />
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                {/* Filter Trạng thái */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1.5 h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                            <Filter className="w-3.5 h-3.5" />
                                            <span className="text-xs">Trạng thái</span>
                                            {filterStatus !== 'all' && (
                                                <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-[#b97a57]" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup value={filterStatus.toString()} onValueChange={(v) => setFilterStatus(v === "all" ? "all" : parseInt(v))}>
                                            <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="0">Chờ xác nhận</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="1">Đã xác nhận</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="2">Hoàn thành</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="3">Đã hủy</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Filter Tháng */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1.5 h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-xs">Tháng</span>
                                            {filterMonth !== 'all' && (
                                                <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-[#b97a57]" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                        <DropdownMenuLabel>Lọc theo tháng</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup value={filterMonth} onValueChange={setFilterMonth}>
                                            <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <DropdownMenuRadioItem key={i + 1} value={(i + 1).toString()}>
                                                    Tháng {i + 1}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Filter Năm */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm" className="gap-1.5 h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-xs">Năm</span>
                                            {filterYear !== 'all' && (
                                                <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-[#b97a57]" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-32">
                                        <DropdownMenuLabel>Lọc theo năm</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup value={filterYear} onValueChange={setFilterYear}>
                                            <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                            {availableYears.map(year => (
                                                <DropdownMenuRadioItem key={year} value={year.toString()}>
                                                    {year}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Kết quả lọc */}
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-20 bg-white/60 dark:bg-[#1e1e1e]/80 text-muted-foreground rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                                <p className="opacity-80 mb-6 text-lg">
                                    {search || filterStatus !== 'all' || filterMonth !== 'all' || filterYear !== 'all'
                                        ? "Không tìm thấy lịch sử đặt bàn phù hợp."
                                        : "Bạn chưa có lịch sử đặt bàn nào."}
                                </p>
                                <Button
                                    className="bg-[#b97a57] hover:bg-[#a56a49] text-white px-6 py-2 rounded-md text-sm font-medium tracking-wide"
                                    onClick={() => router.push("/booking")}
                                >
                                    Đặt bàn ngay
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-md backdrop-blur-sm">
                                <table className="w-full text-sm text-left align-middle border-collapse">
                                    <thead className="bg-[#faf9f6] dark:bg-[#181818] uppercase text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-300">
                                        <tr>
                                            <th className="px-6 py-4 text-center">Mã đơn</th>
                                            <th className="px-6 py-4 text-center">Tên khách hàng</th>
                                            <th className="px-6 py-4 text-center">Số điện thoại</th>
                                            <th className="px-6 py-4 text-center">Ngày đặt</th>
                                            <th className="px-6 py-4 text-center">Giờ</th>
                                            <th className="px-6 py-4 text-center">Số người</th>
                                            <th className="px-6 py-4 text-center">Tổng tiền</th>
                                            <th className="px-6 py-4 text-center">Trạng thái</th>
                                            <th className="px-6 py-4 text-center">Chi tiết</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredOrders.map((order, index) => (
                                            <tr
                                                key={order.id}
                                                className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0
                                                    ? "bg-white/70 dark:bg-[#161616]"
                                                    : "bg-[#f9f9f9] dark:bg-[#181818]"
                                                    } group hover:shadow-[0_4px_16px_rgba(185,122,87,0.15)] hover:bg-gradient-to-r hover:from-[#fff9f3] hover:to-[#fff5ed] dark:hover:from-[#1a1a1a] dark:hover:to-[#222] transition-all duration-500`}
                                            >
                                                <td className="px-6 py-4 text-center font-mono text-gray-500 dark:text-gray-400">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 text-center font-medium whitespace-nowrap transition-all group-hover:text-[#b97a57]">
                                                    {order.ho_ten}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    {order.phone}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    {formatDate(order.booking_date)}
                                                </td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">{formatTime(order.booking_time)}</td>
                                                <td className="px-6 py-4 text-center whitespace-nowrap">{order.quantity}</td>
                                                <td className="px-6 py-4 text-center font-semibold text-[#b97a57]">{formatCurrency(order.total_price)}</td>

                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(order.status)}`}>
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 text-center whitespace-nowrap">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-[#d3b49f] text-[#b97a57] bg-white hover:bg-gradient-to-r hover:from-[#f5eee8] hover:to-[#e9ded5] dark:hover:from-[#2a2a2a] dark:hover:to-[#333] transition-all duration-300"
                                                            >
                                                                <Utensils className="w-4 h-4 mr-1" />
                                                                Xem
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-lg bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-lg font-semibold text-[#b97a57]">
                                                                    Chi tiết đặt bàn #{order.id}
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-3 text-sm mt-2">
                                                                <p><strong>Tên khách hàng:</strong> {order.ho_ten}</p>
                                                                <p><strong>Số điện thoại:</strong> {order.phone}</p>
                                                                <p><strong>Ngày đặt:</strong> {formatDate(order.booking_date)}</p>
                                                                <p><strong>Giờ:</strong> {formatTime(order.booking_time)}</p>
                                                                <p><strong>Số người:</strong> {order.quantity}</p>
                                                                {order.note && <p><strong>Ghi chú:</strong> {order.note}</p>}
                                                                {order.table && <p><strong>Bàn:</strong> {order.table.name}</p>}
                                                                <hr className="my-3 border-gray-200 dark:border-gray-700" />

                                                                <p className="font-semibold">Món đã chọn:</p>
                                                                {order.details && order.details.length > 0 ? (
                                                                    <ul className="list-disc list-inside space-y-1">
                                                                        {order.details.map((detail) => (
                                                                            <li key={detail.id} className="flex justify-between">
                                                                                <span>{detail.dish?.name || `Món #${detail.dish_id}`} x{detail.quantity}</span>
                                                                                <span className="text-[#b97a57] font-medium">
                                                                                    {formatCurrency(detail.price * detail.quantity)}
                                                                                </span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                ) : (
                                                                    <p className="text-gray-500 italic">Chưa có món ăn</p>
                                                                )}
                                                                <hr className="my-3 border-gray-200 dark:border-gray-700" />
                                                                <p className="text-right font-semibold text-[#b97a57] text-base">
                                                                    Tổng cộng: {formatCurrency(order.total_price)}
                                                                </p>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* 🍷 Phần quảng bá */}
            <AppPromoSection />
        </main>
    );
}
