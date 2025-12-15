import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dish } from "@/model/Dish";
import { Category } from "@/model/Category";
import { Tag, CheckCircle, XCircle, Type, DollarSign, AlignLeft, Image as ImageIcon } from "lucide-react";

interface DishDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    dish: Dish | undefined | null;
    categories: Category[];
}

export default function DishDetailDialog({ open, onOpenChange, dish, categories }: DishDetailDialogProps) {
    if (!dish) return null;

    const getCategoryName = (categoryId: number): string => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat?.name || "Chưa phân loại";
    };

    const getImageSrc = (item: Dish) => {
        if (item.image_url) return item.image_url;
        if (item.image) {
            let imgPath = item.image;
            try {
                if (typeof imgPath === "string" && imgPath.startsWith("[") && imgPath.endsWith("]")) {
                    const parsed = JSON.parse(imgPath);
                    if (Array.isArray(parsed) && parsed.length > 0) imgPath = parsed[0];
                }
            } catch (e) { }
            return imgPath.startsWith("http") ? imgPath : `http://127.0.0.1:8000/storage/${imgPath}`;
        }
        return null;
    };

    const formatPrice = (price?: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0).replace(',00', '');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
                <div className="relative px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết món ăn</DialogTitle>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Mã ID: <span className="font-mono">#{dish.id}</span></p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 gap-5 h-full">
                        {/* Cột trái - Ảnh */}
                        <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                                    <ImageIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                </div>
                                <label className="text-sm font-bold text-gray-900 dark:text-white">Hình ảnh món ăn</label>
                            </div>
                            <div className="relative w-full flex-1 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-black/20 max-h-[500px]">
                                {dish.image_urls && dish.image_urls.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2 p-2 overflow-y-auto h-full max-h-[480px]">
                                        {dish.image_urls.map((img, idx) => (
                                            <img key={idx} src={img} alt={`${dish.name} ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                        ))}
                                    </div>
                                ) : (dish.images && dish.images.length > 0) ? (
                                    <div className="grid grid-cols-2 gap-2 p-2 overflow-y-auto h-full max-h-[480px]">
                                        {dish.images.map((img, idx) => (
                                            <img key={idx} src={img} alt={`${dish.name} ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                        ))}
                                    </div>
                                ) : getImageSrc(dish) ? (
                                    <img
                                        src={getImageSrc(dish)!}
                                        alt={dish.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <div className="text-center">
                                            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Chưa có ảnh</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Cột phải - Thông tin */}
                        <div className="space-y-4">
                            {/* Tên món & Trạng thái */}
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white">Tên món ăn</label>
                                </div>
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{dish.name}</h3>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border shrink-0 ${dish.status !== false ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}>
                                        {dish.status !== false ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                        {dish.status !== false ? "Đang bán" : "Ngưng bán"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <Tag className="w-4 h-4" />
                                    <span>Danh mục: <span className="font-semibold text-gray-900 dark:text-gray-100">{getCategoryName(dish.category_id)}</span></span>
                                </div>
                            </div>

                            {/* Giá */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 shadow-sm border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-green-600 dark:bg-green-500 rounded-lg">
                                        <DollarSign className="w-4 h-4 text-white" />
                                    </div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white">Giá bán</label>
                                </div>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatPrice(dish.price)}
                                </p>
                            </div>

                            {/* Mô tả */}
                            <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 flex flex-col">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <AlignLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <label className="text-sm font-bold text-gray-900 dark:text-white">Mô tả chi tiết</label>
                                </div>
                                <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm leading-relaxed overflow-auto break-words whitespace-pre-wrap">
                                    {dish.description || "Chưa có mô tả."}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <Button onClick={() => onOpenChange(false)}>Đóng</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
