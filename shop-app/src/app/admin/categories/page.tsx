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
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart, // Đổi tên để tránh trùng lặp
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
import { AdminSidebar } from "../components/AdminSidebar";
import { DishesView } from "../views/DishesView";
import { HistoryView } from "../views/HistoryView";
import { ReportsView } from "../views/ReportsView";

// Import các kiểu dữ liệu (từ file types.ts bạn đã tạo)
import { Category, Dish, HistoryLog } from "../types";

// --- Dữ liệu fake (để test) ---

const initialCategories: Category[] = [
  { id: 1, name: "Khai vị" },
  { id: 2, name: "Món chính" },
  { id: 3, name: "Tráng miệng" },
  { id: 4, name: "Đồ uống" },
];
const initialDishes: Dish[] = [
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
    details: "Đổi từ Bàn 5 -> Bàn 7",
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
    details: "Khách hàng: Chị Lan, 2 khách, 20:00",
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

// --- COMPONENT TRANG CHÍNH (CONTROLLER) ---
export default function AdminDashboardPage() {
  // State quản lý giao diện
  const [activeView, setActiveView] = useState<
    "dishes" | "history" | "reports"
  >("dishes");

  // State "Toàn cục" cho dữ liệu
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [logs, setLogs] = useState(initialHistoryLogs);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  // State "Toàn cục" cho Modals & Toasts
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

  // Tải dữ liệu từ localStorage
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

  // --- CÁC HÀM XỬ LÝ (TRUYỀN XUỐNG CÁC COMPONENT CON) ---

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
        setConfirmModal({ ...confirmModal, show: false });
        showToast("Đã xóa món ăn thành công!", "error");
      },
    });
  };

  // --- GIAO DIỆN JSX ---
  return (
    <div className="relative flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Component Sidebar Tái sử dụng */}
      <AdminSidebar
        activeView={activeView}
        onViewChange={setActiveView}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategorySelect={handleCategorySelect}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Main Content Area */}
      <main className="w-3/4 p-8 overflow-y-auto">
        {/* Render Giao diện 1: Quản lý Món ăn */}
        {activeView === "dishes" && (
          <DishesView
            categories={categories}
            dishes={dishes}
            selectedCategoryId={selectedCategoryId}
            onOpenPreview={handleOpenPreview}
            onDeleteDish={handleDeleteDish}
          />
        )}

        {/* Render Giao diện 2: Lịch sử Hoạt động */}
        {activeView === "history" && <HistoryView logs={logs} />}

        {/* Render Giao diện 3: Báo cáo Doanh thu */}
        {activeView === "reports" && <ReportsView />}
      </main>

      {/* --- Khu vực render các Modal & Toast (Toàn cục) --- */}

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
