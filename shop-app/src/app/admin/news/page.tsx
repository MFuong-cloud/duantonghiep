"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
/* eslint-disable @next/next/no-img-element */
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";
import newsService, { News } from "@/services/newsService";

export default function NewsListPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await newsService.getAll({
        page: currentPage,
        per_page: 10,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
        search: searchTerm || undefined,
      });

      if (response.success) {
        setNews(response.data.data);
        setTotalPages(response.data.last_page);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [currentPage, statusFilter, categoryFilter]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchNews();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin tức này?")) {
      return;
    }

    try {
      const response = await newsService.delete(id);
      if (response.success) {
        fetchNews();
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      alert("Có lỗi xảy ra khi xóa tin tức");
    }
    setOpenDropdown(null);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      news: "Tin tức",
      promo: "Khuyến mãi",
      menu: "Menu",
      event: "Sự kiện",
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý tin tức</h1>
          <p className="text-gray-500">Quản lý các bài viết và tin tức của nhà hàng</p>
        </div>
        <Link
          href="/admin/news/create"
          className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          <Plus className="h-5 w-5" />
          Thêm tin tức
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tin tức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="">Tất cả danh mục</option>
            <option value="news">Tin tức</option>
            <option value="promo">Khuyến mãi</option>
            <option value="menu">Menu</option>
            <option value="event">Sự kiện</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
          <button
            onClick={fetchNews}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* News Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-6 py-4 font-medium">Bài viết</th>
                    <th className="px-6 py-4 font-medium">Danh mục</th>
                    <th className="px-6 py-4 font-medium">Trạng thái</th>
                    <th className="px-6 py-4 font-medium">Lượt xem</th>
                    <th className="px-6 py-4 font-medium">Ngày tạo</th>
                    <th className="px-6 py-4 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-24 overflow-hidden rounded-lg bg-gray-100">
                            {item.image ? (
                              <img
                                src={item.image.startsWith("http") ? item.image : `http://localhost:8000${item.image}`}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <Eye className="h-6 w-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                              {item.excerpt || "Không có mô tả"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {getCategoryLabel(item.category)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.status === "published"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(item.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenDropdown(openDropdown === item.id ? null : item.id)
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {openDropdown === item.id && (
                            <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-lg">
                              <Link
                                href={`/admin/news/${item.id}/edit`}
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setOpenDropdown(null)}
                              >
                                <Edit className="h-4 w-4" />
                                Chỉnh sửa
                              </Link>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 className="h-4 w-4" />
                                Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {news.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">Không tìm thấy tin tức nào</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <p className="text-sm text-gray-500">
                Hiển thị {news.length} / {total} tin tức
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <span className="flex items-center px-3 text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
