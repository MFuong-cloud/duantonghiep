"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { News } from "@/model/News";
import { Calendar, Eye, Globe } from "lucide-react";
import { getImageUrl } from "@/lib/utils/image";
import { formatNewsDate } from "@/lib/utils/format";

interface NewsDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    news: News | null;
    onEdit?: (news: News) => void;
}

export default function NewsDetailDialog({
    open,
    onOpenChange,
    news,
    onEdit,
}: NewsDetailDialogProps) {
    if (!news) return null;



    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[1000px] h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] border-none shadow-2xl rounded-2xl">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        Chi tiết tin tức
                    </DialogTitle>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Cover Image */}
                    <div className="relative w-full h-64 md:h-80 bg-gray-100 dark:bg-gray-800">
                        {news.image ? (
                            <img
                                src={getImageUrl(news.image)}
                                alt={news.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span>Không có ảnh bìa</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                            <div className="p-8 w-full">
                                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 line-clamp-3 drop-shadow-md">
                                    {news.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {formatNewsDate(news.created_at)}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        {news.views} lượt xem
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${news.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                                        {news.is_active ? "Đang hiển thị" : "Đang ẩn"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8 max-w-4xl mx-auto">
                        <div className="prose prose-lg max-w-none dark:prose-invert prose-img:rounded-xl">
                            <div dangerouslySetInnerHTML={{ __html: news.content }} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-end gap-2 shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Đóng
                    </Button>
                    {onEdit && (
                        <Button onClick={() => {
                            onOpenChange(false);
                            onEdit(news);
                        }}>
                            Chỉnh sửa
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
