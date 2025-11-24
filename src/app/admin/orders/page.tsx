"use client";

import { useState, useMemo } from "react";
import { Eye, Trash2, Search, MoreVertical, ClipboardList } from "lucide-react";
import AddOrderDialog, { type AdminOrderPayload } from "@/components/admin/forms/AddOrderDialog";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdminCard, AdminPageHeader, adminInputClass } from "@/components/admin/layout/AdminUI";
import { Pagination } from "@/components/admin/pagination/Pagination";
import { cn } from "@/lib/utils";

export default function OrderManagement() {
  const router = useRouter();
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
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchName = order.name.toLowerCase().includes(search.toLowerCase());
      const orderDate = new Date(order.date);
      const matchMonth = month ? orderDate.getMonth() + 1 === parseInt(month) : true;
      const matchYear = year ? orderDate.getFullYear() === parseInt(year) : true;
      return matchName && matchMonth && matchYear;
    });
  }, [orders, search, month, year]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa đơn hàng này không?")) {
      setOrders(orders.filter((order) => order.id !== id));
    }
  };

  const handleAdd = (newOrder: AdminOrderPayload) => {
    setOrders([...orders, newOrder]);
  };

  return (
    <AdminCard>
      <AdminPageHeader
        title="Quản lý đơn đặt hàng"
        description="Theo dõi lịch đặt, xác nhận bàn và xử lý nhanh các yêu cầu của khách."
        icon={<ClipboardList className="w-5 h-5 text-[#ff6600]" />}
        actions={<AddOrderDialog onAdd={handleAdd} />}
      />

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm theo tên khách hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(adminInputClass, "pl-9 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-[#ff6600]")}
          />
        </div>

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className={cn(adminInputClass, "appearance-none max-w-[160px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-[#ff6600]")}
        >
          <option value="">Tất cả tháng</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={cn(adminInputClass, "appearance-none max-w-[160px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-[#ff6600]")}
        >
          <option value="">Tất cả năm</option>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>Năm {y}</option>
          ))}
        </select>
      </div>

      {/* Bảng */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-[1100px] w-full text-sm table-auto">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
            <tr>
              {["Mã đơn", "Họ và tên", "SĐT", "Số người", "Ngày đặt", "Giờ đặt", "Tổng tiền", "Trạng thái", "Hành động"].map((h) => (
                <th key={h} className="p-3 text-center text-[#ff6600] font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  Không có đơn hàng nào
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition">
                  <td className="p-3 text-center">{order.id}</td>
                  <td className="p-3 text-center">{order.name}</td>
                  <td className="p-3 text-center">{order.phone}</td>
                  <td className="p-3 text-center">{order.people}</td>
                  <td className="p-3 text-center">{order.date}</td>
                  <td className="p-3 text-center">{order.time}</td>
                  <td className="p-3 font-medium text-center">{order.total}</td>
                  <td className="p-3 text-center">
                    {order.status === "Hoàn thành" ? (
                      <span className="text-green-500 font-medium">Hoàn thành</span>
                    ) : order.status === "Đã hủy" ? (
                      <span className="text-red-500 font-medium">Đã hủy</span>
                    ) : (
                      <span className="text-yellow-500 font-medium">Chờ xử lý</span>
                    )}
                  </td>

                  <td className="p-3 flex justify-center gap-3">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-[#333] rounded-md">
                          <MoreVertical className="w-5 h-5 text-[#ff6600]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-white dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 border dark:border-gray-700 rounded-md shadow-lg"
                      >
                        <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.id}`)}>
                          <Eye className="w-4 h-4 mr-2 text-[#ff6600]" /> Xem chi tiết
                        </DropdownMenuItem>

                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Eye className="w-4 h-4 mr-2 text-blue-500" /> Xem nhanh
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                            <DialogHeader>
                              <DialogTitle className="text-[#ff6600] text-xl">Chi tiết đơn hàng {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 space-y-2 text-sm">
                              <p><b>Họ tên:</b> {order.name}</p>
                              <p><b>SĐT:</b> {order.phone}</p>
                              <p><b>Số người:</b> {order.people}</p>
                              <p><b>Ngày đặt:</b> {order.date}</p>
                              <p><b>Giờ đặt:</b> {order.time}</p>
                              <p><b>Tổng tiền:</b> {order.total}</p>
                              <p><b>Trạng thái:</b> {order.status}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <button
                      onClick={() => handleDelete(order.id)}
                      className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a] transition"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} accent="orange" />
    </AdminCard>
  );
}
