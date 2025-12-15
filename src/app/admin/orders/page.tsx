"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ClipboardList, Filter, Eye, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import OrderFormDialog from "@/components/admin/forms/OrderFormDialog";
import OrderDetailDialog from "@/components/admin/dialogs/OrderDetailDialog";

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | number>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const itemsPerPage = 10;

  const fetchOrders = async () => {
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
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchSearch =
        order.ho_ten.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search) ||
        order.id.toString().includes(search) ||
        (order.table?.name && order.table.name.toLowerCase().includes(search.toLowerCase()));

      const orderDate = new Date(order.booking_date);
      const matchMonth = month ? orderDate.getMonth() + 1 === parseInt(month) : true;
      const matchYear = year ? orderDate.getFullYear() === parseInt(year) : true;
      const matchStatus = filterStatus === "all" ? true : order.status === filterStatus;
      const isActiveOrder = filterStatus === "all" ? (order.status !== 2 && order.status !== 3) : true;

      return matchSearch && matchMonth && matchYear && matchStatus && isActiveOrder;
    });
  }, [orders, search, month, year, filterStatus]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

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

      // Update local state
      setOrders(orders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      ));

      toast.success("Cập nhật trạng thái thành công");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Không thể cập nhật trạng thái");
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

            <select
              value={month}
              onChange={(e) => { setMonth(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Tất cả tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Tất cả năm</option>
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>Năm {y}</option>
              ))}
            </select>

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
                        <td className="px-6 py-4 font-mono text-gray-500">#{order.id}</td>
                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{order.ho_ten}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.phone}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatDate(order.booking_date)}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{formatTime(order.booking_time)}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.quantity}</td>
                        <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{formatCurrency(order.total_price)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.table
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
                            disabled={updatingOrderId === order.id}
                          />
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setOpenViewDialogId(order.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleEditClick(order)}
                              className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                              title="Chỉnh sửa"
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
    </AdminPageLayout>
  );
}
