"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { NotificationToast } from "../../../components/NotificationToast";

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

export default function EditFoodPage() {
  const router = useRouter();
  const params = useParams();
  const dishIdParam = Array.isArray(params.id) ? params.id[0] : params.id;

  // State cho dữ liệu
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // State cho form
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState<number | string>("");
  const [status, setStatus] = useState<"in_stock" | "out_of_stock">("in_stock");
  const [quantity, setQuantity] = useState<number | string>(0);

  // State cho UI
  const [isLoading, setIsLoading] = useState(true);
  const [priceError, setPriceError] = useState("");

  // State để quản lý Toast
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({ show: false, message: "", type: "success" });

  const dishId = dishIdParam ? parseInt(dishIdParam, 10) : 0;

  // Hàm tiện ích để hiển thị Toast
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, message, type });
  };

  // Tải dữ liệu ban đầu (danh mục và món ăn)
  useEffect(() => {
    const savedDishesJSON = localStorage.getItem("dishes");
    const dishesToLoad = savedDishesJSON ? JSON.parse(savedDishesJSON) : [];
    setAllDishes(dishesToLoad);

    // Tải danh mục (mô phỏng)
    const initialCategories = [
      { id: 1, name: "Khai vị" },
      { id: 2, name: "Món chính" },
      { id: 3, name: "Tráng miệng" },
      { id: 4, name: "Đồ uống" },
    ];
    setCategories(initialCategories);
  }, []);

  // Điền dữ liệu vào form sau khi đã tải
  useEffect(() => {
    // Khởi tạo là mảng rỗng nếu không có gì, tránh lỗi nếu initialDishes không được định nghĩa
    if (allDishes.length === 0 || !dishId) return;
    const dishToEdit = allDishes.find((item) => item.id === dishId);

    if (dishToEdit) {
      setName(dishToEdit.name);
      setPrice(dishToEdit.price);
      setDescription(dishToEdit.description || "");
      setImageUrl(dishToEdit.imageUrl);
      setCategoryId(dishToEdit.categoryId);
      setStatus(dishToEdit.status);
      setQuantity(dishToEdit.quantity);
      setIsLoading(false);
    } else {
      // Thay thế alert() bằng showToast()
      showToast("Món ăn không tồn tại", "error");
      setTimeout(() => {
        router.push("/admin/categories");
      }, 1500);
    }
  }, [dishId, router, allDishes]);

  // Xử lý khi submit form
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const priceValue = Number(price);
    if (priceValue < 0) {
      setPriceError("Giá món ăn không được nhỏ hơn 0");
      showToast("Giá món ăn không được nhỏ hơn 0", "error"); // Thêm toast lỗi
      return;
    }
    setPriceError("");

    const updatedDishes = allDishes.map((dish) =>
      dish.id === dishId
        ? {
            ...dish,
            name,
            price: priceValue,
            description,
            imageUrl,
            categoryId: Number(categoryId),
            status: status,
            quantity: status === "in_stock" ? Number(quantity) : 0,
          }
        : dish
    );

    localStorage.setItem("dishes", JSON.stringify(updatedDishes));

    // Thay thế alert() bằng showToast() và thêm độ trễ
    showToast("Đã lưu thay đổi thành công!", "success");

    setTimeout(() => {
      router.push("/admin/categories");
    }, 1500); // Đợi 1.5 giây để người dùng đọc thông báo
  };

  // Xử lý khi thay đổi giá
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    if (Number(newPrice) >= 0) {
      setPriceError("");
    }
  };

  // Màn hình loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-800 dark:text-gray-200">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Chỉnh sửa món ăn
          </h1>
          <Link
            href="/admin/categories"
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            &larr; Quay lại danh sách
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6"
        >
          {/* Select Danh mục */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Danh mục
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Input Tên món ăn */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Tên món ăn
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
          </div>

          {/* Trạng thái và Số lượng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Trạng thái
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="in_stock">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>

            {status === "in_stock" && (
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Số lượng
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Number(e.target.value) > 0 ? e.target.value : "0"
                    )
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  min="1"
                />
              </div>
            )}
          </div>

          {/* Input Giá */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Giá (VNĐ)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={handlePriceChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
            {priceError && (
              <p className="mt-1 text-sm text-red-500">{priceError}</p>
            )}
          </div>

          {/* Input Mô tả */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mô tả
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
          </div>

          {/* Input URL Hình ảnh */}
          <div>
            <label
              htmlFor="imageUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              URL Hình ảnh
            </label>
            <input
              type="text"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                className="mt-4 w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>

          {/* Nút Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>

      {/* Render component Toast (đặt ở cuối) */}
      {toast.show && (
        <NotificationToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
