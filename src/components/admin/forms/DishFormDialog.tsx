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
import { AdminFormField, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

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
        status: true,
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
                status: dish.status !== false,
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
                status: true,
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
                    status: formData.status,
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
                    status: formData.status,
                };

                await DishService.createDish(createData);
                toast.success("Thêm món ăn thành công!");
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

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                            {/* Cột Trái: Form Inputs */}
                            <div className="space-y-4">
                                <AdminFormField label="Danh mục" required>
                                    <select
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a] appearance-none")}
                                        required
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </AdminFormField>

                                <AdminFormField label="Tên món" required>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a]")}
                                        placeholder="Ví dụ: Bò Wagyu, Combo Hải Sản..."
                                        required
                                    />
                                </AdminFormField>

                                <AdminFormField label="Giá niêm yết (VNĐ)" required>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₫</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={formData.price}
                                            onChange={(e) => handlePriceChange(e.target.value)}
                                            className={cn(adminInputClass, "pl-7 bg-white dark:bg-[#2a2a2a] appearance-none")}
                                            placeholder="Nhập giá tiền"
                                            required
                                        />
                                    </div>
                                </AdminFormField>

                                <AdminFormField label="Mô tả chi tiết">
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className={cn(adminInputClass, "min-h-[100px] bg-white dark:bg-[#2a2a2a] resize-none")}
                                        placeholder="Gợi ý về hương vị, thành phần chính hoặc cách phục vụ..."
                                        rows={4}
                                    />
                                </AdminFormField>

                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div>
                                        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Trạng thái hiển thị</span>
                                        <span className="text-sm text-gray-500">Bật để món ăn xuất hiện trên menu</span>
                                    </div>
                                    <Switch
                                        checked={formData.status}
                                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked })}
                                    />
                                </div>
                            </div>

                            {/* Cột Phải: Ảnh */}
                            <div className="flex flex-col h-full">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Ảnh món ăn {!dish && <span className="text-red-500">*</span>}
                                </label>

                                <label className="flex-1 relative group cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:border-blue-500 transition-all bg-gray-50/30 min-h-[250px] flex items-center justify-center">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl absolute inset-0" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl z-10">
                                                <p className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                                    <Upload className="w-4 h-4" /> Thay đổi ảnh
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.preventDefault(); handleRemoveImage(); }}
                                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 z-20 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Click để tải ảnh lên</p>
                                            <p className="text-sm text-gray-400 mt-1">JPG, PNG tối đa 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
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
            </DialogContent>
        </Dialog>
    );
}

