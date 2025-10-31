"use client";

import { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Search,
} from "lucide-react";
import Link from "next/link";
import { Pagination } from "../components/Pagination";
import { PreviewModal } from "../components/PreviewModal";
// Import các component modal mới
import { NotificationToast } from "../components/NotificationToast";
import { ConfirmModal } from "../components/ConfirmModal";
import { InputModal } from "../components/InputModal";

// --- Dữ liệu mẫu ban đầu ---
const initialCategories = [
  { id: 1, name: "Khai vị" },
  { id: 2, name: "Món chính" },
  { id: 3, name: "Tráng miệng" },
  { id: 4, name: "Đồ uống" },
];
// Dữ liệu mẫu đã cập nhật với `status` và `quantity`
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

// Interface (kiểu dữ liệu)
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

export default function CategoryManagementPage() {
  // State cho dữ liệu
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dishes, setDishes] = useState<Dish[]>([]);

  // State cho giao diện
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDishForPreview, setSelectedDishForPreview] =
    useState<Dish | null>(null);
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State cho các modal và thông báo
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

  const ITEMS_PER_PAGE = 3;

  // Tải dữ liệu từ localStorage khi component được mount
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

  // Logic lọc và phân trang
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const filteredDishes = dishes
    .filter((d) => d.categoryId === selectedCategoryId)
    .filter((dish) => {
      const searchTerm = searchQuery.toLowerCase().trim();
      if (!searchTerm) return true;
      const nameMatch = dish.name.toLowerCase().includes(searchTerm);
      const priceMatch = String(dish.price).includes(searchTerm);
      return nameMatch || priceMatch;
    });

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Hàm tiện ích: Cắt chuỗi
  const truncateDescription = (text: string | undefined, maxLength: number) => {
    if (!text) return "Chưa có mô tả.";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Hàm tiện ích: Hiển thị thông báo (toast)
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });
  };

  // Hàm xử lý cho Modal
  const handleOpenPreview = (dish: Dish) => setSelectedDishForPreview(dish);
  const handleClosePreview = () => setSelectedDishForPreview(null);
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
    setSearchQuery("");
  };

  // --- Các hàm xử lý CRUD (Đã cập nhật để dùng Modal) ---

  const handleAddCategory = () => {
    setInputModal({
      show: true,
      title: "Tạo danh mục mới",
      initialValue: "",
      onSubmit: (name) => {
        const newCategoryId = Math.max(...categories.map((c) => c.id)) + 1;
        const newCategory = { id: newCategoryId, name: name };
        setCategories([...categories, newCategory]);
        // (Lưu categories vào localStorage nếu cần)
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

  return (
    <div className="relative flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white dark:bg-gray-800 p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Danh mục
          </h2>
          <button
            onClick={() => setIsCategoryListVisible(!isCategoryListVisible)}
            className="p-2 text-gray-500 hover:text-amber-600 rounded-full"
            title={isCategoryListVisible ? "Ẩn danh sách" : "Hiện danh sách"}
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
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleAddCategory}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors"
              >
                <PlusCircle size={20} /> Tạo danh mục mới
              </button>
            </div>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-3/4 p-8 overflow-y-auto">
        {selectedCategory ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                <span className="text-amber-600">{selectedCategory.name}</span>
              </h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, giá..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
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
                  {searchQuery
                    ? `Không tìm thấy món ăn nào với từ khóa "${searchQuery}".`
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
      </main>

      {/* --- Khu vực render các Modal và Toast --- */}

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
