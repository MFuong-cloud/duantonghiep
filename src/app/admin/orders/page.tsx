"use client";

import { useState, useMemo } from "react";
import { Search, ClipboardList, Filter, Eye, Pencil } from "lucide-react";
import AddOrderDialog, { type AdminOrderPayload } from "@/components/admin/forms/AddOrderDialog";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { Pagination } from "@/components/admin/pagination/Pagination";

export default function OrderManagement() {
  const [orders, setOrders] = useState<AdminOrderPayload[]>([
    { id: "DH001", name: "Nguyễn Văn A", phone: "0987654321", total: "1.200.000đ", status: "Chờ xử lý", date: "2025-11-04", time: "19:30", people: 4 },
    { id: "DH002", name: "Trần Thị B", phone: "0912345678", total: "3.200.000đ", status: "Hoàn thành", date: "2025-10-03", time: "18:15", people: 2 },
    { id: "DH003", name: "Phạm Văn C", phone: "0909123456", total: "2.500.000đ", status: "Chờ xử lý", date: "2025-09-02", time: "17:45", people: 3 },
    { id: "DH004", name: "Lê Thị D", phone: "0988333444", total: "1.000.000đ", status: "Đã hủy", date: "2025-11-01", time: "20:00", people: 5 },
    { id: "DH005", name: "Đặng Văn Z", phone: "0977888999", total: "2.000.000đ", status: "Hoàn thành", date: "2024-11-15", time: "19:15", people: 2 },
    { id: "DH006", name: "Nguyễn Thị H", phone: "0933555777", total: "1.500.000đ", status: "Chờ xử lý", date: "2025-08-10", time: "18:45", people: 3 },
  ]);

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "Chờ xử lý" | "Hoàn thành" | "Đã hủy">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openViewDialogId, setOpenViewDialogId] = useState<string | null>(null);
  const [openEditDialogId, setOpenEditDialogId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<AdminOrderPayload | null>(null);

  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchName = order.name.toLowerCase().includes(search.toLowerCase()) ||
        order.phone.includes(search) ||
        order.id.toLowerCase().includes(search.toLowerCase());
      const orderDate = new Date(order.date);
      const matchMonth = month ? orderDate.getMonth() + 1 === parseInt(month) : true;
      const matchYear = year ? orderDate.getFullYear() === parseInt(year) : true;
      const matchStatus = filterStatus === "all" ? true : order.status === filterStatus;
      return matchName && matchMonth && matchYear && matchStatus;
    });
  }, [orders, search, month, year, filterStatus]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleAdd = (newOrder: AdminOrderPayload) => {
    setOrders([newOrder, ...orders]); // Thêm vào đầu để hiển thị mới nhất trước
  };

  const handleEditClick = (order: AdminOrderPayload) => {
    setEditFormData(order);
    setOpenEditDialogId(order.id);
  };

  const handleSaveEdit = () => {
    if (!editFormData) return;

    setOrders(orders.map(o => o.id === editFormData.id ? editFormData : o));
    setOpenEditDialogId(null);
    setEditFormData(null);
  };

  return (
    <AdminPageLayout
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-500" />
            Quản lý đơn đặt hàng
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
                <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => { setFilterStatus(v as any); setCurrentPage(1); }}>
                  <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Chờ xử lý">Chờ xử lý</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Hoàn thành">Hoàn thành</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Đã hủy">Đã hủy</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <AddOrderDialog onAdd={handleAdd} />
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
        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full text-sm text-center">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#252525] border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Họ và tên</th>
                <th className="px-6 py-4">SĐT</th>
                <th className="px-6 py-4">Số người</th>
                <th className="px-6 py-4">Giờ đặt</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
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
                    <td className="px-6 py-4 font-mono text-gray-500">{order.id}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{order.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.phone}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.people}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{order.time}</td>
                    <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : order.status === "Đã hủy"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}>
                        {order.status}
                      </span>
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
      </AdminCard>

      {/* Dialog Xem Chi Tiết */}
      <Dialog open={!!openViewDialogId} onOpenChange={(o) => !o && setOpenViewDialogId(null)}>
        <DialogContent className="w-full max-w-2xl bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
          {(() => {
            const activeOrder = orders.find(o => o.id === openViewDialogId);
            if (!activeOrder) return null;
            return (
              <>
                <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <ClipboardList className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết đơn hàng</DialogTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mã đơn: <span className="font-mono">{activeOrder.id}</span></p>
                    </div>
                  </div>
                </DialogHeader>

                <div className="py-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Họ và tên</label>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{activeOrder.name}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số điện thoại</label>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{activeOrder.phone}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Số người</label>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{activeOrder.people} người</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ngày đặt</label>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{activeOrder.date}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Giờ đặt</label>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{activeOrder.time}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tổng tiền</label>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{activeOrder.total}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">Trạng thái</label>
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${activeOrder.status === "Hoàn thành"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : activeOrder.status === "Đã hủy"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                      {activeOrder.status}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <Button variant="outline" onClick={() => setOpenViewDialogId(null)}>Đóng</Button>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* Dialog Chỉnh Sửa */}
      <Dialog open={!!openEditDialogId} onOpenChange={(o) => !o && setOpenEditDialogId(null)}>
        <DialogContent className="w-full max-w-2xl bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
          {editFormData && (
            <>
              <DialogHeader className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Pencil className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chỉnh sửa đơn hàng</DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mã đơn: <span className="font-mono">{editFormData.id}</span></p>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Họ và tên <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Nhập họ tên..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Số điện thoại <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Nhập số điện thoại..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Số người <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min="1"
                      value={editFormData.people}
                      onChange={(e) => setEditFormData({ ...editFormData, people: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ngày đặt <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Giờ đặt <span className="text-red-500">*</span></label>
                    <input
                      type="time"
                      value={editFormData.time}
                      onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Tổng tiền <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={editFormData.total}
                      onChange={(e) => setEditFormData({ ...editFormData, total: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Ví dụ: 1.200.000đ"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Trạng thái <span className="text-red-500">*</span></label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  >
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Button variant="outline" onClick={() => setOpenEditDialogId(null)}>Hủy</Button>
                <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">Lưu thay đổi</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
}
