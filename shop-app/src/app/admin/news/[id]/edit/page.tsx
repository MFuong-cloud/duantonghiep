"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import newsService, { News } from "@/services/newsService";

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams();
  const newsId = Number(params.id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "news",
    status: "draft" as "draft" | "published",
    image: null as File | null,
  });

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await newsService.getById(newsId);
        if (response.success) {
          const news = response.data;
          setFormData({
            title: news.title,
            slug: news.slug,
            excerpt: news.excerpt || "",
            content: news.content,
            category: news.category,
            status: news.status,
            image: null,
          });

          if (news.image) {
            const imageUrl = news.image.startsWith("http")
              ? news.image
              : `http://localhost:8000${news.image}`;
            setImagePreview(imageUrl);
            setOriginalImage(imageUrl);
          }
        }
      } catch (err: any) {
        console.error("Error fetching news:", err);
        setError("Không thể tải thông tin tin tức");
      } finally {
        setIsLoading(false);
      }
    };

    if (newsId) {
      fetchNews();
    }
  }, [newsId]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Kích thước ảnh không được vượt quá 2MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn file ảnh");
        return;
      }

      setError(null);
      setFormData({ ...formData, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!formData.title.trim()) {
      setError("Vui lòng nhập tiêu đề");
      return;
    }
    if (!formData.content.trim()) {
      setError("Vui lòng nhập nội dung");
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: any = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        status: formData.status,
      };

      // Chỉ gửi ảnh mới nếu user đã chọn ảnh mới
      if (formData.image) {
        updateData.image = formData.image;
      }

      const response = await newsService.update(newsId, updateData);

      if (response.success) {
        router.push("/admin/news");
      }
    } catch (err: any) {
      console.error("Error updating news:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật tin tức");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/news"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa tin tức</h1>
          <p className="text-gray-500">Cập nhật nội dung bài viết</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Nội dung bài viết
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Nhập tiêu đề bài viết"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Đường dẫn (Slug)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="duong-dan-bai-viet"
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mô tả ngắn
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Mô tả ngắn gọn về bài viết..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Nhập nội dung bài viết..."
                  rows={12}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Xuất bản
            </h2>

            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "draft" | "published" })
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Xuất bản</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Danh mục
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  <option value="news">Tin tức</option>
                  <option value="promo">Khuyến mãi</option>
                  <option value="menu">Menu</option>
                  <option value="event">Sự kiện</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Đang lưu..." : "Cập nhật"}
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Ảnh đại diện
            </h2>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-orange-500 hover:bg-orange-50">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Click để tải ảnh lên
                </span>
                <span className="mt-1 text-xs text-gray-400">
                  PNG, JPG (tối đa 2MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}

            {imagePreview && (
              <label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="h-4 w-4" />
                Thay đổi ảnh
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
