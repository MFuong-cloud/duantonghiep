"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, ClipboardList, Filter, Eye, Pencil, Plus, CalendarIcon, X, CreditCard, Download, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { StatusSelect } from "@/components/admin/StatusSelect";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { Pagination } from "@/components/admin/pagination/Pagination";
import { OrderService } from "@/api/orders/order.service";
import { Order } from "@/model/Order";
import { toast } from "sonner";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";
const OrderFormDialog = dynamic(() => import("@/components/admin/forms/OrderFormDialog"), {
  loading: () => null,
  ssr: false
});
const OrderDetailDialog = dynamic(() => import("@/components/admin/dialogs/OrderDetailDialog"), {
  loading: () => null,
  ssr: false
});
const PaymentMethodDialog = dynamic(() => import("@/components/payment/PaymentMethodDialog"), {
  loading: () => null,
  ssr: false
});
import { useAdminBroadcast, useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { updateBooking, updateOrder } = useAdminBroadcast({
    serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    token: 'admin-token-placeholder',
    userId: 'admin-1',
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleDownloadInvoice = useCallback(async (orderId: number) => {
    try {
      let token = localStorage.getItem('authToken');
      // Fallback check if authToken is missing (rare case but possible if key mismatch)
      if (!token) token = localStorage.getItem('access_token');

      if (!token) {
        console.error('Invoice Download Error: No auth token found');
        toast.error('Lỗi xác thực: Vui lòng đăng nhập lại để tải hóa đơn');
        return;
      }

      // const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      // apiUrl is already defined above? No, it's defined inside try block previously.
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

      // toast.info(`Đang tải hóa đơn cho đơn hàng #${orderId}...`);

      const response = await fetch(`${apiUrl}/invoices/order/${orderId}?download=1`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || 'Lỗi tải hóa đơn');
        } catch {
          throw new Error('Lỗi tải hóa đơn (' + response.status + ')');
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoa-don-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Đã tải hóa đơn');
    } catch (error: any) {
      console.error('Invoice download error:', error);
      toast.error(error.message || 'Lỗi khi tải hóa đơn');
    }
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const orderIdParam = searchParams.get('order_id');

    if (paymentStatus === 'success' && orderIdParam) {
      router.replace('/admin/orders');
      toast.success('Thanh toán thành công! Đang tải hóa đơn...');
      handleDownloadInvoice(Number(orderIdParam));
    } else if (paymentStatus === 'failed') {
      router.replace('/admin/orders');
      toast.error('Thanh toán thất bại: ' + (searchParams.get('message') || 'Unknown error'));
    }
  }, [searchParams, router, handleDownloadInvoice]);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [dateInput, setDateInput] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | number>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentOrder, setSelectedPaymentOrder] = useState<Order | null>(null);

  const itemsPerPage = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await OrderService.getOrders();
      setOrders(data);
    } catch (error: unknown) {
      console.error("Error fetching orders:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { status?: number } };
        if (axiosError.response?.status === 401) {
          toast.error("Vui lòng đăng nhập để xem đơn hàng");
        } else {
          toast.error("Không thể tải danh sách đơn hàng");
        }
      } else {
        toast.error("Không thể tải danh sách đơn hàng");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRealtimeUpdate = useCallback(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Realtime Listener
  useRealtimeUpdates({
    serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    role: 'admin',
    onBookingUpdate: handleRealtimeUpdate,
    onOrderUpdate: handleRealtimeUpdate
  });

  useEffect(() => {
    // Xử lý callback từ MoMo
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');
    const orderId = params.get('order_id');
    const message = params.get('message');

    if (payment === 'success') {
      toast.success(message || 'Thanh toán thành công!');
      if (orderId) {
        toast.success(`Đơn hàng #${orderId} đã hoàn thành`);
      }
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    } else if (payment === 'failed') {
      toast.error(message || 'Thanh toán thất bại');
      window.history.replaceState({}, '', window.location.pathname);
    }

    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search) ||
        order.id.toString().includes(search) ||
        (order.table?.name && order.table.name.toLowerCase().includes(search.toLowerCase()));

      // Lọc theo ngày được chọn
      let matchDate = true;
      if (selectedDate) {
        const orderDate = new Date(order.booking_date);
        matchDate = orderDate.getDate() === selectedDate.getDate() &&
          orderDate.getMonth() === selectedDate.getMonth() &&
          orderDate.getFullYear() === selectedDate.getFullYear();
      }

      const matchStatus = filterStatus === "all" ? true : order.status === filterStatus;
      // Mặc định (All) hiển thị các đơn đang xử lý: 0 (Chờ), 1 (Đã xác nhận), 4 (Đã tiếp khách)
      // Ẩn đơn đã hoàn thành (2) và hủy (3) trừ khi filter cụ thể status đó
      const isActiveOrder = filterStatus === "all" ? (order.status !== 2 && order.status !== 3) : true;

      return matchSearch && matchDate && matchStatus && isActiveOrder;
    });
  }, [orders, search, selectedDate, filterStatus]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  const formatTime = (time: number | string) => {
    if (typeof time === 'string' && time.includes(':')) {
      const [h, m] = time.split(':').map(Number);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    const hours = typeof time === 'number' ? time : parseInt(time.toString());
    return `${hours.toString().padStart(2, '0')}:00`;
  };

  const handleStatusChange = async (orderId: number, newStatus: number) => {
    try {
      setUpdatingOrderId(orderId);
      await OrderService.updateOrder(orderId, { status: newStatus });

      // Broadcast changes
      const orderToUpdate = orders.find(o => o.id === orderId);
      const orderCode = orderToUpdate?.code;
      const orderUserId = orderToUpdate?.user_id;
      updateOrder(orderId, newStatus.toString(), undefined, { status: newStatus, code: orderCode, userId: orderUserId });
      updateBooking(orderId, newStatus.toString(), undefined, { status: newStatus, code: orderCode, userId: orderUserId });

      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ));

      toast.success("Cập nhật trạng thái thành công");
    } catch (error: unknown) {
      console.error("Error updating order:", error);

      let message = "Không thể cập nhật trạng thái";

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as {
          response: {
            data: {
              message: string;
              booking_date?: string;
              current_date?: string;
            }
          }
        };

        if (err.response?.data?.message) {
          message = err.response.data.message;

          if (err.response.data.booking_date && err.response.data.current_date) {
            message += `\n📅 Ngày đặt: ${err.response.data.booking_date}\n📆 Hôm nay: ${err.response.data.current_date}`;
          }
        }
      }

      toast.error(message, {
        duration: 5000,
        style: {
          whiteSpace: 'pre-line'
        }
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleEditClick = (order: Order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
  };

  return (
    <AdminPageLayout
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            Quản lý chỗ đặt
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm đơn hàng..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-48"
              />
            </div>

            <div className="flex items-center gap-1">
              <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="dd/MM/yyyy"
                      value={dateInput}
                      onChange={(e) => {
                        let value = e.target.value;

                        // Chỉ cho phép số và dấu /
                        value = value.replace(/[^\d/]/g, '');

                        // Giới hạn độ dài: dd/MM/yyyy = 10 ký tự
                        if (value.length > 10) {
                          return;
                        }

                        // Validate ngày và tháng real-time
                        const parts = value.split('/');

                        // Validate ngày (01-31)
                        if (parts[0]) {
                          const day = parseInt(parts[0]);
                          if (parts[0].length === 2 && (day < 1 || day > 31)) {
                            return; // Chặn ngày không hợp lệ
                          }
                          // Chặn số đầu tiên > 3 (vì ngày max là 31)
                          if (parts[0].length === 1 && parseInt(parts[0]) > 3) {
                            return;
                          }
                        }

                        // Validate tháng (01-12)
                        if (parts[1]) {
                          const month = parseInt(parts[1]);
                          if (parts[1].length === 2 && (month < 1 || month > 12)) {
                            return; // Chặn tháng không hợp lệ
                          }
                          // Chặn số đầu tiên > 1 (vì tháng max là 12)
                          if (parts[1].length === 1 && parseInt(parts[1]) > 1) {
                            return;
                          }
                        }

                        // Chỉ auto-format khi đang thêm ký tự (không phải xóa)
                        if (value.length > dateInput.length) {
                          // Nếu đang nhập ngày (2 ký tự) và chưa có /
                          if (parts.length === 1 && parts[0].length === 2) {
                            value = parts[0] + '/';
                          }
                          // Nếu đang nhập tháng (dd/MM đã có 2 ký tự tháng)
                          else if (parts.length === 2 && parts[1].length === 2) {
                            value = parts[0] + '/' + parts[1] + '/';
                          }
                        }

                        setDateInput(value);
                      }}
                      onBlur={() => {
                        // Parse input dd/MM/yyyy when blur
                        if (dateInput.trim() === "") {
                          setSelectedDate(undefined);
                          setCurrentPage(1);
                          return;
                        }

                        const parts = dateInput.split('/');
                        if (parts.length === 3) {
                          const day = parseInt(parts[0]);
                          const month = parseInt(parts[1]) - 1;
                          const year = parseInt(parts[2]);

                          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                            const newDate = new Date(year, month, day);
                            if (newDate.getDate() === day && newDate.getMonth() === month && newDate.getFullYear() === year) {
                              setSelectedDate(newDate);
                              setDateInput(format(newDate, "dd/MM/yyyy", { locale: vi }));
                              setCurrentPage(1);
                            } else {
                              // Invalid date, reset
                              setDateInput(selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "");
                            }
                          } else {
                            // Invalid format, reset
                            setDateInput(selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "");
                          }
                        } else {
                          // Invalid format, reset
                          setDateInput(selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur();
                        }
                      }}
                      className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-32"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 border-amber-100 w-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setDateInput(date ? format(date, "dd/MM/yyyy", { locale: vi }) : "");
                      setOpenDatePicker(false);
                      setCurrentPage(1);
                    }}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
              {selectedDate && (
                <button
                  onClick={() => {
                    setSelectedDate(undefined);
                    setDateInput("");
                    setCurrentPage(1);
                  }}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Xóa bộ lọc ngày"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-8 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                  <Filter className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs">Lọc</span>
                  {filterStatus !== 'all' && (
                    <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-blue-600" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterStatus.toString()} onValueChange={(v) => { setFilterStatus(v === "all" ? "all" : parseInt(v)); setCurrentPage(1); }}>
                  <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="0">Chờ xác nhận</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="1">Đã xác nhận</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="4">Đã tiếp khách</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="2">Hoàn thành</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="3">Đã hủy</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              onClick={() => {
                setSelectedOrder(null);
                setOpenOrderDialog(true);
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Thêm mới
            </Button>
          </div>
        </div>
      }
    >
      <div className="md:hidden relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm đơn hàng..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm text-sm"
        />
      </div>

      <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden">
        {loading ? (
          <AdminLoading message="Đang tải danh sách đơn hàng..." />
        ) : (
          <>
            <div className="flex-1 overflow-auto min-h-0">
              <table className="w-full text-sm text-center">
                <thead className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 text-xs uppercase text-gray-900 dark:text-white font-bold tracking-wider shadow-sm">
                  <tr>
                    <th className="px-6 py-4">Mã đơn</th>
                    <th className="px-6 py-4">Họ và tên</th>
                    <th className="px-6 py-4">SĐT</th>
                    <th className="px-6 py-4">Ngày đặt</th>
                    <th className="px-6 py-4">Giờ</th>
                    <th className="px-6 py-4">Số người</th>
                    <th className="px-6 py-4">Tổng tiền</th>
                    <th className="px-6 py-4">Bàn</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                            <ClipboardList className="w-8 h-8 opacity-50" />
                          </div>
                          <p>Không tìm thấy đơn hàng nào</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 font-mono text-gray-500">{order.code || order.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{order.ho_ten}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.phone}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDate(order.booking_date)}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatTime(order.booking_time)}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.quantity}</td>
                        <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">{formatCurrency(order.total_price)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order.table
                            ? (order.table.deleted_at
                              ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400')
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                            {order.table
                              ? `${order.table.name}${order.table.deleted_at ? ' (Đã xóa)' : ''}`
                              : 'Chưa chọn'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusSelect
                            value={order.status}
                            onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                            disabled={updatingOrderId === order.id || order.status === 2 || order.status === 3}
                            bookingDate={order.booking_date}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {order.status === 4 && (
                              <button
                                onClick={() => {
                                  setSelectedPaymentOrder(order);
                                  setShowPaymentDialog(true);
                                }}
                                className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                                title="Thanh toán"
                              >
                                <CreditCard className="w-4 h-4" />
                              </button>
                            )}
                            {order.status === 2 && (
                              <button
                                onClick={() => handleDownloadInvoice(order.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                                title="Tải hóa đơn"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              onClick={() => setOpenViewDialogId(order.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEditClick(order)}
                              disabled={order.status === 2 || order.status === 3}
                              className={`p-2 rounded-lg transition-all ${order.status === 2 || order.status === 3
                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                }`}
                              title={order.status === 2 || order.status === 3 ? 'Không thể chỉnh sửa đơn đã hoàn thành/hủy' : 'Chỉnh sửa'}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1f1f1f]">
              <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            </div>
          </>
        )}
      </AdminCard>

      <OrderDetailDialog
        open={!!openViewDialogId}
        onOpenChange={(open) => !open && setOpenViewDialogId(null)}
        order={orders.find(o => o.id === openViewDialogId) || null}
      />

      {/* Dialog Thêm mới / Chỉnh sửa */}
      <OrderFormDialog
        open={openOrderDialog}
        onOpenChange={setOpenOrderDialog}
        onSuccess={fetchOrders}
        order={selectedOrder}
      />

      {/* Dialog chọn phương thức thanh toán */}
      {showPaymentDialog && selectedPaymentOrder && (
        <PaymentMethodDialog
          orderId={selectedPaymentOrder.id}
          orderCode={selectedPaymentOrder.code}
          orderAmount={selectedPaymentOrder.total_price}
          onClose={() => {
            setShowPaymentDialog(false);
            setSelectedPaymentOrder(null);
          }}
          onSuccess={fetchOrders}
        />
      )}
    </AdminPageLayout>
  );
}
