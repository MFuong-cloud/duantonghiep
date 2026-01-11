"use client";

import { useState, useEffect } from "react";
import { NewsService } from "@/api/news/news.service";
import { NewsPagination } from "@/model/News";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { getImageUrl, getNewsPlaceholder } from "@/lib/utils/image";
import { formatDateVN } from "@/lib/utils/format";

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



    if (loading && !newsData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300">
            {/* Header Banner with Image */}
            <div className="relative bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-900 dark:to-red-900 text-white py-32 md:py-40 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/image/tintuc.jpg"
                        alt="Tin tức banner"
                        fill
                        className="object-cover object-top"
                        priority
                    />
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70"></div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center drop-shadow-lg">📰 Tin Tức</h1>
                    <p className="text-xl md:text-2xl text-center text-orange-100 dark:text-orange-200/80 drop-shadow-md">
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
                                    className="group block h-full"
                                >
                                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border border-transparent dark:border-neutral-700">
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden flex-shrink-0">
                                            <Image
                                                src={getImageUrl(news.image, getNewsPlaceholder())}
                                                alt={news.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                            {/* Views Badge */}
                                            <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 flex items-center gap-1 shadow-sm">
                                                <span>👁️</span>
                                                <span>{news.views}</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                {news.title}
                                            </h2>

                                            {/* Excerpt */}
                                            <div
                                                className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1"
                                                dangerouslySetInnerHTML={{
                                                    __html: news.content.substring(0, 150) + "...",
                                                }}
                                            />

                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-neutral-700">
                                                <span className="flex items-center gap-1">
                                                    📅 {formatDateVN(news.created_at)}
                                                </span>
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
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 dark:text-gray-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-orange-50 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700"
                                >
                                    ← Trước
                                </button>

                                <div className="flex gap-2 flex-wrap justify-center">
                                    {Array.from({ length: newsData.last_page }, (_, i) => i + 1).map(
                                        (page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 rounded-lg transition-all border ${currentPage === page
                                                    ? "bg-orange-600 text-white shadow-lg border-orange-600"
                                                    : "bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-neutral-700 shadow-md border-transparent dark:border-neutral-700"
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
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-neutral-800 dark:text-gray-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-orange-50 dark:hover:bg-neutral-700 border border-transparent dark:border-neutral-700"
                                >
                                    Sau →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white/50 dark:bg-neutral-800/50 rounded-3xl backdrop-blur-sm">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                            Chưa có tin tức nào
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">Vui lòng quay lại sau</p>
                    </div>
                )}
            </div>
        </div>
    );
}
