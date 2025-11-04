"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Search,
  History, // Icon cho Lịch sử
  Package, // Icon cho Quản lý món ăn
  BookMarked, // Icon cho Đặt bàn (trong Lịch sử)
  Move, // Icon cho Đổi bàn (trong Lịch sử)
  Users, // Icon cho Thay đổi số lượng (trong Lịch sử)
  XCircle, // Icon cho Hủy/Xóa (trong Lịch sử)
  BarChart, // Icon Báo cáo
} from "lucide-react";
import Link from "next/link";
// Import các component biểu đồ
// (Hãy chắc chắn bạn đã chạy: npm install recharts)
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart, // Đổi tên để tránh trùng lặp với icon BarChart
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { Pagination } from "../components/Pagination";
import { PreviewModal } from "../components/PreviewModal";
import { NotificationToast } from "../components/NotificationToast";
import { ConfirmModal } from "../components/ConfirmModal";
import { InputModal } from "../components/InputModal";

// --- DỮ LIỆU MẪU & INTERFACES ---

// Dữ liệu Món ăn & Danh mục
const initialCategories = [
  { id: 1, name: "Khai vị" },
  { id: 2, name: "Món chính" },
  { id: 3, name: "Tráng miệng" },
  { id: 4, name: "Đồ uống" },
];
const initialDishes = [
  {
    id: 101,
    categoryId: 1,
    name: "Gỏi cuốn tôm thịt",
    price: 60000,
    imageUrl: "https://via.placeholder.com/150",
    description: "Gỏi cuốn tươi ngon với tôm, thịt, bún và rau sống.",
    status: "in_stock",
    quantity: 20,
  },
  {
    id: 201,
    categoryId: 2,
    name: "Phở bò tái",
    price: 50000,
    imageUrl: "https://via.placeholder.com/150",
    description: "Phở bò truyền thống với thịt bò tái mềm.",
    status: "in_stock",
    quantity: 50,
  },
  {
    id: 202,
    categoryId: 2,
    name: "Bún chả Hà Nội",
    price: 55000,
    imageUrl: "https://via.placeholder.com/150",
    description: "Bún chả với thịt nướng thơm lừng.",
    status: "out_of_stock",
    quantity: 0,
  },
  {
    id: 203,
    categoryId: 2,
    name: "Cơm tấm sườn bì chả",
    price: 65000,
    imageUrl: "https://via.placeholder.com/150",
    description: "Cơm tấm đặc trưng miền Nam.",
    status: "in_stock",
    quantity: 35,
  },
  {
    id: 204,
    categoryId: 2,
    name: "Bò lúc lắc",
    price: 120000,
    imageUrl: "https://via.placeholder.com/150",
    description: "Thịt bò mềm xào với ớt chuông.",
    status: "in_stock",
    quantity: 15,
  },
  {
    id: 205,
    categoryId: 2,
    name: "Cá kho tộ",
    price: 95000,
    imageUrl: "https://via.placeholder.com/150",
    description: "Cá kho trong tộ đất đậm đà.",
    status: "out_of_stock",
    quantity: 0,
  },
  {
    id: 301,
    categoryId: 3,
    name: "Chè khúc bạch",
    price: 35000,
    imageUrl: "https://via.placeholder.com/150",
    description: "Chè mát lạnh với thạch hạnh nhân.",
    status: "in_stock",
    quantity: 40,
  },
];
interface Dish {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  status: "in_stock" | "out_of_stock";
  quantity: number;
}
interface Category {
  id: number;
  name: string;
}

// Dữ liệu Lịch sử
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
const initialHistoryLogs: HistoryLog[] = [
  {
    id: "h1",
    type: "booking",
    title: "Đặt bàn mới (Bàn 5)",
    details: "Khách hàng: Anh Tuấn, 4 khách, 19:00",
    user: "Admin",
    timestamp: "3 phút trước",
    bookingId: "B1001",
  },
  {
    id: "h2",
    type: "table_change",
    title: "Đổi bàn (B1001)",
    details: "Đổi từ Bàn 5 -> Bàn 7 (Yêu cầu gần cửa sổ)",
    user: "Lễ tân",
    timestamp: "15 phút trước",
    bookingId: "B1001",
  },
  {
    id: "h3",
    type: "quantity_update",
    title: "Cập nhật số lượng (B1001)",
    details: "Thay đổi từ 4 khách -> 6 khách",
    user: "Admin",
    timestamp: "1 giờ trước",
    bookingId: "B1001",
  },
  {
    id: "h4",
    type: "status_change",
    title: "Hủy đặt bàn (B0982)",
    details: "Khách hàng: Chị Lan, 2 khách, 20:00 (Lý do: bận đột xuất)",
    user: "Khách hàng",
    timestamp: "3 giờ trước",
    bookingId: "B0982",
  },
  {
    id: "h5",
    type: "booking",
    title: "Đặt bàn mới (Bàn 2)",
    details: "Khách hàng: Chị Mai, 2 khách, 18:30",
    user: "Lễ tân",
    timestamp: "Hôm qua, 17:30",
    bookingId: "B1000",
  },
  {
    id: "h6",
    type: "quantity_update",
    title: "Cập nhật số lượng (B1000)",
    details: "Thay đổi từ 2 khách -> 3 khách",
    user: "Lễ tân",
    timestamp: "Hôm qua, 18:00",
    bookingId: "B1000",
  },
];

// Dữ liệu Báo cáo
const monthlyData = [
  { name: "Thg 1", doanhthu: 4000000 },
  { name: "Thg 2", doanhthu: 3000000 },
  { name: "Thg 3", doanhthu: 5000000 },
  { name: "Thg 4", doanhthu: 4500000 },
  { name: "Thg 5", doanhthu: 6000000 },
  { name: "Thg 6", doanhthu: 5500000 },
  { name: "Thg 7", doanhthu: 7000000 },
  { name: "Thg 8", doanhthu: 6500000 },
  { name: "Thg 9", doanhthu: 7500000 },
  { name: "Thg 10", doanhthu: 8000000 },
  { name: "Thg 11", doanhthu: 9000000 },
  { name: "Thg 12", doanhthu: 8500000 },
];
const quarterlyData = [
  { name: "Quý 1", doanhthu: 12000000 },
  { name: "Quý 2", doanhthu: 16000000 },
  { name: "Quý 3", doanhthu: 21000000 },
  { name: "Quý 4", doanhthu: 25500000 },
];
const yearlyData = [
  { name: "2022", doanhthu: 50000000 },
  { name: "2023", doanhthu: 74500000 },
  { name: "2024", doanhthu: 90000000 },
];

// --- COMPONENT CON HIỂN THỊ LỊCH SỬ ---
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

// --- COMPONENT TRANG CHÍNH (BẢNG ĐIỀU KHIỂN) ---
export default function AdminDashboardPage() {
  // State chọn giao diện chính
  const [activeView, setActiveView] = useState<
    "dishes" | "history" | "reports"
  >("dishes");

  // State cho quản lý món ăn
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true);
  const [dishSearchQuery, setDishSearchQuery] = useState("");

  // State cho lịch sử hoạt động
  const [logs, setLogs] = useState(initialHistoryLogs);
  const [historyFilterType, setHistoryFilterType] = useState("all");
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const [historyCurrentPage, setHistoryCurrentPage] = useState(1);

  // State cho báo cáo
  const [reportPeriod, setReportPeriod] = useState<
    "month" | "quarter" | "year"
  >("month");

  // State cho các Modal & Toast
  const [selectedDishForPreview, setSelectedDishForPreview] =
    useState<Dish | null>(null);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });
  const [inputModal, setInputModal] = useState<{
    show: boolean;
    title: string;
    initialValue?: string;
    onSubmit: (value: string) => void;
  }>({ show: false, title: "", onSubmit: () => {} });
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ show: false, title: "", message: "", onConfirm: () => {} });

  const ITEMS_PER_PAGE = 4; // 4 món ăn mối trang (quản lý món ăn theo danh mục)
  const HISTORY_ITEMS_PER_PAGE = 3; // 3 hoạt động mỗi trang

  // Tải dữ liệu món ăn từ localStorage
  useEffect(() => {
    const savedDishesJSON = localStorage.getItem("dishes");
    const dishesToLoad = savedDishesJSON
      ? JSON.parse(savedDishesJSON)
      : initialDishes;
    setDishes(dishesToLoad);

    if (!selectedCategoryId && categories.length > 0) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  // --- LOGIC CHO QUẢN LÝ MÓN ĂN ---
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const filteredDishes = dishes
    .filter((d) => d.categoryId === selectedCategoryId)
    .filter((dish) => {
      const searchTerm = dishSearchQuery.toLowerCase().trim();
      if (!searchTerm) return true;
      return (
        dish.name.toLowerCase().includes(searchTerm) ||
        String(dish.price).includes(searchTerm)
      );
    });
  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const truncateDescription = (text: string | undefined, maxLength: number) => {
    if (!text) return "Chưa có mô tả.";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // --- LOGIC CHO LỊCH SỬ HOẠT ĐỘNG ---
  const filteredLogs = logs
    .filter((log) =>
      historyFilterType === "all" ? true : log.type === historyFilterType
    )
    .filter((log) => {
      const searchTerm = historySearchQuery.toLowerCase().trim();
      if (!searchTerm) return true;
      return (
        log.title.toLowerCase().includes(searchTerm) ||
        log.details.toLowerCase().includes(searchTerm) ||
        log.bookingId.toLowerCase().includes(searchTerm)
      );
    });
  // Logic phân trang cho Lịch sử
  const historyTotalPages = Math.ceil(
    filteredLogs.length / HISTORY_ITEMS_PER_PAGE
  );
  const historyStartIndex = (historyCurrentPage - 1) * HISTORY_ITEMS_PER_PAGE;
  const historyEndIndex = historyStartIndex + HISTORY_ITEMS_PER_PAGE;
  const paginatedLogs = filteredLogs.slice(historyStartIndex, historyEndIndex);

  // --- LOGIC CHO BÁO CÁO DOANH THU ---
  let currentReportData = monthlyData;
  let totalRevenue = 0;
  let periodName = "Theo Tháng";
  switch (reportPeriod) {
    case "month":
      currentReportData = monthlyData;
      totalRevenue = monthlyData.reduce((acc, item) => acc + item.doanhthu, 0);
      periodName = "Trong 12 Tháng";
      break;
    case "quarter":
      currentReportData = quarterlyData;
      totalRevenue = quarterlyData.reduce(
        (acc, item) => acc + item.doanhthu,
        0
      );
      periodName = "Trong 4 Quý";
      break;
    case "year":
      currentReportData = yearlyData;
      totalRevenue = yearlyData.reduce((acc, item) => acc + item.doanhthu, 0);
      periodName = "Trong 3 Năm";
      break;
  }

  // --- HÀM XỬ LÝ CHUNG & CRUD ---
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });
  };
  const handleOpenPreview = (dish: Dish) => setSelectedDishForPreview(dish);
  const handleClosePreview = () => setSelectedDishForPreview(null);
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    setDishSearchQuery("");
  };

  const handleAddCategory = () => {
    setInputModal({
      show: true,
      title: "Tạo danh mục mới",
      initialValue: "",
      onSubmit: (name) => {
        const newCategoryId = Math.max(...categories.map((c) => c.id)) + 1;
        const newCategory = { id: newCategoryId, name: name };
        setCategories([...categories, newCategory]);
        setInputModal({ ...inputModal, show: false });
        showToast("Đã thêm danh mục thành công!");
      },
    });
  };

  const handleEditCategory = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    setInputModal({
      show: true,
      title: "Sửa tên danh mục",
      initialValue: category.name,
      onSubmit: (name) => {
        setCategories(
          categories.map((c) => (c.id === id ? { ...c, name: name } : c))
        );
        setInputModal({ ...inputModal, show: false });
        showToast("Đã cập nhật danh mục!");
      },
    });
  };

  const handleDeleteCategory = (id: number) => {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    setConfirmModal({
      show: true,
      title: `Xóa danh mục "${category.name}"`,
      message: "Việc này sẽ xóa tất cả món ăn bên trong. Bạn có chắc không?",
      onConfirm: () => {
        const updatedDishes = dishes.filter((dish) => dish.categoryId !== id);
        setDishes(updatedDishes);
        localStorage.setItem("dishes", JSON.stringify(updatedDishes));
        const updatedCategories = categories.filter((c) => c.id !== id);
        setCategories(updatedCategories);
        if (selectedCategoryId === id) {
          setSelectedCategoryId(updatedCategories[0]?.id || null);
        }
        setConfirmModal({ ...confirmModal, show: false });
        showToast("Đã xóa danh mục và các món ăn liên quan!", "error");
      },
    });
  };

  const handleDeleteDish = (id: number) => {
    const dish = dishes.find((d) => d.id === id);
    if (!dish) return;
    setConfirmModal({
      show: true,
      title: `Xóa món ăn "${dish.name}"`,
      message: "Bạn có chắc chắn muốn xóa món ăn này?",
      onConfirm: () => {
        const updatedDishes = dishes.filter((d) => d.id !== id);
        setDishes(updatedDishes);
        localStorage.setItem("dishes", JSON.stringify(updatedDishes));
        if (paginatedDishes.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
        setConfirmModal({ ...confirmModal, show: false });
        showToast("Đã xóa món ăn thành công!", "error");
      },
    });
  };

  // --- GIAO DIỆN JSX ---
  return (
    <div className="relative flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Điều Hướng Chính */}
      <aside className="w-1/4 bg-white dark:bg-gray-800 p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Quản lý
        </h2>

        <nav className="space-y-2">
          {/* Nút Quản lý Món ăn */}
          <button
            onClick={() => setActiveView("dishes")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeView === "dishes"
                ? "bg-amber-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <Package size={20} />
            <span className="font-semibold">Quản lý Món ăn</span>
          </button>

          {/* Nút Lịch sử Hoạt động */}
          <button
            onClick={() => setActiveView("history")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeView === "history"
                ? "bg-amber-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <History size={20} />
            <span className="font-semibold">Lịch sử Hoạt động</span>
          </button>

          {/* Nút Báo cáo Doanh thu */}
          <button
            onClick={() => setActiveView("reports")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeView === "reports"
                ? "bg-amber-500 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <BarChart size={20} />
            <span className="font-semibold">Báo cáo Doanh thu</span>
          </button>
        </nav>

        <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Sidebar Phụ: Danh mục Món ăn (Chỉ hiển thị khi activeView === 'dishes') */}
        {activeView === "dishes" && (
          <div className="flex flex-col flex-grow min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Danh mục
              </h3>
              <button
                onClick={() => setIsCategoryListVisible(!isCategoryListVisible)}
                className="p-2 text-gray-500 hover:text-amber-600 rounded-full"
                title={isCategoryListVisible ? "Ẩn" : "Hiện"}
              >
                <ChevronDown
                  size={24}
                  className={`transition-transform duration-300 ${
                    isCategoryListVisible ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <div
              className={`flex-grow overflow-y-auto transition-all duration-300 ${
                isCategoryListVisible
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id} className="group">
                    <div
                      onClick={() => handleCategorySelect(category.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleCategorySelect(category.id);
                      }}
                      className={`w-full cursor-pointer text-left p-3 rounded-lg flex justify-between items-center transition-colors ${
                        selectedCategoryId === category.id
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-gray-50 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <span className="font-semibold">{category.name}</span>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category.id);
                          }}
                          className={`p-1 ${
                            selectedCategoryId === category.id
                              ? "hover:bg-amber-600"
                              : "hover:bg-gray-300"
                          } rounded-full`}
                          title="Sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                          className={`p-1 ${
                            selectedCategoryId === category.id
                              ? "hover:bg-amber-600"
                              : "hover:bg-gray-300"
                          } rounded-full`}
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleAddCategory}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors"
              >
                <PlusCircle size={20} /> Tạo danh mục mới
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="w-3/4 p-8 overflow-y-auto">
        {/* --- Giao diện 1: Quản lý Món ăn --- */}
        {activeView === "dishes" && (
          <>
            {selectedCategory ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    <span className="text-amber-600">
                      {selectedCategory.name}
                    </span>
                  </h1>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tìm theo tên, giá..."
                        value={dishSearchQuery}
                        onChange={(e) => {
                          setDishSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <Link
                      href="/admin/foods/add"
                      className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700"
                    >
                      <PlusCircle size={20} /> Thêm món
                    </Link>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase">
                          Hình ảnh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase">
                          Tên món ăn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase max-w-[200px]">
                          Mô tả
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase">
                          Giá
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {paginatedDishes.map((dish) => (
                        <tr
                          key={dish.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="p-4">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                          </td>
                          <td className="p-4 font-medium text-gray-900 dark:text-gray-100">
                            {dish.name}
                          </td>
                          <td className="p-4 text-sm text-gray-600 dark:text-gray-300 max-w-[200px]">
                            {truncateDescription(dish.description, 50)}
                          </td>
                          <td className="p-4 text-gray-800 dark:text-gray-300">
                            {dish.price.toLocaleString("vi-VN")} VNĐ
                          </td>
                          <td className="p-4">
                            {dish.status === "in_stock" ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Còn hàng ({dish.quantity})
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                Hết hàng
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleOpenPreview(dish)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                title="Xem"
                              >
                                <Eye size={20} />
                              </button>
                              <Link
                                href={`/admin/foods/edit/${dish.id}`}
                                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400"
                                title="Sửa"
                              >
                                <Edit size={20} />
                              </Link>
                              <button
                                onClick={() => handleDeleteDish(dish.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400"
                                title="Xóa"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredDishes.length === 0 && (
                    <p className="text-center py-10 text-black dark:text-gray-400">
                      {dishSearchQuery
                        ? `Không tìm thấy món ăn nào với từ khóa "${dishSearchQuery}".`
                        : "Không có món ăn nào trong danh mục này."}
                    </p>
                  )}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  Vui lòng chọn hoặc tạo một danh mục.
                </p>
              </div>
            )}
          </>
        )}

        {/* --- Giao diện 2: Lịch sử Hoạt động --- */}
        {activeView === "history" && (
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
                    value={historySearchQuery}
                    onChange={(e) => {
                      setHistorySearchQuery(e.target.value);
                      setHistoryCurrentPage(1);
                    }}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={historyFilterType}
                    onChange={(e) => {
                      setHistoryFilterType(e.target.value);
                      setHistoryCurrentPage(1);
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
                paginatedLogs.map((log) => (
                  <HistoryItem key={log.id} log={log} />
                ))
              ) : (
                <div className="text-center py-10 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400">
                    {historySearchQuery || historyFilterType !== "all"
                      ? "Không tìm thấy hoạt động nào phù hợp."
                      : "Chưa có lịch sử hoạt động."}
                  </p>
                </div>
              )}
              {/* Phân trang cho Lịch sử */}
              {historyTotalPages > 1 && (
                <Pagination
                  totalPages={historyTotalPages}
                  currentPage={historyCurrentPage}
                  onPageChange={(page) => setHistoryCurrentPage(page)}
                />
              )}
            </div>
          </div>
        )}

        {/* --- Giao diện 3: Báo cáo Doanh thu --- */}
        {activeView === "reports" && (
          <div className="max-w-7xl mx-auto">
            {/* Header: Tiêu đề và Bộ lọc */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <BarChart className="w-8 h-8 text-amber-600" />
                Báo cáo Doanh thu
              </h1>
              <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <button
                  onClick={() => setReportPeriod("month")}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    reportPeriod === "month"
                      ? "bg-white dark:bg-gray-800 text-amber-600 shadow"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Theo Tháng
                </button>
                <button
                  onClick={() => setReportPeriod("quarter")}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    reportPeriod === "quarter"
                      ? "bg-white dark:bg-gray-800 text-amber-600 shadow"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Theo Quý
                </button>
                <button
                  onClick={() => setReportPeriod("year")}
                  className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                    reportPeriod === "year"
                      ? "bg-white dark:bg-gray-800 text-amber-600 shadow"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Theo Năm
                </button>
              </div>
            </div>

            {/* Thẻ Tóm tắt (Summary Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tổng Doanh Thu ({periodName})
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {totalRevenue.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tổng Đơn Hàng
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  1,204
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trung Bình/Đơn
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {(totalRevenue / 1204).toLocaleString("vi-VN", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  VNĐ
                </p>
              </div>
            </div>

            {/* Biểu đồ */}
            <div
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
              style={{ height: "450px" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Biểu đồ doanh thu{" "}
                {reportPeriod === "month"
                  ? "theo tháng"
                  : reportPeriod === "quarter"
                  ? "theo quý"
                  : "theo năm"}
              </h3>
              <ResponsiveContainer width="100%" height="90%">
                <RechartsBarChart
                  data={currentReportData}
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    strokeOpacity={0.2}
                    stroke="#888"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toLocaleString()} Tr`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#27272a",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    formatter={(value: number) =>
                      `${value.toLocaleString("vi-VN")} VNĐ`
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="doanhthu"
                    fill="#f59e0b"
                    name="Doanh thu"
                    radius={[4, 4, 0, 0]}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      {/* --- Khu vực render các Modal & Toast --- */}

      {toast.show && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      {inputModal.show && (
        <InputModal
          title={inputModal.title}
          initialValue={inputModal.initialValue}
          onSubmit={inputModal.onSubmit}
          onCancel={() => setInputModal({ ...inputModal, show: false })}
        />
      )}

      {confirmModal.show && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal({ ...confirmModal, show: false })}
        />
      )}

      <PreviewModal
        dish={selectedDishForPreview}
        onClose={handleClosePreview}
      />
    </div>
  );
}
