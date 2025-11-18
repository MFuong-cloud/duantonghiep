"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

export default function AddMenuItem() {
  const router = useRouter();

  // State form data
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    category: "",
    price: 0,
    active: true,
  });

  // State cho hình ảnh preview
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load danh mục để user chọn (đỡ phải nhập tay)
  const [categories, setCategories] = useState<{ name: string }[]>([]);

  useEffect(() => {
    // Giả lập load danh mục từ localStorage hoặc API
    const savedCategories = localStorage.getItem("categories");
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch {
        setCategories([]);
      }
    } else {
      // Dữ liệu mẫu nếu không có localStorage
      setCategories([
        { name: "Khai vị" },
        { name: "Món chính" },
        { name: "Tráng miệng" },
      ]);
    }
  }, []);

  // Xử lý thay đổi input text/number/select
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  // Xử lý upload ảnh
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tạo URL preview local
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImageFile(file);
    }
  };

  // Xử lý Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id || !formData.name || !formData.category) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc!");
      return;
    }

    // Ở đây bạn sẽ gọi API để lưu dữ liệu (FormData nếu có file)
    // Code demo giả lập lưu thành công:
    console.log("Submitting:", { ...formData, imageFile });

    toast.success(`Đã thêm món "${formData.name}" thành công!`);

    // Quay về trang danh sách sau 1s
    setTimeout(() => {
      router.push("/admin/menu-items");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <Link href="/admin/menu-items">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 dark:hover:bg-[#333]"
          >
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-[#3b82f6]">Thêm món mới</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Cột Trái: Upload Ảnh */}
        <div className="col-span-1 flex flex-col items-center gap-4">
          <div className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center relative overflow-hidden hover:border-[#3b82f6] transition bg-gray-50 dark:bg-[#2a2a2a]">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full text-gray-400 hover:text-[#3b82f6]">
                <Upload className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium">Tải ảnh lên</span>
                <span className="text-xs text-gray-400 mt-1">
                  (JPG, PNG, WEBP)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Chọn ảnh đại diện cho món ăn.
            <br />
            Kích thước tối ưu: 500x500px.
          </p>
        </div>

        {/* Cột Phải: Thông tin chi tiết */}
        <div className="col-span-1 md:col-span-2 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            {/* Mã món */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Mã món <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="id"
                placeholder="VD: FD001"
                value={formData.id}
                onChange={handleChange}
                className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
              />
            </div>

            {/* Giá món */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                Giá bán (VNĐ)
              </label>
              <input
                type="number"
                name="price"
                placeholder="0"
                value={formData.price}
                onChange={handleChange}
                min="0"
                className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
              />
            </div>
          </div>

          {/* Tên món */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Tên món ăn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nhập tên món..."
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
            />
          </div>

          {/* Danh mục */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Danh mục <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2.5 rounded-md bg-gray-50 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-600 focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] outline-none"
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Trạng thái */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg border border-gray-200 dark:border-gray-700">
            <div>
              <p className="font-medium">Trạng thái kinh doanh</p>
              <p className="text-xs text-gray-500">
                Bật để món ăn hiển thị trên menu của khách
              </p>
            </div>
            <Switch
              checked={formData.active}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, active: checked }))
              }
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex gap-3 justify-end">
            <Link href="/admin/menu-items">
              <Button type="button" variant="outline" className="px-6">
                Hủy bỏ
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Lưu món
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
