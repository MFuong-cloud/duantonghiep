"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { NotificationToast } from "../../components/NotificationToast";

// Define the Dish type to ensure consistency
interface Dish {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  status: 'in_stock' | 'out_of_stock';
  quantity: number;
}

// Define the Category type
interface Category {
  id: number;
  name: string;
}

export default function AddFoodPage() {
  const router = useRouter();
  
  // States for form inputs
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [status, setStatus] = useState<'in_stock' | 'out_of_stock'>('in_stock');
  const [quantity, setQuantity] = useState<number | string>(10);
  
  // State for error and categories list
  const [priceError, setPriceError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // ⭐️ 2. Thêm state để quản lý Toast
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>
    ({ show: false, message: "", type: "success" });

  // Load categories from localStorage when the component mounts
  useEffect(() => {
    // In a real app, you'd fetch this. Here we simulate it.
    const initialCategories = [
      { id: 1, name: "Khai vị" },
      { id: 2, name: "Món chính" },
      { id: 3, name: "Tráng miệng" },
      { id: 4, name: "Đồ uống" },
    ];
    setCategories(initialCategories);
    // Set default category selection
    if (initialCategories.length > 0) {
      setCategoryId(initialCategories[0].id.toString());
    }
  }, []);

  // ⭐️ 3. Hàm tiện ích để hiển thị Toast
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const priceValue = Number(price);
    if (priceValue < 0) {
      setPriceError("Giá món ăn không được nhỏ hơn 0");
      showToast("Giá món ăn không được nhỏ hơn 0", "error"); // Thay thế alert
      return;
    }
    if (!categoryId) {
        showToast("Vui lòng chọn một danh mục.", "error"); // Thay thế alert
        return;
    }
    setPriceError("");

    // Load existing dishes from localStorage
    const savedDishesJSON = localStorage.getItem("dishes");
    const allDishes: Dish[] = savedDishesJSON ? JSON.parse(savedDishesJSON) : [];

    const newDishId = allDishes.length > 0 ? Math.max(...allDishes.map(d => d.id)) + 1 : 101;

    const newDish: Dish = {
      id: newDishId,
      categoryId: Number(categoryId),
      name,
      price: priceValue,
      description,
      imageUrl,
      status: status, // Add the status
      quantity: status === 'in_stock' ? Number(quantity) : 0, // Add quantity
    };
    
    const updatedDishes = [...allDishes, newDish];
    localStorage.setItem("dishes", JSON.stringify(updatedDishes));

    // ⭐️ 4. Thay thế alert() bằng showToast() và thêm độ trễ trước khi chuyển trang
    showToast(`Đã thêm món ăn mới: ${name}`, "success");

    setTimeout(() => {
      router.push("/admin/categories");
    }, 1500); // Đợi 1.5 giây để người dùng đọc thông báo
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    if (Number(newPrice) >= 0) {
      setPriceError("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Thêm món ăn mới
          </h1>
          <Link href="/admin/categories" className="text-amber-600 dark:text-amber-400 hover:underline">
            &larr; Quay lại danh sách
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Danh mục</label>
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

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên món ăn</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Trạng thái</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'in_stock' | 'out_of_stock')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="in_stock">Còn hàng</option>
                <option value="out_of_stock">Hết hàng</option>
              </select>
            </div>
            
            {status === 'in_stock' && (
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Số lượng</label>
                <input 
                  type="number" 
                  id="quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value) >= 1 ? e.target.value : "1")} 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                  min="1"
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá (VNĐ)</label>
            <input type="number" id="price" value={price} onChange={handlePriceChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
            {priceError && (<p className="mt-1 text-sm text-red-500">{priceError}</p>)}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Hình ảnh</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
            {imageUrl && <img src={imageUrl} alt="Xem trước" className="mt-4 w-32 h-32 object-cover rounded-md" />}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors">
              Thêm món ăn
            </button>
          </div>
        </form>
      </div>

      {/* ⭐️ 5. Render component Toast (đặt ở cuối) */}
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

