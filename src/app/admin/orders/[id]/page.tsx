"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { AdminCard, AdminPageHeader, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/admin/pagination/Pagination";
import { type AdminOrderPayload } from "@/components/admin/forms/AddOrderDialog";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Lấy id

  const [orders] = useState<AdminOrderPayload[]>([
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
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchName = order.name.toLowerCase().includes(search.toLowerCase());
      const orderDate = new Date(order.date);
      const matchMonth = month ? orderDate.getMonth() + 1 === parseInt(month) : true;
      const matchYear = year ? orderDate.getFullYear() === parseInt(year) : true;
      const matchStatus = status ? order.status === status : true;
      return matchName && matchMonth && matchYear && matchStatus;
    });
  }, [orders, search, month, year, status]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminCard>
      <AdminPageHeader
        title={`Chi tiết đơn hàng ${id}`}
        description="Theo dõi lịch sử giao dịch, bộ lọc nâng cao giúp tìm đơn tương tự."
        icon={<ArrowLeft className="w-5 h-5 text-[#ff6600]" />}
        actions={
          <button
            onClick={() => router.push("/admin/orders")}
            className="flex items-center gap-2 rounded-lg border border-[#ff6600] text-[#ff6600] px-4 py-2 hover:bg-[#ff6600]/10 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        }
      />

      {/* Bộ lọc */}
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
          onChange={(e) => {
            setMonth(e.target.value);
            setCurrentPage(1);
          }}
          className={cn(adminInputClass, "appearance-none max-w-[150px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-[#ff6600]")}
        >
          <option value="">Tất cả tháng</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setCurrentPage(1);
          }}
          className={cn(adminInputClass, "appearance-none max-w-[150px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-[#ff6600]")}
        >
          <option value="">Tất cả năm</option>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className={cn(adminInputClass, "appearance-none max-w-[180px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-[#ff6600]")}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      {/* Bảng hiển thị đơn */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-[1100px] w-full text-sm table-auto">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a] sticky top-0 z-10">
            <tr>
              {[
                "Mã đơn",
                "Họ và tên",
                "Số điện thoại",
                "Số người",
                "Ngày đặt",
                "Giờ đặt",
                "Tổng tiền",
                "Trạng thái",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 text-center text-[#ff6600] font-semibold border-b border-gray-200 dark:border-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                >
                  <td className="p-3 text-center">{order.id}</td>
                  <td className="p-3 text-center">{order.name}</td>
                  <td className="p-3 text-center">{order.phone}</td>
                  <td className="p-3 text-center">{order.people}</td>
                  <td className="p-3 text-center">{order.date}</td>
                  <td className="p-3 text-center">{order.time}</td>
                  <td className="p-3 font-medium text-center">{order.total}</td>
                  <td className="p-3 text-center">
                    {order.status === "Hoàn thành" ? (
                      <span className="text-green-500 font-medium">
                        Hoàn thành
                      </span>
                    ) : order.status === "Đã hủy" ? (
                      <span className="text-red-500 font-medium">Đã hủy</span>
                    ) : (
                      <span className="text-yellow-500 font-medium">
                        Chờ xử lý
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} accent="orange" />
    </AdminCard>
  );
}
