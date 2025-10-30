"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// Dữ liệu mẫu ban đầu, dùng làm dữ liệu dự phòng
const initialDishes = [
  { id: 101, categoryId: 1, name: "Gỏi cuốn tôm thịt", price: 60000, imageUrl: "https://via.placeholder.com/150", description: "Gỏi cuốn tươi ngon với tôm, thịt, bún và rau sống.", },
  { id: 201, categoryId: 2, name: "Phở bò tái", price: 50000, imageUrl: "https://via.placeholder.com/150", description: "Phở bò truyền thống với thịt bò tái mềm, nước dùng đậm đà.", },
  { id: 202, categoryId: 2, name: "Bún chả Hà Nội", price: 55000, imageUrl: "https://via.placeholder.com/150", description: "Bún chả với thịt nướng thơm lừng và nước mắm chua ngọt.", },
  { id: 203, categoryId: 2, name: "Cơm tấm sườn bì chả", price: 65000, imageUrl: "https://via.placeholder.com/150", description: "Cơm tấm đặc trưng miền Nam với sườn nướng, bì và chả trứng.", },
  { id: 204, categoryId: 2, name: "Bò lúc lắc", price: 120000, imageUrl: "https://via.placeholder.com/150", description: "Thịt bò mềm xào với ớt chuông, hành tây.", },
  { id: 205, categoryId: 2, name: "Cá kho tộ", price: 95000, imageUrl: "https://via.placeholder.com/150", description: "Cá kho trong tộ đất với hương vị đậm đà.", },
  { id: 206, categoryId: 2, name: "Canh chua cá lóc", price: 80000, imageUrl: "https://via.placeholder.com/150", description: "Canh chua thanh mát với cá lóc và các loại rau.", },
  { id: 207, categoryId: 2, name: "Gà nướng muối ớt", price: 150000, imageUrl: "https://via.placeholder.com/150", description: "Gà nướng cay nồng, da giòn.", },
  { id: 301, categoryId: 3, name: "Chè khúc bạch", price: 35000, imageUrl: "https://via.placeholder.com/150", description: "Chè mát lạnh với thạch hạnh nhân, nhãn và vải.", },
];

// Định nghĩa kiểu dữ liệu cho món ăn
interface Dish {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function EditFoodPage() {
  const router = useRouter();
  const params = useParams();
  const dishIdParam = Array.isArray(params.id) ? params.id[0] : params.id;

  // State để lưu trữ toàn bộ danh sách món ăn từ localStorage
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  
  // State cho các trường trong form
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Chuyển đổi ID một cách an toàn
  const dishId = dishIdParam ? parseInt(dishIdParam, 10) : 0;

  // useEffect đầu tiên: Chỉ chạy 1 lần ở client để tải dữ liệu an toàn từ localStorage
  useEffect(() => {
    const savedDishesJSON = localStorage.getItem("dishes");
    // Nếu có dữ liệu trong localStorage thì dùng, không thì dùng dữ liệu mẫu ban đầu
    const dishesToLoad = savedDishesJSON ? JSON.parse(savedDishesJSON) : initialDishes;
    setAllDishes(dishesToLoad);
  }, []); // Mảng dependency rỗng `[]` đảm bảo nó chỉ chạy một lần sau khi component được mount.

  // useEffect thứ hai: Chạy khi `allDishes` đã có dữ liệu để điền vào form
  useEffect(() => {
    // Chỉ thực hiện khi đã có danh sách món ăn và ID hợp lệ
    if (allDishes.length === 0 || !dishId) return;

    const dishToEdit = allDishes.find((item) => item.id === dishId);

    if (dishToEdit) {
      setName(dishToEdit.name);
      setPrice(dishToEdit.price);
      setDescription(dishToEdit.description || "");
      setImageUrl(dishToEdit.imageUrl);
      setIsLoading(false); // Dừng trạng thái loading
    } else {
      alert("Món ăn không tồn tại");
      router.push("/admin/categories");
    }
  }, [dishId, router, allDishes]); // Phụ thuộc vào `allDishes` để đảm bảo nó chạy sau khi dữ liệu được tải

  // Hàm lưu thay đổi vào localStorage
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const updatedDishes = allDishes.map((dish) =>
      dish.id === dishId
        ? { ...dish, name, price, description, imageUrl }
        : dish
    );

    // Lưu danh sách đã cập nhật vào localStorage
    localStorage.setItem("dishes", JSON.stringify(updatedDishes));

    alert("Đã lưu thay đổi!");
    router.push("/admin/categories");
  };

  if (!dishIdParam) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-600">Lỗi: ID món ăn không hợp lệ.</p>
      </div>
    );
  }

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
          <Link href="/admin/categories" className="text-amber-600 dark:text-amber-400 hover:underline">
            &larr; Quay lại danh sách
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên món ăn</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá (VNĐ)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
            <textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Hình ảnh</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700" />
            {imageUrl && (<img src={imageUrl} alt="preview" className="mt-4 w-32 h-32 object-cover rounded-md" />)}
          </div>

          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}