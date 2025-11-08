"use client";

import { useState } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  ChevronDown,
  History,
  Package,
  BarChart,
} from "lucide-react";

// Định nghĩa các kiểu dữ liệu (props) mà component này nhận vào
interface Category {
  id: number;
  name: string;
}

interface AdminSidebarProps {
  activeView: "dishes" | "history" | "reports";
  onViewChange: (view: "dishes" | "history" | "reports") => void;
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (id: number) => void;
  onAddCategory: () => void;
  onEditCategory: (id: number) => void;
  onDeleteCategory: (id: number) => void;
}

export const AdminSidebar = ({
  activeView,
  onViewChange,
  categories,
  selectedCategoryId,
  onCategorySelect,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: AdminSidebarProps) => {
  // State nội bộ của sidebar: ẩn/hiện danh sách
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true);

  return (
    <aside className="w-1/4 bg-white dark:bg-gray-800 p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Quản lý
      </h2>

      {/* --- Thanh điều hướng chính --- */}
      <nav className="space-y-2">
        <button
          onClick={() => onViewChange("dishes")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            activeView === "dishes"
              ? "bg-amber-500 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <Package size={20} />
          <span className="font-semibold">Quản lý Món ăn</span>
        </button>
        <button
          onClick={() => onViewChange("history")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            activeView === "history"
              ? "bg-amber-500 text-white shadow-md"
              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          <History size={20} />
          <span className="font-semibold">Lịch sử Hoạt động</span>
        </button>
        <button
          onClick={() => onViewChange("reports")}
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

      {/* --- Sidebar Phụ: Danh mục Món ăn (Chỉ hiển thị khi ở chế độ 'dishes') --- */}
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
                    onClick={() => onCategorySelect(category.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        onCategorySelect(category.id);
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
                          onEditCategory(category.id);
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
                          onDeleteCategory(category.id);
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
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onAddCategory}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors"
              >
                <PlusCircle size={20} /> Tạo danh mục mới
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
