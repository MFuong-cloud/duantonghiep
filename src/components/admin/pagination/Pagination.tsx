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
                    className={currentPage === page ? "bg-blue-500 text-white" : " bg-gray-100 text-blue-600 hover:bg-blue-300"}
                >
                    {page}
                </Button>
            ))}
        </div>
    );
}
