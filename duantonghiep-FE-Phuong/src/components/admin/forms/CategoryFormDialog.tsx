import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Category } from "@/model/Category";
import { toast } from "sonner";
import { Pencil, Plus, Type, AlignLeft, ToggleLeft, Image as ImageIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: Category | null;
    onSuccess: () => void;
    categories: Category[]; // For duplicate check
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const EMPTY_FORM = {
    name: "",
    description: "",
    image: "",
    status: true,
};

export default function CategoryFormDialog({ open, onOpenChange, category, onSuccess, categories }: CategoryFormDialogProps) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (category) {
                setFormData({
                    name: category.name,
                    description: category.description || "",
                    image: category.image || "",
                    status: !!category.status,
                });
                setImagePreview(category.image ? getImageUrl(category.image) : null);
            } else {
                setFormData(EMPTY_FORM);
                setImagePreview(null);
            }
            setImageFile(null);
        }
    }, [open, category]);

    const getImageUrl = (img?: string | null) => {
        if (!img) return "/image/food/food.jpg";
        if (img.startsWith("http")) return img;
        if (img.startsWith("/storage")) return `${API_BASE}${img}`;
        return `${API_BASE}/storage/${img}`;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processImageFile(file);
        }
    };

    const processImageFile = (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh");
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
    };
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation(); setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processImageFile(file);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name?.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("name", formData.name.trim());
            fd.append("description", formData.description?.trim() || "");
            fd.append("status", formData.status ? "1" : "0");
            if (imageFile) fd.append("image", imageFile);

            const trimmedName = formData.name.trim().toLowerCase();
            const isDuplicate = categories.some(cat => {
                if (category && cat.id === category.id) return false;
                return cat.name.trim().toLowerCase() === trimmedName;
            });

            if (isDuplicate) {
                toast.error(`Tên danh mục "${formData.name}" đã tồn tại!`);
                setLoading(false);
                return;
            }

            let res;
            if (category) {
                fd.append("_method", "PUT");
                res = await fetch(`${API_BASE}/api/categories/${category.id}`, { method: "POST", body: fd });
            } else {
                res = await fetch(`${API_BASE}/api/categories`, { method: "POST", body: fd });
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                if (errorData.errors) {
                    const errorMessages = Object.values(errorData.errors).flat().join(", ");
                    throw new Error(errorMessages);
                }
                throw new Error(errorData.message || "Lỗi API");
            }

            toast.success(category ? "Cập nhật thành công" : "Thêm mới thành công");
            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Có lỗi xảy ra khi lưu");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl h-[95vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {category ? <Pencil className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
                        {category ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSaveCategory} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
                            {/* Cột trái - Thông tin cơ bản */}
                            <div className="space-y-4">
                                {/* Tên danh mục */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                                            Tên danh mục <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-base"
                                        placeholder="Ví dụ: Món nướng, Hải sản..."
                                    />
                                </div>

                                {/* Mô tả */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <AlignLeft className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                                            Mô tả
                                        </label>
                                    </div>
                                    <textarea
                                        rows={6}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-sm"
                                        placeholder="Nhập mô tả chi tiết về danh mục..."
                                    />
                                </div>

                                {/* Trạng thái */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 shadow-sm border border-green-200 dark:border-green-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-600 dark:bg-green-500 rounded-lg">
                                                <ToggleLeft className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-gray-900 dark:text-white">Trạng thái hiển thị</span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Bật để danh mục xuất hiện trên menu</span>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={formData.status}
                                            onCheckedChange={(c) => setFormData({ ...formData, status: c })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cột phải - Ảnh đại diện */}
                            <div className="flex flex-col h-full">
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                            <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Ảnh đại diện</label>
                                    </div>

                                    <label
                                        className={cn(
                                            "flex-1 relative group cursor-pointer overflow-hidden border-2 border-dashed rounded-xl transition-all min-h-[300px] flex items-center justify-center",
                                            isDragging
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:border-blue-500"
                                        )}
                                        onDragEnter={handleDragEnter}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {isDragging && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm z-20 rounded-xl pointer-events-none">
                                                <div className="text-center">
                                                    <Upload className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                                    <p className="text-blue-600 dark:text-blue-400 font-semibold">Thả ảnh vào đây</p>
                                                </div>
                                            </div>
                                        )}
                                        {imagePreview ? (
                                            <>
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl absolute inset-0" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl z-10">
                                                    <p className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                                        <Pencil className="w-4 h-4" /> Thay đổi ảnh
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                                                    <ImageIcon className="w-8 h-8" />
                                                </div>
                                                <p className="text-base font-semibold text-gray-700 dark:text-gray-300">Click hoặc kéo thả ảnh</p>
                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, WEBP</p>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-11 text-base">Hủy bỏ</Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 text-base font-semibold">
                            {loading ? "Đang lưu..." : (category ? "Lưu thay đổi" : "Tạo danh mục")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
