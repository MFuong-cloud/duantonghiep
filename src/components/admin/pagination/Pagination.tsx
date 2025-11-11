"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
    totalPages: number;
    currentPage: number;
    setCurrentPage: (page: number) => void;
}

export function Pagination({ totalPages, currentPage, setCurrentPage }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center gap-2 mt-4">
            {pages.map(page => (
                <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-200"}
                >
                    {page}
                </Button>
            ))}
        </div>
    );
}
