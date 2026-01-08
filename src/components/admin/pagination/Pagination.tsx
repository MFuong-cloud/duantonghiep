"use client";

import { cn } from "@/lib/utils";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    accent?: "blue" | "orange";
}

export function Pagination({ totalPages, currentPage, setCurrentPage, accent = "blue" }: PaginationProps) {
    // Luôn hiển thị pagination, ngay cả khi chỉ có 1 trang
    if (totalPages < 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const accentClass =
        accent === "orange"
            ? "bg-[#ff6600] hover:bg-[#ff7a1a]"
            : "bg-[#3b82f6] hover:bg-[#2563eb]";

    return (
        <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
                Trang <span className="font-medium text-gray-700 dark:text-gray-300">{currentPage}</span> / <span className="font-medium text-gray-700 dark:text-gray-300">{totalPages}</span>
            </div>
            <div className="flex justify-center gap-1.5">
                {pages.map(page => (
                    <button
                        type="button"
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                            "px-2.5 py-1 text-xs font-medium rounded-md border transition-colors",
                            currentPage === page
                                ? cn(accentClass, "text-white shadow-sm border-transparent")
                                : "bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
                        )}
                    >
                        {page}
                    </button>
                ))}
            </div>
            <div className="w-16"></div> {/* Spacer để căn giữa */}
        </div>
    );
}
