"use client";

import { useState, useEffect } from "react";
import { NewsService } from "@/api/news/news.service";
import { News, NewsPagination } from "@/model/News";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function NewsPage() {
    const [newsData, setNewsData] = useState<NewsPagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchNews(currentPage);
    }, [currentPage]);

    const fetchNews = async (page: number) => {
        try {
            setLoading(true);
            const data = await NewsService.getNews(page);
            setNewsData(data);
        } catch (error) {
            console.error("Error fetching news:", error);
            toast.error("Không thể tải tin tức");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return "/images/news-placeholder.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://127.0.0.1:8000/storage/${imagePath}`;
    };

    if (loading && !newsData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4 text-center">📰 Tin Tức</h1>
                    <p className="text-xl text-center text-orange-100">
                        Cập nhật những thông tin mới nhất từ nhà hàng
                    </p>
                </div>
            </div>

            {/* News Grid */}
            <div className="container mx-auto px-4 py-12">
                {newsData && newsData.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {newsData.data.map((news) => (
                                <Link
                                    key={news.id}
                                    href={`/news/${news.slug}`}
                                    className="group"
                                >
                                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden">
                                            <Image
                                                src={getImageUrl(news.image)}
                                                alt={news.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                            {/* Views Badge */}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
                                                <span>👁️</span>
                                                <span>{news.views}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                {news.title}
                                            </h2>

                                            {/* Excerpt */}
                                            <div
                                                className="text-gray-600 text-sm mb-4 line-clamp-3"
                                                dangerouslySetInnerHTML={{
                                                    __html: news.content.substring(0, 150) + "...",
                                                }}
                                            />

                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    📅 {formatDate(news.created_at)}
                                                </span>
                                                {news.category && (
                                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium">
                                                        {news.category.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {newsData.last_page > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    ← Trước
                                </button>

                                <div className="flex gap-2">
                                    {Array.from({ length: newsData.last_page }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 rounded-lg transition-all ${currentPage === page
                                                        ? "bg-orange-600 text-white shadow-lg"
                                                        : "bg-white hover:bg-orange-50 shadow-md"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    )}
                                </div>

                                <button
                                    onClick={() =>
                                        setCurrentPage((p) => Math.min(newsData.last_page, p + 1))
                                    }
                                    disabled={currentPage === newsData.last_page}
                                    className="px-4 py-2 rounded-lg bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">
                            Chưa có tin tức nào
                        </h3>
                        <p className="text-gray-500">Vui lòng quay lại sau</p>
                    </div>
                )}
            </div>
        </div>
    );
}
