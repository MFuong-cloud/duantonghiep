"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DishService, CreateDishData, UpdateDishData } from "@/api/menu/menu.service";
import { CategoryService } from "@/api/categories/category.service";
import { Category } from "@/model/Category";
import { Dish } from "@/model/Dish";

interface DishFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    dish?: Dish | null; // Nếu có thì là edit, không có thì là create
}

export default function DishFormDialog({ open, onOpenChange, onSuccess, dish }: DishFormDialogProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState({
        category_id: "",
        name: "",
        description: "",
        price: "",
        is_active: true,
    });

    // Load categories
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

    // Load dish data khi edit
    useEffect(() => {
        if (dish && open) {
            setFormData({
                category_id: dish.category_id.toString(),
                name: dish.name,
                description: dish.description || "",
                price: dish.price?.toString() || "",
                is_active: dish.is_active !== false,
            });
            // Set preview ảnh nếu có
            if (dish.image_url) {
                setImagePreview(dish.image_url);
            } else if (dish.image) {
                setImagePreview(dish.image);
            }
        } else if (!dish && open) {
            // Reset form khi thêm mới
            setFormData({
                category_id: "",
                name: "",
                description: "",
                price: "",
                is_active: true,
            });
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [dish, open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Vui lòng chọn file ảnh");
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Kích thước ảnh không được vượt quá 5MB");
                return;
            }
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePriceChange = (value: string) => {
        const clean = value.replace(/[^\d]/g, "");
        setFormData((prev) => ({ ...prev, price: clean }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.category_id || !formData.name || !formData.price) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) {
            toast.error("Giá tiền phải là số dương");
            return;
        }

        setLoading(true);
        try {
            const imageFile = fileInputRef.current?.files?.[0] || null;

            if (dish) {
                // Update dish
                const updateData: UpdateDishData = {
                    category_id: parseInt(formData.category_id),
                    name: formData.name,
                    description: formData.description || undefined,
                    price: price,
                    is_active: formData.is_active,
                };
                
                // Chỉ gửi file nếu có file mới được chọn
                if (imageFile) {
                    updateData.image = imageFile;
                }

                await DishService.updateDish(dish.id, updateData);
                toast.success("Cập nhật món ăn thành công!");
            } else {
                // Create dish
                if (!imageFile) {
                    toast.error("Vui lòng chọn ảnh cho món ăn");
                    setLoading(false);
                    return;
                }

                const createData: CreateDishData = {
                    category_id: parseInt(formData.category_id),
                    name: formData.name,
                    description: formData.description || undefined,
                    price: price,
                    image: imageFile,
                    is_active: formData.is_active,
                };

                await DishService.createDish(createData);
                toast.success("Thêm món ăn thành công!");
            }

            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Lỗi khi lưu món ăn:", error);
            const errorMessage = error?.message || error?.error || "Có lỗi xảy ra khi lưu món ăn";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100">
                <DialogHeader className="space-y-1">
                    <p className="text-sm uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">
                        {dish ? "Cập nhật" : "Tạo mới"}
                    </p>
                    <DialogTitle className="text-2xl font-bold text-[#3b82f6]">
                        {dish ? "Sửa món ăn" : "Thêm món ăn mới"}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Điền thông tin chi tiết để món ăn của bạn hiển thị ấn tượng hơn trên thực đơn.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-4 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Danh mục <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-700 p-2.5 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                    required
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Tên món <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-700 p-2.5 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none"
                                    placeholder="Ví dụ: Bò Wagyu, Combo Hải Sản..."
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4 bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Giá (VNĐ) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400">₫</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={formData.price}
                                        onChange={(e) => handlePriceChange(e.target.value)}
                                        className="w-full bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-700 rounded-md pl-7 p-2.5 focus:ring-2 focus:ring-[#3b82f6] outline-none appearance-none"
                                        placeholder="Nhập giá tiền"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Giá niêm yết đã gồm thuế, phí phục vụ.</p>
                            </div>

                            <div className="flex items-center gap-3 bg-white dark:bg-[#1c1c1c] border border-gray-200 dark:border-gray-700 rounded-md px-4 py-3">
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <div>
                                    <p className="text-sm font-medium">
                                        {formData.is_active ? "Đang hiển thị" : "Đang ẩn"}
                                    </p>
                                    <p className="text-xs text-gray-500">Tắt nếu muốn tạm ngừng bán món.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-3 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none"
                            rows={4}
                            placeholder="Gợi ý về hương vị, thành phần chính hoặc cách phục vụ..."
                        />
                    </div>

                    <div className="bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-xl p-4">
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="relative w-full md:w-48 h-48 rounded-xl overflow-hidden bg-white dark:bg-[#1c1c1c] border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                {imagePreview ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 text-red-500 rounded-full p-1 hover:bg-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center px-4 text-gray-400 text-sm">
                                        Chưa có ảnh. Tải ảnh món ăn hoặc combo để tăng độ hấp dẫn.
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-3">
                                <label className="text-sm font-medium">
                                    Ảnh món ăn {!dish && <span className="text-red-500">*</span>}
                                </label>
                                <p className="text-xs text-gray-500">
                                    Nên sử dụng ảnh ngang, độ phân giải tối thiểu 800x600px để hiển thị sắc nét.
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md cursor-pointer transition"
                                    >
                                        <Upload className="w-4 h-4" />
                                        {imagePreview ? "Chọn ảnh khác" : "Tải ảnh lên"}
                                    </label>
                                    {!imagePreview && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Hỗ trợ JPG, PNG – tối đa 5MB
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                            disabled={loading}
                        >
                            {loading ? "Đang lưu..." : dish ? "Cập nhật" : "Thêm món"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

