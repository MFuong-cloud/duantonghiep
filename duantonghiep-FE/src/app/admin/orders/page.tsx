"use client";

import { useState, useMemo } from "react";
import {
  Eye,
  Search,
  ClipboardList,
  Pencil,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  FileX,
} from "lucide-react";
import AddOrderDialog, {
  type AdminOrderPayload,
} from "@/components/admin/forms/AddOrderDialog";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AdminCard,
  AdminPageHeader,
  adminInputClass,
} from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

interface OrderType {
  id: string;
  table: string;
  name: string;
  phone: string;
  total: string;
  status: string;
  date: string;
  time: string;
  people: number;
}

export default function OrderManagement() {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderType[]>([
 { id: "DH001", table: "Bàn 1", name: "Nguyễn Văn A", phone: "0987654321", total: "1.200.000đ", status: "Chờ xử lý", date: "2025-11-04", time: "19:30", people: 4,   },
    { id: "DH002", table: "Bàn 3", name: "Trần Thị B", phone: "0912345678", total: "3.200.000đ", status: "Hoàn thành", date: "2025-10-03", time: "18:15", people: 2,  },
    { id: "DH003", table: "Bàn 6", name: "Phạm Văn C", phone: "0909123456", total: "2.500.000đ", status: "Chờ xử lý", date: "2025-09-02", time: "17:45", people: 3,  },
    { id: "DH004", table: "VIP 1", name: "Lê Thị D", phone: "0988333444", total: "1.000.000đ", status: "Đã hủy", date: "2025-11-01", time: "20:00", people: 5,  },
    { id: "DH005", table: "Bàn 2", name: "Đặng Văn Z", phone: "0977888999", total: "2.000.000đ", status: "Hoàn thành", date: "2024-11-15", time: "19:15", people: 2,  },
    { id: "DH006", table: "Bàn 4", name: "Nguyễn Thị H", phone: "0933555777", total: "1.500.000đ", status: "Chờ xử lý", date: "2025-08-10", time: "18:45", people: 3, },
  ]);


  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [tempStatus, setTempStatus] = useState("");

  const itemsPerPage = 8;

  // Kiểm tra có đơn ko để hiện nút reset
  const isFiltering = search || month || year || selectedTable;

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
      const matchTable = selectedTable ? order.table === selectedTable : true;
      return matchName && matchMonth && matchYear && matchTable;
    });
  }, [orders, search, month, year, selectedTable]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAdd = (newOrder: AdminOrderPayload) => {
    const orderToAdd: OrderType = {
      ...newOrder,
      table: newOrder.table || "Bàn mới",
      people: newOrder.people || 1,
    };
    setOrders([...orders, orderToAdd]);
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updatedOrders = orders.map((order) =>
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
  };

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
    setSelectedTable("");
    setCurrentPage(1);
  };

  return (
    <AdminCard>
      <AdminPageHeader
        title="Quản lý đơn đặt hàng"
        description="Theo dõi lịch đặt, xác nhận bàn và xử lý nhanh các yêu cầu của khách."
        icon={<ClipboardList className="w-5 h-5 text-blue-600" />}
        actions={<AddOrderDialog onAdd={handleAdd} />}
      />

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm tên khách hàng..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className={cn(
              adminInputClass,
              "pl-9 bg-gray-50 dark:bg-[#2a2a2a] focus:ring-blue-600"
            )}
          />
        </div>

        <select
          value={selectedTable}
          onChange={(e) => {
            setSelectedTable(e.target.value);
            setCurrentPage(1);
          }}
          className={cn(
            adminInputClass,
            "appearance-none max-w-[150px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-blue-600"
          )}
        >
          <option value="">Tất cả bàn</option>
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
          className={cn(
            adminInputClass,
            "appearance-none max-w-[140px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-blue-600"
          )}
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
          className={cn(
            adminInputClass,
            "appearance-none max-w-[140px] bg-gray-50 dark:bg-[#2a2a2a] focus:ring-blue-600"
          )}
        >
          <option value="">Tất cả năm</option>
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>

        {/* Nút reset  */}
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
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg mt-4 max-h-[600px]">
        <table className="min-w-[1100px] w-full text-sm table-auto">
          <thead className="bg-gray-100 dark:bg-[#2a2a2a] sticky top-0 z-10 shadow-sm">
            <tr>
              {[
                "Mã đơn",
                "Tên bàn",
                "Họ và tên",
                "SĐT",
                "Số người",
                "Ngày đặt",
                "Giờ đặt",
                "Tổng tiền",
                "Trạng thái",
                "Hành động",
              ].map((h) => (
                <th
                  key={h}
                  className="p-3 text-center text-blue-600 font-semibold border-b border-gray-200 dark:border-gray-700"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentOrders.length === 0 ? (
              <tr>
                <td
                  colSpan={10}
                  className="p-12 text-center text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileX className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                    <p>Không tìm thấy đơn hàng nào phù hợp.</p>
                    {isFiltering && (
                      <button
                        onClick={resetFilters}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Thử xóa bộ lọc xem sao?
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              currentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition"
                >
                  <td className="p-3 text-center font-medium">{order.id}</td>
                  <td className="p-3 text-center">{order.table}</td>
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

                  <td className="p-3 flex justify-center gap-4">
                    <button
                      onClick={() => router.push(`/admin/orders/${order.id}`)}
                      className="p-1 hover:text-blue-600 transition"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5 text-[#3b82f6]" />
                    </button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setTempStatus(order.status)}
                          className="p-1 hover:text-emerald-600 transition"
                          title="Sửa trạng thái"
                        >
                          <Pencil className="w-5 h-5 text-[#10b981]" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg sm:max-w-[400px]">
                        <DialogHeader>
                          <DialogTitle className="text-blue-600 text-xl">
                            Cập nhật trạng thái {order.id}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <label className="text-sm font-medium mb-3 block">
                            Chọn trạng thái mới:
                          </label>
                          <select
                            value={tempStatus}
                            onChange={(e) => setTempStatus(e.target.value)}
                            className={cn(
                              adminInputClass,
                              "w-full bg-gray-50 dark:bg-[#2a2a2a] focus:ring-blue-600"
                            )}
                          >
                            <option value="Chờ xử lý">Chờ xử lý</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                            <option value="Đã hủy">Đã hủy</option>
                          </select>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              variant="outline"
                              className="mr-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#333]"
                            >
                              Hủy
                            </Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              onClick={() =>
                                handleUpdateStatus(order.id, tempStatus)
                              }
                              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            >
                              Lưu
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              ))
            )}
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
  );
}
