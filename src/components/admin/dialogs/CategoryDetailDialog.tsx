import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/model/Category";
import { Tag, CheckCircle, XCircle, Type, AlignLeft, Image as ImageIcon } from "lucide-react";

interface CategoryDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | undefined;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const getImageUrl = (img?: string | null) => {
    if (!img) return "/image/food/food.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/storage")) return `${API_BASE}${img}`;
    return `${API_BASE}/storage/${img}`;
};

export default function CategoryDetailDialog({ open, onOpenChange, category }: CategoryDetailDialogProps) {
    if (!category) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
                <div className="relative px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết danh mục</DialogTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mã ID: <span className="font-mono">#{category.id}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-5 h-full">
                        {/* Cột trái - Ảnh */}
                        <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                    <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                </div>
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Hình ảnh</label>
                            </div>
                            <div className="relative w-full flex-1 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-black/20">
                                <img
                                    src={getImageUrl(category.image)}
                                    alt={category.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = "/image/food/food.jpg")}
                                />
                            </div>
                        </div>

                        {/* Cột phải - Thông tin */}
                        <div className="space-y-4">
                            {/* Tên & Trạng thái */}
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white">Tên danh mục</label>
                                </div>
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{category.name}</h3>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border shrink-0 ${category.status ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}>
                                        {category.status ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        {category.status ? "Hoạt động" : "Đang ẩn"}
                                    </span>
                                </div>
                            </div>

                            {/* Mô tả */}
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <AlignLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white">Mô tả</label>
                                </div>
                                <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-auto break-words whitespace-pre-wrap">
                                    {category.description || "Chưa có mô tả."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-5 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="px-8 h-11 text-base">Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
