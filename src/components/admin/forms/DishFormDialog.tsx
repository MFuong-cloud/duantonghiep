"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, Type, DollarSign, AlignLeft, ToggleLeft, Tag, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DishService, CreateDishData, UpdateDishData } from "@/api/menu/menu.service";
import { CategoryService } from "@/api/categories/category.service";
import { Category } from "@/model/Category";
import { Dish } from "@/model/Dish";
import { adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn, getDishImages } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";

interface DishFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    dish?: Dish | null; // Nếu có thì là edit, không có thì là create
}

export default function DishFormDialog({ open, onOpenChange, onSuccess, dish }: DishFormDialogProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        status: true,
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await CategoryService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
                toast.error("Không thể tải danh mục");
            }
        };
        if (open) {
            loadCategories();
        }
    }, [open]);

    useEffect(() => {
        if (dish && open) {
            setFormData({
                category_id: dish.category_id.toString(),
                name: dish.name,
                description: dish.description || "",
                price: dish.price?.toString() || "",
                status: dish.status !== false,
            });

            setExistingImages(getDishImages(dish));
            setNewFiles([]);
            setPreviews([]);
        } else if (!dish && open) {
            // Reset form khi thêm mới
            setFormData({
                category_id: "",
                name: "",
                description: "",
                price: "",
                status: true,
            });
            setExistingImages([]);
            setNewFiles([]);
            setPreviews([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [dish, open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            const newPrev = [...prev];
            URL.revokeObjectURL(newPrev[index]); // Cleanup
            return newPrev.filter((_, i) => i !== index);
        });
    };

    const processFiles = (files: FileList | File[]) => {
        const validFiles: File[] = [];
        const newPreviews: string[] = [];

        Array.from(files).forEach(file => {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error(`File ${file.name} không phải là ảnh`);
                return;
            }
            validFiles.push(file);
            newPreviews.push(URL.createObjectURL(file));
        });

        if (validFiles.length > 0) {
            setNewFiles(prev => [...prev, ...validFiles]);
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            processFiles(files);
        }
    };

    const handlePriceChange = (value: string) => {
        const clean = value.replace(/[^\d]/g, "");
        setFormData((prev) => ({ ...prev, price: clean }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        // 1. Category (required)
        if (!formData.category_id) {
            toast.error("Vui lòng chọn danh mục");
            return;
        }

        // 2. Name (required, max 255)
        if (!formData.name || formData.name.trim() === "") {
            toast.error("Vui lòng nhập tên món ăn");
            return;
        }
        if (formData.name.length > 255) {
            toast.error("Tên món ăn không được vượt quá 255 ký tự");
            return;
        }

        // 3. Price (required, numeric, min 0, max 100,000,000)
        if (!formData.price || formData.price.trim() === "") {
            toast.error("Vui lòng nhập giá món ăn");
            return;
        }
        const price = parseFloat(formData.price);
        if (isNaN(price)) {
            toast.error("Giá món ăn không hợp lệ");
            return;
        }
        if (price < 0) {
            toast.error("Giá món ăn phải lớn hơn hoặc bằng 0");
            return;
        }
        if (price > 100000000) {
            toast.error("Giá món ăn không được vượt quá 100,000,000 VNĐ");
            return;
        }

        // 4. Description (nullable, max 1000)
        if (formData.description && formData.description.length > 1000) {
            toast.error("Mô tả không được vượt quá 1000 ký tự");
            return;
        }

        // 5. Images (for create: at least 1 required)
        if (!dish && newFiles.length === 0) {
            toast.error("Vui lòng chọn ít nhất một ảnh cho món ăn");
            return;
        }

        setLoading(true);
        try {
            if (dish) {
                // Update dish
                const updateData: UpdateDishData = {
                    category_id: parseInt(formData.category_id),
                    name: formData.name,
                    description: formData.description || undefined,
                    price: price,
                    status: formData.status,
                    images: newFiles,
                    existing_images: existingImages,
                };

                await DishService.updateDish(dish.id, updateData);
                toast.success(`Cập nhật món "${formData.name}" thành công!`);
            } else {
                // Create dish
                if (newFiles.length === 0) {
                    toast.error("Vui lòng chọn ít nhất một ảnh cho món ăn");
                    setLoading(false);
                    return;
                }

                const createData: CreateDishData = {
                    category_id: parseInt(formData.category_id),
                    name: formData.name,
                    description: formData.description || undefined,
                    price: price,
                    images: newFiles,
                    status: formData.status,
                };

                await DishService.createDish(createData);
                toast.success(`Thêm món "${formData.name}" thành công!`);
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi lưu món ăn:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                        ? error
                        : "Có lỗi xảy ra khi lưu món ăn";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl h-[95vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {dish ? "Cập nhật món ăn" : "Thêm món ăn mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
                            {/* Cột Trái: Form Inputs */}
                            <div className="space-y-4">
                                {/* Danh mục */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                                            Danh mục <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <Combobox
                                        options={categories.map((cat) => ({
                                            value: cat.id.toString(),
                                            label: cat.name,
                                        }))}
                                        value={formData.category_id}
                                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                                        placeholder="-- Chọn danh mục --"
                                        searchPlaceholder="Tìm kiếm danh mục..."
                                        emptyText="Không tìm thấy danh mục."
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a]")}
                                    />
                                </div>

                                {/* Tên món */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">
                                                Tên món <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formData.name.length}/255</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a]")}
                                        placeholder="Ví dụ: Bò Wagyu, Combo Hải Sản..."
                                        maxLength={255}
                                    />
                                </div>

                                {/* Giá */}
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 shadow-sm border border-green-200 dark:border-green-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-green-600 dark:bg-green-500 rounded-lg">
                                                <DollarSign className="w-4 h-4 text-white" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">
                                                Giá niêm yết <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">0 - 100M VNĐ</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₫</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={formData.price}
                                            onChange={(e) => handlePriceChange(e.target.value)}
                                            className={cn(adminInputClass, "pl-7 bg-white dark:bg-[#2a2a2a] appearance-none")}
                                            placeholder="Nhập giá tiền"
                                        />
                                    </div>
                                </div>

                                {/* Mô tả */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                                <AlignLeft className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">Mô tả chi tiết</label>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{formData.description.length}/1000</span>
                                    </div>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className={cn(adminInputClass, "min-h-[100px] bg-white dark:bg-[#2a2a2a] resize-none text-sm")}
                                        placeholder="Gợi ý về hương vị, thành phần chính hoặc cách phục vụ..."
                                        maxLength={1000}
                                        rows={4}
                                    />
                                </div>

                                {/* Trạng thái */}
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/10 dark:to-blue-900/10 rounded-xl p-4 shadow-sm border border-indigo-200 dark:border-indigo-800">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-lg">
                                                <ToggleLeft className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <span className="block text-sm font-bold text-gray-900 dark:text-white">Trạng thái hiển thị</span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Bật để món ăn xuất hiện trên menu</span>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={formData.status}
                                            onCheckedChange={(c) => setFormData({ ...formData, status: c })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cột Phải: Ảnh */}
                            <div className="flex flex-col h-full">
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                                                <ImageIcon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">
                                                Ảnh món ăn {!dish && <span className="text-red-500">*</span>}
                                            </label>
                                        </div>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">JPG, PNG, WEBP</span>
                                    </div>

                                    <div
                                        className={cn(
                                            "flex-1 border-2 border-dashed rounded-xl p-3 overflow-y-auto transition-colors max-h-[500px]",
                                            isDragging
                                                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20"
                                                : "border-gray-300 dark:border-gray-600 bg-gray-50/30 dark:bg-gray-800/30"
                                        )}
                                        onDragEnter={handleDragEnter}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        {isDragging && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10 backdrop-blur-sm z-10 rounded-xl pointer-events-none">
                                                <div className="text-center">
                                                    <Upload className="w-10 h-10 text-blue-500 mx-auto mb-2" />
                                                    <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Thả ảnh vào đây</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Existing Images */}
                                            {existingImages.map((url, index) => (
                                                <div key={`existing-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                                    <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}

                                            {/* New Images Previews */}
                                            {previews.map((url, index) => (
                                                <div key={`new-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800">
                                                    <img src={url} alt={`New ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveNewImage(index)}
                                                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500/80 text-white text-[10px] text-center py-0.5">
                                                        Mới
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Add Button */}
                                            <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] cursor-pointer transition-colors">
                                                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                                <span className="text-xs text-gray-500">Thêm ảnh</span>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageChange}
                                                />
                                            </label>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-11 text-base" disabled={loading}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 text-base font-semibold" disabled={loading}>
                            {loading ? "Đang lưu..." : dish ? "Lưu thay đổi" : "Tạo món ăn"}
                        </Button>
                    </div>
                </form>
            </DialogContent >
        </Dialog >
    );
}


