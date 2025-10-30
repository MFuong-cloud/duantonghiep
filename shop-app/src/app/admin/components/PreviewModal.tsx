// app/admin/components/PreviewModal.tsx
"use client";

import Link from 'next/link';
import { X } from 'lucide-react';

// Định nghĩa kiểu dữ liệu cho món ăn để component biết nó nhận được gì
interface Dish {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string; // Mô tả có thể có hoặc không
}

interface PreviewModalProps {
  dish: Dish | null;
  onClose: () => void;
}

export const PreviewModal = ({ dish, onClose }: PreviewModalProps) => {
  // Nếu không có món ăn nào được chọn, không hiển thị gì cả
  if (!dish) {
    return null;
  }

  return (
    // Lớp phủ nền 
  <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity">
      {/* Nội dung Modal */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg m-4 transform transition-all">
        <div className="p-6">
          {/* Header với tên món ăn và nút đóng */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{dish.name}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Thân Modal với chi tiết sản phẩm */}
          <div className="space-y-4">
            <img src={dish.imageUrl} alt={dish.name} className="w-full h-64 object-cover rounded-md" />
            <div>
              <p className="text-lg font-semibold text-amber-600 dark:text-amber-400">
                {dish.price.toLocaleString("vi-VN")} VNĐ
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {dish.description || 'Chưa có mô tả cho món ăn này.'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer với các nút chức năng */}
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