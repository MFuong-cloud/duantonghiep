"use client";

import Link from 'next/link';
import { X } from 'lucide-react';

// Interface (kiểu dữ liệu) cho món ăn
// Đảm bảo nó đồng bộ với interface ở trang categories/page.tsx
interface Dish {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  status: 'in_stock' | 'out_of_stock';
  quantity: number;
}

// Props mà component này nhận vào
interface PreviewModalProps {
  dish: Dish | null; // Món ăn để hiển thị (hoặc null để ẩn modal)
  onClose: () => void; // Hàm để đóng modal
}

export const PreviewModal = ({ dish, onClose }: PreviewModalProps) => {
  // Nếu không có món ăn nào được chọn (dish là null), không hiển thị gì cả
  if (!dish) {
    return null;
  }

  return (
    // Lớp phủ nền mờ (backdrop)
    <div 
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      onClick={onClose} // Cho phép đóng modal khi bấm ra ngoài
    >
      {/* Nội dung Modal (thêm e.stopPropagation để không bị đóng khi bấm vào) */}
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header: Tên món ăn và nút Đóng (X) */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{dish.name}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Đóng modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body: Hình ảnh và chi tiết */}
          <div className="space-y-4">
            <img 
              src={dish.imageUrl} 
              alt={dish.name} 
              className="w-full h-64 object-cover rounded-md bg-gray-200 dark:bg-gray-700" 
            />
            
            {/* Hàng hiển thị Giá và Trạng thái */}
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                {dish.price.toLocaleString("vi-VN")} VNĐ
              </p>
              
              {/* Hiển thị trạng thái (Còn hàng / Hết hàng) */}
              {dish.status === 'in_stock' ? (
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Còn hàng ({dish.quantity})
                </span>
              ) : (
                <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                  Hết hàng
                </span>
              )}
            </div>

            {/* Mô tả món ăn */}
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {dish.description || 'Chưa có mô tả cho món ăn này.'}
            </p>
          </div>
        </div>

        {/* Footer: Các nút hành động */}
        <div className="flex items-center justify-end gap-4 bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            Đóng
          </button>
          <Link
            href={`/admin/foods/edit/${dish.id}`}
            className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors"
          >
            Sửa
          </Link>
        </div>
      </div>
    </div>
  );
};
