"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Clock,
  Users,
  DollarSign,
  MapPin,
  RefreshCcw,
} from "lucide-react";
import {
  AdminCard,
  AdminPageHeader,
  adminInputClass,
} from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();

  const [orders] = useState<any[]>([
    {
      id: "DH001",
      table: "Bàn 1",
      name: "Nguyễn Văn A",
      phone: "0987654321",
      total: "1.200.000đ",
      status: "Chờ xử lý",
      date: "2025-11-04",
      time: "19:30",
      people: 4,
      note: "Dị ứng tôm",
    },
    {
      id: "DH002",
      table: "Bàn 3",
      name: "Trần Thị B",
      phone: "0912345678",
      total: "3.200.000đ",
      status: "Hoàn thành",
      date: "2025-10-03",
      time: "18:15",
      people: 2,
      note: "",
    },
    {
      id: "DH003",
      table: "Bàn 6",
      name: "Phạm Văn C",
      phone: "0909123456",
      total: "2.500.000đ",
      status: "Chờ xử lý",
      date: "2025-09-02",
      time: "17:45",
      people: 3,
      note: "Dị ứng hải sản",
    },
    {
      id: "DH004",
      table: "VIP 1",
      name: "Lê Thị D",
      phone: "0988333444",
      total: "1.000.000đ",
      status: "Đã hủy",
      date: "2025-11-01",
      time: "20:00",
      people: 5,
      note: "",
    },
    {
      id: "DH005",
      table: "Bàn 2",
      name: "Đặng Văn Z",
      phone: "0977888999",
      total: "2.000.000đ",
      status: "Hoàn thành",
      date: "2024-11-15",
      time: "19:15",
      people: 2,
      note: "",
    },
    {
      id: "DH006",
      table: "Bàn 4",
      name: "Nguyễn Thị H",
      phone: "0933555777",
      total: "1.500.000đ",
      status: "Chờ xử lý",
      date: "2025-08-10",
      time: "18:45",
      people: 3,
      note: "",
    },
  ]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === id),
    [orders, id]
  );

  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const isFiltering = search || month || year || status || selectedTable;

  useEffect(() => {
    if (id) {
      const index = orders.findIndex((o) => o.id === id);
      if (index !== -1) {
        const targetPage = Math.ceil((index + 1) / itemsPerPage);
        setCurrentPage(targetPage);
      }
    }
  }, [id, orders]);

  const uniqueTables = useMemo(() => {
    const tables = orders.map((o) => o.table);
    return Array.from(new Set(tables)).sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchName = order.name.toLowerCase().includes(search.toLowerCase());
      const orderDate = new Date(order.date);
      const matchMonth = month
        ? orderDate.getMonth() + 1 === parseInt(month)
        : true;
      const matchYear = year
        ? orderDate.getFullYear() === parseInt(year)
        : true;
      const matchStatus = status ? order.status === status : true;
      const matchTable = selectedTable ? order.table === selectedTable : true;
      return matchName && matchMonth && matchYear && matchStatus && matchTable;
    });
  }, [orders, search, month, year, status, selectedTable]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setCurrentPage(val);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setMonth("");
    setYear("");
    setStatus("");
    setSelectedTable("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* --- bảng chi tiết --- */}
      {selectedOrder && (
        <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-lg border-l-4 border-blue-600 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-wrap justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700 bg-blue-50/30 dark:bg-blue-900/10">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  Đơn hàng #{selectedOrder.id}
                </h2>
                <span
                  className={cn(
                    "px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wide text-white",
                    selectedOrder.status === "Hoàn thành"
                      ? "bg-green-600"
                      : selectedOrder.status === "Đã hủy"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  )}
                >
                  {selectedOrder.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Đã tạo vào lúc {selectedOrder.time} - {selectedOrder.date}
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Thông tin khách hàng
              </h3>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-lg">
                    {selectedOrder.name}
                  </p>
                  <p className="text-gray-500">{selectedOrder.phone}</p>
                </div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg text-sm text-gray-600 dark:text-gray-300 italic">
                {/* khi không có ghi chú */}"
                {selectedOrder.note || "Không có ghi chú thêm"}"
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Chi tiết đặt bàn
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{selectedOrder.table}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span>{selectedOrder.people} người</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span>{selectedOrder.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>{selectedOrder.time}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Thanh toán
              </h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-gray-500 mb-1">Tổng thành tiền</p>
                <div className="flex items-center gap-2 text-3xl font-bold text-blue-700 dark:text-blue-400">
                  <DollarSign className="w-6 h-6" />
                  {selectedOrder.total}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- D sách bảng --- */}
      <AdminCard className="mt-6">
        <AdminPageHeader
          title="Danh sách chi tiết đơn hàng khác"
          description="Tra cứu nhanh các đơn hàng trong hệ thống."
          icon={<Search className="w-5 h-5 text-blue-600" />}
          actions={
            <button
              onClick={() => router.push("/admin/orders")}
              className="flex items-center gap-2 rounded-lg border border-blue-600 text-blue-600 px-4 py-2 hover:bg-blue-50 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang quản lý
            </button>
          }
        />

        {/* Bộ lọc */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm khách hàng..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className={cn(
                adminInputClass,
                "pl-9 py-2 h-10 bg-gray-50 focus:ring-blue-600"
              )}
            />
          </div>

          <select
            value={selectedTable}
            onChange={(e) => {
              setSelectedTable(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(adminInputClass, "h-10 w-32 focus:ring-blue-600")}
          >
            <option value="">Bàn</option>
            {uniqueTables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(adminInputClass, "h-10 w-32 focus:ring-blue-600")}
          >
            <option value="">Tháng</option>
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
            className={cn(adminInputClass, "h-10 w-32 focus:ring-blue-600")}
          >
            <option value="">Năm</option>
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
            className={cn(adminInputClass, "h-10 w-40 focus:ring-blue-600")}
          >
            <option value="">Trạng thái</option>
            <option value="Hoàn thành">Hoàn thành</option>
            <option value="Chờ xử lý">Chờ xử lý</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>

          {isFiltering && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              title="Xóa bộ lọc"
            >
              <RefreshCcw className="w-4 h-4 mr-2" /> Xóa lọc
            </Button>
          )}
        </div>

        {/* Bảng hiển thị */}
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
          <table className="min-w-[900px] w-full text-sm table-auto">
            <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
              <tr>
                {[
                  "Mã",
                  "Bàn",
                  "Khách hàng",
                  "SĐT",
                  "Ngày",
                  "Giờ",
                  "Tổng tiền",
                  "Trạng thái",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="p-3 text-left text-blue-600 font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentOrders.map((order) => {
                const isActive = order.id === id;
                return (
                  <tr
                    key={order.id}
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className={cn(
                      "border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200",
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 shadow-inner"
                        : "hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                    )}
                  >
                    <td
                      className={cn(
                        "p-3 font-medium",
                        isActive ? "text-blue-600" : ""
                      )}
                    >
                      {order.id}
                    </td>
                    <td className="p-3">{order.table}</td>
                    <td className="p-3 font-medium">{order.name}</td>
                    <td className="p-3 text-gray-500">{order.phone}</td>
                    <td className="p-3 text-gray-500">{order.date}</td>
                    <td className="p-3 text-gray-500">{order.time}</td>
                    <td className="p-3 font-medium">{order.total}</td>
                    <td className="p-3 font-bold">
                      <span
                        className={cn(
                          order.status === "Hoàn thành"
                            ? "text-green-500"
                            : order.status === "Đã hủy"
                            ? "text-red-500"
                            : "text-yellow-500"
                        )}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      {isActive && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Đang xem
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* phân trang */}
        <div className="flex justify-center items-center gap-4 mt-6">
          {/* lùi */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          {/* giữa */}
          <div className="flex items-center gap-2 px-6 py-2 bg-gray-100 dark:bg-[#252538] rounded-full text-sm text-gray-600 dark:text-gray-300 shadow-inner">
            <span>Trang</span>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={handlePageInput}
              className="w-8 text-center bg-transparent outline-none font-bold text-gray-800 dark:text-white appearance-none m-0"
            />
            <span className="text-gray-400">/ {totalPages}</span>
          </div>

          {/* tiến */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </AdminCard>
    </div>
  );
}
