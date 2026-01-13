"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Utensils, Search, Filter, Calendar, XCircle, X, FileText } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
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
import { Pagination } from "@/components/admin/pagination/Pagination";
import AppPromoSection from "@/components/aboutSection/page";
import { OrderService } from "@/api/orders/order.service";
import { Order } from "@/model/Order";
import { toast } from "sonner";
import { useAuth } from "@/api/auth/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, parse, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "Asia/Ho_Chi_Minh",
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
    if (typeof time === 'number') {
        hours = time;
        minutes = 0;
    } else if (typeof time === 'string' && time.match(/^00:00:\d+$/)) {
        hours = parseInt(time.split(':')[2]);
        minutes = 0;
    } else if (typeof time === 'string' && time.includes(':')) {
        const parts = time.split(':');
        hours = parseInt(parts[0]);
        minutes = parseInt(parts[1]);
    } else {
        return time.toString();
    }
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const getStatusText = (status: number) => {
    switch (status) {
        case 0: return "Chờ xác nhận";
        case 1: return "Đã xác nhận";
        case 4: return "Đã tiếp khách";
        case 2: return "Hoàn thành";
        case 3: return "Đã hủy";
        default: return "Không xác định";
    }
};

const getStatusColor = (status: number) => {
    switch (status) {
        case 0: return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        case 1: return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        case 4: return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
        case 2: return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        case 3: return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
};

export default function BookingHistoryPage() {

    const router = useRouter();
    const { isLogin, isLoading: authLoading, userId } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelOrderId, setCancelOrderId] = useState<number | null>(null);



    // Fetch orders from API
    useEffect(() => {
        const fetchOrders = async () => {
            // Chỉ fetch nếu đã kiểm tra xong auth
            if (authLoading) return;

            // Nếu chưa đăng nhập, không fetch
            if (!isLogin) {
                setLoading(false);
                return;
            }

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
    }, [isLogin, authLoading]);

    // Helper functions (formatDate, formatCurrency, etc.) are defined outside the component 
    // to prevent recreation on each render.

    // Filter states
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | number>("all");
    const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined);
    const [dateInputValue, setDateInputValue] = useState("");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isInputEditable, setIsInputEditable] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Handlers for Date Filter
    const handleDateSelect = (range: DateRange | undefined) => {
        setDateFilter(range);
        if (range?.from) {
            if (range.to) {
                setDateInputValue(`${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`);
                // Close calendar only if both dates are selected
                // setIsCalendarOpen(false); 
            } else {
                setDateInputValue(format(range.from, "dd/MM/yyyy"));
            }
        } else {
            setDateInputValue("");
        }
        setCurrentPage(1);
    };

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDateInputValue(value);

        if (value.trim() === "") {
            setDateFilter(undefined);
            return;
        }

        // Try to parse range "dd/MM/yyyy - dd/MM/yyyy"
        if (value.includes(" - ")) {
            const parts = value.split(" - ");
            if (parts.length === 2) {
                const fromDate = parse(parts[0], "dd/MM/yyyy", new Date());
                const toDate = parse(parts[1], "dd/MM/yyyy", new Date());
                if (isValid(fromDate) && isValid(toDate)) {
                    setDateFilter({ from: fromDate, to: toDate });
                    setCurrentPage(1);
                    return;
                }
            }
        }

        // Try strict parse single date
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate) && value.length === 10) {
            setDateFilter({ from: parsedDate, to: undefined });
            setCurrentPage(1);
        } else {
            // Mismatch or invalid format
            if (dateFilter) setDateFilter(undefined);
        }
    };

    // Filtered orders
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            const matchSearch =
                order.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
                order.id.toString().includes(search) ||
                order.phone.includes(search);

            const matchStatus = filterStatus === "all" ? true : order.status === filterStatus;

            let matchDate = true;
            if (dateFilter?.from) {
                const orderDate = new Date(order.booking_date);
                // Reset time parts for accurate date comparison
                const checkDate = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()).getTime();

                const fromDate = new Date(dateFilter.from.getFullYear(), dateFilter.from.getMonth(), dateFilter.from.getDate()).getTime();

                if (dateFilter.to) {
                    const toDate = new Date(dateFilter.to.getFullYear(), dateFilter.to.getMonth(), dateFilter.to.getDate()).getTime();
                    matchDate = checkDate >= fromDate && checkDate <= toDate;
                } else {
                    // Single date match
                    matchDate = checkDate === fromDate;
                }
            }

            return matchSearch && matchStatus && matchDate;
        });
    }, [orders, search, filterStatus, dateFilter]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);



    // Update order status logic
    const handleConfirmCancel = async () => {
        if (!cancelOrderId) return;

        try {
            setLoading(true);
            // 3 = Status Hủy
            await OrderService.updateOrder(cancelOrderId, { status: 3 });

            // Update local state
            setOrders(prev => prev.map(o =>
                o.id === cancelOrderId ? { ...o, status: 3 } : o
            ));

            toast.success("Đã hủy đơn hàng thành công");
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error("Không thể hủy đơn hàng. Vui lòng liên hệ nhà hàng.");
        } finally {
            setLoading(false);
            setCancelOrderId(null);
        }
    };

    // Download invoice PDF
    const handleDownloadInvoice = (orderId: number) => {
        const token = localStorage.getItem('authToken');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const url = `${apiUrl}/invoices/order/${orderId}?download=1`;

        // Open in new tab with authorization
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        // Add authorization header via fetch and download
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
            .then(async response => {
                if (!response.ok) {
                    const errorText = await response.text();
                    try {
                        const errorJson = JSON.parse(errorText);
                        throw new Error(errorJson.message || 'Lỗi tải hóa đơn');
                    } catch {
                        throw new Error('Lỗi tải hóa đơn (' + response.status + ')');
                    }
                }
                return response.blob();
            })
            .then(blob => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = `hoa-don-${orderId}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(blobUrl);
                toast.success('Đã tải hóa đơn thành công');
            })
            .catch(error => {
                console.error('Download error:', error);
                toast.error('Không thể tải hóa đơn');
            });
    };

    const lastUpdateRef = useRef<{ id: number; time: number } | null>(null);

    // Keep track of current orders for realtime filtering without dependency loop
    const ordersRef = useRef<Order[]>([]);
    useEffect(() => {
        ordersRef.current = orders;
    }, [orders]);

    // Realtime Updates Handler (Memoized)
    const handleBookingUpdate = useCallback(async (data: any) => {
        // Backend sends 'id', but some legacy events might use 'bookingId' or 'orderId'
        const bookingId = data.bookingId ? Number(data.bookingId) : (data.id ? Number(data.id) : (data.orderId ? Number(data.orderId) : null));

        if (!bookingId) return;

        // Check if this order belongs to current user
        const isMyOrder = ordersRef.current.some(o => o.id === bookingId);
        if (!isMyOrder) return;

        // Debounce: Ignore duplicate updates within 500ms
        const now = Date.now();
        if (lastUpdateRef.current &&
            lastUpdateRef.current.id === bookingId &&
            (now - lastUpdateRef.current.time < 500)) {
            return;
        }
        lastUpdateRef.current = { id: bookingId, time: now };

        // 1. Update status updates immediately (Optimistic UI)
        if (data.status !== undefined) {
            const newStatus = Number(data.status);
            setOrders(prev => prev.map(o =>
                o.id === bookingId ? { ...o, status: newStatus } : o
            ));

            if (newStatus === 2) {
                console.log("Update status 2 -> Success Toast");
                toast.success(`Trạng thái đơn hàng ${data.code || bookingId} đã cập nhật: Đã hoàn thành`, {
                    className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800",
                    duration: 5000,
                    icon: "✅"
                });
            } else {
                toast.info(`Trạng thái đơn hàng ${data.code || bookingId} đã cập nhật: ${getStatusText(newStatus)}`);
            }
        }

        // 2. Refresh full order data if details changed or explicitly requested
        if (data.isDetailUpdate) {
            try {
                const updatedOrder = await OrderService.getOrder(bookingId);
                if (updatedOrder) {
                    setOrders(prev => prev.map(o => o.id === bookingId ? updatedOrder : o));
                    toast.success("Chi tiết đơn hàng đã được cập nhật.");
                }
            } catch (error) {
                console.error("Failed to refresh updated order:", error);
            }
        }
    }, []);

    useRealtimeUpdates({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        userId: userId || undefined,
        onBookingUpdate: handleBookingUpdate,
        onOrderUpdate: handleBookingUpdate // Add this to listen for order events
    });

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
                {loading || authLoading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b97a57] mx-auto mb-4"></div>
                        <p className="text-gray-500">Đang tải lịch sử đặt hàng...</p>
                    </div>
                ) : !isLogin ? (
                    // Chưa đăng nhập
                    <div className="text-center py-20 bg-white/60 dark:bg-[#1e1e1e]/80 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <div className="mb-6">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#b97a57]/10 flex items-center justify-center">
                                <Utensils className="w-10 h-10 text-[#b97a57]" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                Vui lòng đăng nhập
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                Bạn cần đăng nhập để xem lịch sử đặt bàn của mình.
                                Người dùng không có tài khoản sẽ không có lịch sử đơn hàng.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button
                                className="bg-[#b97a57] hover:bg-[#a56a49] text-white px-6 py-2 rounded-md text-sm font-medium tracking-wide"
                                onClick={() => router.push("/login")}
                            >
                                Đăng nhập
                            </Button>
                            <Button
                                variant="outline"
                                className="border-[#b97a57] text-[#b97a57] hover:bg-[#b97a57]/10 px-6 py-2 rounded-md text-sm font-medium tracking-wide"
                                onClick={() => router.push("/register")}
                            >
                                Đăng ký
                            </Button>
                        </div>
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
                                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
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
                                            <DropdownMenuRadioItem value="4">Đã tiếp khách</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="2">Hoàn thành</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="3">Đã hủy</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                                {/* Filter Ngày (Calendar + Input) */}
                                <div className="flex items-center gap-1">
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <div className="relative group">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                                <input
                                                    type="text"
                                                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                                                    className={`pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#b97a57]/20 focus:border-[#b97a57] hover:border-[#b97a57]/50 transition-all w-64 h-10 ${!isInputEditable ? 'cursor-pointer select-none' : ''}`}
                                                    value={dateInputValue}
                                                    onChange={handleDateInputChange}
                                                    readOnly={!isInputEditable}
                                                    onClick={(e) => {
                                                        if (!isInputEditable) {
                                                            e.stopPropagation();
                                                            setIsCalendarOpen(true);
                                                        }
                                                    }}
                                                    onDoubleClick={() => {
                                                        setIsInputEditable(true);
                                                    }}
                                                    onBlur={() => {
                                                        setIsInputEditable(false);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === 'Escape') {
                                                            setIsInputEditable(false);
                                                            e.currentTarget.blur();
                                                        }
                                                    }}
                                                />



                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="end">
                                            <CalendarComponent
                                                mode="range"
                                                selected={dateFilter}
                                                onSelect={handleDateSelect}
                                                initialFocus
                                                locale={vi}
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    {/* Clear Button - Outside */}
                                    {dateInputValue && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setDateFilter(undefined);
                                                setDateInputValue("");
                                                setCurrentPage(1);
                                            }}
                                            className="h-10 w-10 shrink-0 border-gray-200 dark:border-gray-700 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Kết quả lọc */}
                        {filteredOrders.length === 0 ? (
                            <div className="text-center py-20 bg-white/60 dark:bg-[#1e1e1e]/80 text-muted-foreground rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                                <p className="opacity-80 mb-6 text-lg">
                                    {search || filterStatus !== 'all' || dateFilter
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
                                        {currentOrders.map((order, index) => (
                                            <tr
                                                key={order.id}
                                                className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0
                                                    ? "bg-white/70 dark:bg-[#161616]"
                                                    : "bg-[#f9f9f9] dark:bg-[#181818]"
                                                    } group hover:shadow-[0_4px_16px_rgba(185,122,87,0.15)] hover:bg-gradient-to-r hover:from-[#fff9f3] hover:to-[#fff5ed] dark:hover:from-[#1a1a1a] dark:hover:to-[#222] transition-all duration-500`}
                                            >
                                                <td className="px-6 py-4 text-center font-mono text-gray-500 dark:text-gray-400">
                                                    {order.code || order.id}
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
                                                                    Chi tiết đặt bàn {order.code || order.id}
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
                                                                                <span>{detail.dish?.name || `Món ${detail.dish_id}`} x{detail.quantity}</span>
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

                                                    {/* Nút Xuất hóa đơn - Hiển thị khi đã hoàn thành (2) */}
                                                    {Number(order.status) === 2 && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDownloadInvoice(order.id)}
                                                            className="ml-2 border-green-200 text-green-600 bg-white hover:bg-green-50 hover:border-green-300 dark:bg-transparent dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-900/20 transition-all duration-300"
                                                        >
                                                            <FileText className="w-4 h-4 mr-1" />
                                                            Xuất hóa đơn
                                                        </Button>
                                                    )}

                                                    {/* Nút Hủy đơn - Chỉ hiển thị khi đang Chờ xác nhận (0) */}
                                                    {Number(order.status) === 0 && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setCancelOrderId(order.id)}
                                                            className="ml-2 border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 dark:bg-transparent dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20 transition-all duration-300"
                                                        >
                                                            <XCircle className="w-4 h-4 mr-1" />
                                                            Hủy
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination */}
                        {filteredOrders.length > 0 && (
                            <div className="mt-6 flex justify-center">
                                <Pagination
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* 🍷 Phần quảng bá */}
            <AppPromoSection />

            {/* Cancel Confirmation Dialog */}
            <Dialog open={!!cancelOrderId} onOpenChange={(open) => !open && setCancelOrderId(null)}>
                <DialogContent className="max-w-md bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                            <XCircle className="w-5 h-5" />
                            Xác nhận hủy đơn hàng
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 dark:text-gray-400 mt-2">
                            Bạn có chắc chắn muốn hủy đơn hàng <strong>#{cancelOrderId}</strong> này không?
                            <br />
                            Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCancelOrderId(null)}
                            className="border-gray-200 dark:border-gray-700"
                        >
                            Quay lại
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmCancel}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Xác nhận hủy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
