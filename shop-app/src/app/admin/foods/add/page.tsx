"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddFoodPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newDish = { name, price: Number(price), description, imageUrl };
    console.log("Dữ liệu món ăn mới:", newDish);
    alert(`Đã thêm món ăn mới: ${name}`);
    router.push("/admin/categories");
  };

  return (
    // THÊM DARK MODE CHO NỀN CHÍNH
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          {/* THÊM DARK MODE CHO TEXT */}
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Thêm món ăn mới
          </h1>
          <Link href="/admin/categories" className="text-amber-600 dark:text-amber-400 hover:underline">
            &larr; Quay lại danh sách
          </Link>
        </div>
        
        {/* THÊM DARK MODE CHO FORM VÀ CÁC THÀNH PHẦN BÊN TRONG */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tên món ăn</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500" required/>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Giá (VNĐ)</label>
            <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500" required/>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Hình ảnh</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"/>
            {imageUrl && <img src={imageUrl} alt="Xem trước" className="mt-4 w-32 h-32 object-cover rounded-md" />}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors">
              Thêm món ăn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}