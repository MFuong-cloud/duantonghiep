"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams(); // Lấy id

  const [orders] = useState([
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
    <div className="p-6 bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/orders")}
            className="flex items-center gap-2 text-[#ff6600] hover:text-[#ff8533] transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách
          </button>
          <h2 className="text-2xl font-bold text-[#ff6600]">
            Chi tiết đơn hàng {id}
          </h2>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 mb-5">
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
            className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 pl-9 p-2 rounded-md focus:ring-2 focus:ring-[#ff6600] outline-none placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Lọc theo tháng */}
        <select
          value={month}
          onChange={(e) => {
            setMonth(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 p-2 rounded-md"
        >
          <option value="">Tất cả tháng</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        {/* Lọc theo năm */}
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 p-2 rounded-md"
        >
          <option value="">Tất cả năm</option>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>

        {/* Lọc theo trạng thái */}
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 p-2 rounded-md"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Hoàn thành">Hoàn thành</option>
          <option value="Chờ xử lý">Chờ xử lý</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      {/* Bảng hiển thị đơn */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-[1000px] w-full text-sm">
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
                  className="p-3 text-left text-[#ff6600] font-semibold border-b border-gray-200 dark:border-gray-700"
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
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.name}</td>
                  <td className="p-3">{order.phone}</td>
                  <td className="p-3">{order.people}</td>
                  <td className="p-3">{order.date}</td>
                  <td className="p-3">{order.time}</td>
                  <td className="p-3 font-medium">{order.total}</td>
                  <td className="p-3">
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
      <div className="flex justify-center mt-5 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md transition-transform active:scale-90 ${
              currentPage === i + 1
                ? "bg-[#ff6600] text-white"
                : "bg-gray-200 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#383838]"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
