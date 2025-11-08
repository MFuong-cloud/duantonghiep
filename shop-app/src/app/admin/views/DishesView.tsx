"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Eye, Search } from "lucide-react";
import { Pagination } from "../components/Pagination";

// Định nghĩa các kiểu dữ liệu
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

// Định nghĩa props
interface DishesViewProps {
  categories: Category[];
  dishes: Dish[];
  selectedCategoryId: number | null;
  onOpenPreview: (dish: Dish) => void;
  onDeleteDish: (id: number) => void;
}

export const DishesView = ({
  categories,
  dishes,
  selectedCategoryId,
  onOpenPreview,
  onDeleteDish,
}: DishesViewProps) => {
  // State nội bộ cho giao diện này
  const [currentPage, setCurrentPage] = useState(1);
  const [dishSearchQuery, setDishSearchQuery] = useState("");

  const ITEMS_PER_PAGE = 3;

  // Logic lọc và phân trang (chỉ cho món ăn)
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

  // Hàm tiện ích cắt chuỗi
  const truncateDescription = (text: string | undefined, maxLength: number) => {
    if (!text) return "Chưa có mô tả.";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
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
                          onClick={() => onOpenPreview(dish)}
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
                          onClick={() => onDeleteDish(dish.id)}
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
              onPageChange={setCurrentPage}
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
  );
};
