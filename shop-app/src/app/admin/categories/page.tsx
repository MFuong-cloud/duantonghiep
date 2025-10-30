"use client";

import { useState, useEffect } from "react"; // <-- THÊM useEffect -->
import { PlusCircle, Edit, Trash2, Eye, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Pagination } from "../components/Pagination";
import { PreviewModal } from "../components/PreviewModal";

// --- Dữ liệu mẫu ban đầu ---
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
    description:
      "Gỏi cuốn tươi ngon với tôm, thịt, bún và rau sống, dùng kèm nước chấm đặc biệt.",
  },
  {
    id: 201,
    categoryId: 2,
    name: "Phở bò tái",
    price: 50000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Phở bò truyền thống với thịt bò tái mềm, bánh phở dai ngon và nước dùng đậm đà, thơm lừng mùi gia vị tự nhiên.",
  },
  {
    id: 202,
    categoryId: 2,
    name: "Bún chả Hà Nội",
    price: 55000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Bún chả với thịt nướng thơm lừng trên than hồng, bún tươi và nước mắm chua ngọt đặc trưng của Hà Nội.",
  },
  {
    id: 203,
    categoryId: 2,
    name: "Cơm tấm sườn bì chả",
    price: 65000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Cơm tấm đặc trưng miền Nam với sườn nướng vàng ruộm, bì dai giòn, chả trứng béo ngậy và chén nước mắm chua ngọt.",
  },
  {
    id: 204,
    categoryId: 2,
    name: "Bò lúc lắc",
    price: 120000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Thịt bò mềm xào nhanh tay với ớt chuông, hành tây, tỏi và sốt tiêu đen đậm đà, ăn kèm cơm nóng.",
  },
  {
    id: 205,
    categoryId: 2,
    name: "Cá kho tộ",
    price: 95000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Cá kho trong tộ đất với hương vị đậm đà của nước mắm, đường, tiêu và ớt, ăn kèm cơm trắng nóng hổi.",
  },
  {
    id: 206,
    categoryId: 2,
    name: "Canh chua cá lóc",
    price: 80000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Canh chua thanh mát với cá lóc tươi, dứa, cà chua, bạc hà, giá đỗ và rau thơm, mang hương vị đặc trưng miền Tây.",
  },
  {
    id: 207,
    categoryId: 2,
    name: "Gà nướng muối ớt",
    price: 150000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Gà nướng cay nồng, da giòn rụm tẩm ướp đậm đà với muối ớt, chanh và các loại gia vị khác, thích hợp cho bữa tiệc.",
  },
  {
    id: 301,
    categoryId: 3,
    name: "Chè khúc bạch",
    price: 35000,
    imageUrl: "https://via.placeholder.com/150",
    description:
      "Chè mát lạnh với thạch hạnh nhân, nhãn, vải, hạt chia và nước cốt dừa thanh ngọt, giải nhiệt ngày hè.",
  },
];

interface Dish {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [dishes, setDishes] = useState<Dish[]>([]); // ⭐️ KHỞI TẠO RỖNG, SẼ TẢI TỪ LOCALSTORAGE
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories[0]?.id || null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDishForPreview, setSelectedDishForPreview] =
    useState<Dish | null>(null);
  const [isCategoryListVisible, setIsCategoryListVisible] = useState(true);

  const ITEMS_PER_PAGE = 3;

  // ⭐️ THÊM useEffect ĐỂ TẢI MÓN ĂN TỪ LOCALSTORAGE
  useEffect(() => {
    const savedDishesJSON = localStorage.getItem("dishes");
    const dishesToLoad = savedDishesJSON
      ? JSON.parse(savedDishesJSON)
      : initialDishes;
    setDishes(dishesToLoad);
    // Đảm bảo selectedCategoryId được đặt sau khi dishes đã có dữ liệu
    if (
      dishesToLoad.length > 0 &&
      categories.length > 0 &&
      !selectedCategoryId
    ) {
      setSelectedCategoryId(categories[0]?.id);
    }
  }, [categories, selectedCategoryId]); // Phụ thuộc vào categories để đảm bảo nó đã load

  // Lọc món ăn dựa trên danh mục đã chọn và sắp xếp chúng
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const filteredDishes = dishes
    .filter((d) => d.categoryId === selectedCategoryId)
    .sort((a, b) => a.name.localeCompare(b.name)); // Sắp xếp theo tên

  const totalPages = Math.ceil(filteredDishes.length / ITEMS_PER_PAGE);
  const paginatedDishes = filteredDishes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ⭐️ HÀM HELPER ĐỂ CẮT CHUỖI MÔ TẢ
  const truncateDescription = (text: string | undefined, maxLength: number) => {
    if (!text) return "Chưa có mô tả.";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleOpenPreview = (dish: Dish) => setSelectedDishForPreview(dish);
  const handleClosePreview = () => setSelectedDishForPreview(null);

  // ⭐️ CẬP NHẬT HÀM XÓA MÓN ĂN ĐỂ LƯU VÀO LOCALSTORAGE
  const handleDeleteDish = (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      const updatedDishes = dishes.filter((dish) => dish.id !== id);
      setDishes(updatedDishes); // Cập nhật state
      localStorage.setItem("dishes", JSON.stringify(updatedDishes)); // Lưu vào localStorage
      alert("Đã xóa món ăn thành công!");
      // Nếu không còn món ăn nào trong trang hiện tại, quay về trang trước
      if (paginatedDishes.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // Reset về trang 1 khi đổi danh mục
  };

  const handleAddCategory = () => {
    const newCategoryName = prompt("Nhập tên danh mục mới:");
    if (newCategoryName && newCategoryName.trim() !== "") {
      const newCategoryId = Math.max(...categories.map((c) => c.id)) + 1; // ID duy nhất
      const newCategory = { id: newCategoryId, name: newCategoryName.trim() };
      setCategories([...categories, newCategory]);
      alert(`Đã thêm danh mục: ${newCategoryName}`);
    } else if (newCategoryName !== null) {
      // Nếu người dùng không nhập gì mà bấm OK
      alert("Tên danh mục không được để trống.");
    }
  };

  const handleEditCategory = (id: number) => {
    const categoryToEdit = categories.find((c) => c.id === id);
    if (categoryToEdit) {
      const updatedName = prompt("Sửa tên danh mục:", categoryToEdit.name);
      if (updatedName && updatedName.trim() !== "") {
        setCategories(
          categories.map((c) =>
            c.id === id ? { ...c, name: updatedName.trim() } : c
          )
        );
        alert(`Đã cập nhật danh mục: ${updatedName}`);
      } else if (updatedName !== null) {
        alert("Tên danh mục không được để trống.");
      }
    }
  };

  const handleDeleteCategory = (id: number) => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xóa danh mục này? Mọi món ăn trong danh mục này cũng sẽ bị xóa!"
      )
    ) {
      // Xóa các món ăn thuộc danh mục này
      const updatedDishes = dishes.filter((dish) => dish.categoryId !== id);
      setDishes(updatedDishes);
      localStorage.setItem("dishes", JSON.stringify(updatedDishes));

      // Xóa danh mục
      const updatedCategories = categories.filter((c) => c.id !== id);
      setCategories(updatedCategories);

      // Cập nhật selectedCategoryId nếu danh mục đang chọn bị xóa
      if (selectedCategoryId === id) {
        setSelectedCategoryId(updatedCategories[0]?.id || null);
      }
      alert("Đã xóa danh mục và các món ăn liên quan!");
    }
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
                      title="Sửa danh mục"
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
                      title="Xóa danh mục"
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
                <PlusCircle size={20} />
                Tạo danh mục mới
              </button>
            </div>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="w-3/4 p-8 overflow-y-auto">
        {selectedCategory ? (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Món ăn trong danh mục:{" "}
                <span className="text-amber-600">{selectedCategory.name}</span>
              </h1>
              <Link
                href="/admin/foods/add"
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700"
              >
                <PlusCircle size={20} /> Thêm món ăn
              </Link>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">
                      Hình ảnh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">
                      Tên món ăn
                    </th>
                    {/* ⭐️ CỘT MÔ TẢ ĐÃ CHỈNH SỬA */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider max-w-[200px]">
                      Mô tả
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black dark:text-gray-300 uppercase tracking-wider">
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
                      {/* ⭐️ ÁP DỤNG HÀM TRUNCATE Ở ĐÂY */}
                      <td className="p-4 font-medium text-gray-900 dark:text-gray-100 max-w-[200px] text-sm">
                        {truncateDescription(dish.description, 50)}{" "}
                        {/* Cắt chuỗi ở 50 ký tự */}
                      </td>
                      <td className="p-4 text-gray-800 dark:text-gray-300">
                        {dish.price.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleOpenPreview(dish)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                            title="Xem chi tiết"
                          >
                            <Eye size={20} />
                          </button>
                          <Link
                            href={`/admin/foods/edit/${dish.id}`}
                            className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300"
                            title="Sửa món ăn"
                          >
                            <Edit size={20} />
                          </Link>
                          <button
                            onClick={() => handleDeleteDish(dish.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Xóa món ăn"
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
                  Không có món ăn nào trong danh mục này.
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
            <p className="text-xl text-gray-500">Vui lòng chọn một danh mục.</p>
          </div>
        )}
      </main>
      <PreviewModal
        dish={selectedDishForPreview}
        onClose={handleClosePreview}
      />
    </div>
  );
}
