"use client";

import { useState } from "react";
import Link from "next/link";
import {
  History,
  Search,
  BookMarked,
  Move,
  Users,
  XCircle,
} from "lucide-react";
import { Pagination } from "../components/Pagination";

// Định nghĩa kiểu dữ liệu
type LogType = "booking" | "table_change" | "quantity_update" | "status_change";
interface HistoryLog {
  id: string;
  type: LogType;
  title: string;
  details: string;
  user: string;
  timestamp: string;
  bookingId: string;
}

// Định nghĩa props
interface HistoryViewProps {
  logs: HistoryLog[];
}

// Component con
const HistoryItem = ({ log }: { log: HistoryLog }) => {
  const getLogIcon = (type: LogType) => {
    switch (type) {
      case "booking":
        return <BookMarked className="w-5 h-5 text-blue-500" />;
      case "table_change":
        return <Move className="w-5 h-5 text-yellow-500" />;
      case "quantity_update":
        return <Users className="w-5 h-5 text-green-500" />;
      case "status_change":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <History className="w-5 h-5 text-gray-500" />;
    }
  };
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full">
        {getLogIcon(log.type)}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {log.title}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {log.timestamp}
          </span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {log.details}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Thực hiện bởi: <span className="font-medium">{log.user}</span> | Mã
          đặt bàn:
          <Link
            href={`/admin/bookings/${log.bookingId}`}
            className="text-amber-600 hover:underline ml-1"
          >
            {log.bookingId}
          </Link>
        </p>
      </div>
    </div>
  );
};

// Component chính
export const HistoryView = ({ logs }: HistoryViewProps) => {
  // State nội bộ
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 2; // Phân trang cho Lịch sử

  // Logic lọc và phân trang
  const filteredLogs = logs
    .filter((log) => (filterType === "all" ? true : log.type === filterType))
    .filter((log) => {
      const searchTerm = searchQuery.toLowerCase().trim();
      if (!searchTerm) return true;
      return (
        log.title.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm) ||
        log.bookingId.toLowerCase().includes(searchTerm)
      );
    });
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <History className="w-8 h-8 text-amber-600" />
          Lịch sử hoạt động
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, mã..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="all">Tất cả loại</option>
              <option value="booking">Đặt bàn mới</option>
              <option value="table_change">Đổi bàn</option>
              <option value="quantity_update">Đổi số lượng</option>
              <option value="status_change">Thay đổi trạng thái</option>
            </select>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        {paginatedLogs.length > 0 ? (
          paginatedLogs.map((log) => <HistoryItem key={log.id} log={log} />)
        ) : (
          <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || filterType !== "all"
                ? "Không tìm thấy hoạt động nào phù hợp."
                : "Chưa có lịch sử hoạt động."}
            </p>
          </div>
        )}
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
};
