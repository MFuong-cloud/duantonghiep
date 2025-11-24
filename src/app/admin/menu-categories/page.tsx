"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Pencil, Trash2, PlusCircle, Upload } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/pagination/Pagination";
import { AdminCard, AdminPageHeader, adminInputClass, AdminFormField } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

interface CategoryItem {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    image?: string | null;
}

const EMPTY_FORM = {
    name: "",
    description: "",
    image: "",
    active: true,
};

export default function MenuCategoriesPage() {
    const [categories, setCategories] = useState<CategoryItem[]>([
        { id: "CT001", name: "Khai vị", description: "Các món khai vị nhẹ nhàng", active: true },
        { id: "CT002", name: "Món chính", description: "Món ăn giàu dinh dưỡng", active: true },
        { id: "CT003", name: "Tráng miệng", description: "Đồ ngọt kết thúc bữa ăn", active: false },
    ]);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const itemsPerPage = 10;

    // Load categories từ localStorage khi mount
    useEffect(() => {
        const savedCategories = localStorage.getItem("categories");
        if (savedCategories) setCategories(JSON.parse(savedCategories));
    }, []);

    const filteredCategories = useMemo(
        () => categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
        [categories, search]
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const handleToggleStatus = (id: string) => {
        setCategories(prev => {
            const newCats = prev.map(c => c.id === id ? { ...c, active: !c.active } : c);
            localStorage.setItem("categories", JSON.stringify(newCats)); // lưu trạng thái
            return newCats;
        });

        const cat = categories.find(c => c.id === id);
        if (cat) {
            if (cat.active) toast.error(`Danh mục "${cat.name}" đã ẩn.`);
            else toast.success(`Danh mục "${cat.name}" hiển thị.`);
        }
    };

    const handleDelete = (id: string) => {
        setCategories(prev => {
            const newCats = prev.filter(c => c.id !== id);
            localStorage.setItem("categories", JSON.stringify(newCats));
            return newCats;
        });
        setOpenDialogId(null);
        toast.error("Đã xóa danh mục!");
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setImagePreview(null);
        setEditingId(null);
    };

    const handleOpenForm = () => {
        resetForm();
        setOpenFormDialog(true);
    };

    const handleSaveCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        if (editingId) {
            setCategories(prev => {
                const updated = prev.map(cat =>
                    cat.id === editingId
                        ? {
                            ...cat,
                            name: formData.name.trim(),
                            description: formData.description?.trim(),
                            active: formData.active,
                            image: imagePreview,
                        }
                        : cat
                );
                localStorage.setItem("categories", JSON.stringify(updated));
                return updated;
            });
            toast.success("Cập nhật danh mục thành công!");
        } else {
            const newId = `CT${String(Date.now()).slice(-4)}`;
            const newCategory: CategoryItem = {
                id: newId,
                name: formData.name.trim(),
                description: formData.description?.trim(),
                active: formData.active,
                image: imagePreview,
            };

            setCategories(prev => {
                const updated = [newCategory, ...prev];
                localStorage.setItem("categories", JSON.stringify(updated));
                return updated;
            });
            toast.success("Thêm danh mục thành công!");
        }

        setOpenFormDialog(false);
        resetForm();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng chọn file ảnh hợp lệ");
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            toast.error("Ảnh không được vượt quá 3MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const renderThumbnail = (cat: CategoryItem) => {
        const src = cat.image || "/image/food/food.jpg";
        return (
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={cat.name} className="w-full h-full object-cover" />
            </div>
        );
    };

    return (
        <AdminCard>
            <AdminPageHeader
                title="Quản lý danh mục món ăn"
                description="Sắp xếp danh mục để khách hàng dễ dàng lọc món theo nhu cầu."
                icon={<PlusCircle className="w-5 h-5 text-[#3b82f6]" />}
                actions={
                    <Button
                        onClick={handleOpenForm}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        Thêm danh mục
                    </Button>
                }
            />

            {/* Search */}
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Tìm danh mục..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                    className={cn(adminInputClass, "bg-gray-50 dark:bg-[#2a2a2a]")}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm min-w-[900px] table-auto">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            <th className="p-3 text-center text-gray-700 dark:text-gray-200 font-semibold w-[80px]">Mã</th>
                            <th className="p-3 text-center text-gray-700 dark:text-gray-200 font-semibold w-[100px]">Ảnh</th>
                            <th className="p-3 text-center text-gray-700 dark:text-gray-200 font-semibold min-w-[200px]">Tên danh mục</th>
                            <th className="p-3 text-center text-gray-700 dark:text-gray-200 font-semibold min-w-[250px]">Mô tả</th>
                            <th className="p-3 text-center text-gray-700 dark:text-gray-200 font-semibold w-[160px]">Trạng thái</th>
                            <th className="p-3 text-center text-gray-700 dark:text-gray-200 font-semibold w-[160px]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map(cat => (
                            <tr key={cat.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition">
                                <td className="p-3 text-center">{cat.id}</td>
                                <td className="p-3">
                                    <div className="flex justify-center">{renderThumbnail(cat)}</div>
                                </td>
                                <td className="p-3 font-medium text-center">{cat.name}</td>
                                <td className="p-3 text-sm text-gray-600 dark:text-gray-300 text-center">{cat.description || "-"}</td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <Switch
                                            checked={cat.active}
                                            onCheckedChange={() => handleToggleStatus(cat.id)}
                                        />
                                        <span className={`font-medium ${cat.active ? "text-green-500" : "text-red-500"}`}>
                                            {cat.active ? "Hiển thị" : "Ẩn"}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center justify-center gap-3">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]" title="Xem chi tiết">
                                                    <Eye className="w-5 h-5 text-[#3b82f6]" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-[#3b82f6] text-xl">Thông tin danh mục</DialogTitle>
                                                </DialogHeader>
                                                <div className="grid gap-4 md:grid-cols-2">
                                                    <div className="space-y-2 text-sm">
                                                        <p><strong>Mã:</strong> {cat.id}</p>
                                                        <p><strong>Tên:</strong> {cat.name}</p>
                                                        <p><strong>Mô tả:</strong> {cat.description || "Chưa cập nhật"}</p>
                                                        <p><strong>Trạng thái:</strong> {cat.active ? "Hiển thị" : "Ẩn"}</p>
                                                    </div>
                                                    <div className="bg-gray-50 dark:bg-[#111] rounded-lg p-3 border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={cat.image || "/image/food/food.jpg"}
                                                            alt={cat.name}
                                                            className="w-full h-40 object-cover rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <button
                                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"
                                            title="Chỉnh sửa"
                                            onClick={() => {
                                                setFormData({
                                                    name: cat.name,
                                                    description: cat.description || "",
                                                    image: cat.image || "",
                                                    active: cat.active,
                                                });
                                                setImagePreview(cat.image || null);
                                                setEditingId(cat.id);
                                                setOpenFormDialog(true);
                                            }}
                                        >
                                            <Pencil className="w-5 h-5 text-blue-500" />
                                        </button>

                                        <Dialog open={openDialogId === cat.id} onOpenChange={(open) => setOpenDialogId(open ? cat.id : null)}>
                                            <DialogTrigger asChild>
                                                <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a]" title="Xóa">
                                                    <Trash2 className="w-5 h-5 text-red-500" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader><DialogTitle>Xóa danh mục {cat.name}?</DialogTitle></DialogHeader>
                                                <DialogFooter className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setOpenDialogId(null)}>Hủy</Button>
                                                    <Button variant="destructive" onClick={() => handleDelete(cat.id)}>Xóa</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {/* Add / Edit Dialog */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

            <Dialog open={openFormDialog} onOpenChange={setOpenFormDialog}>
                <DialogContent className="w-full max-w-3xl bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-[#3b82f6]">
                            {formData.name ? "Cập nhật danh mục" : "Thêm danh mục mới"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveCategory} className="space-y-4 mt-2">
                        <div className="grid gap-4 md:grid-cols-2">
                            <AdminFormField label="Tên danh mục" required>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={cn(adminInputClass, "bg-gray-50 dark:bg-[#111]")}
                                    placeholder="Ví dụ: Món nướng, Hải sản..."
                                />
                            </AdminFormField>
                            <AdminFormField label="Trạng thái hiển thị">
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2">
                                    <Switch
                                        checked={formData.active}
                                        onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                                    />
                                    <span className="text-sm">
                                        {formData.active ? "Hiển thị" : "Ẩn trên hệ thống"}
                                    </span>
                                </div>
                            </AdminFormField>
                        </div>

                        <AdminFormField label="Mô tả">
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={cn(adminInputClass, "bg-gray-50 dark:bg-[#111]")}
                                rows={3}
                                placeholder="Nhập mô tả ngắn giúp khách hiểu hơn về danh mục này."
                            />
                        </AdminFormField>

                        <AdminFormField label="Ảnh minh họa" description="Hỗ trợ PNG/JPG, kích thước tối đa 3MB">
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-lg overflow-hidden border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111] flex items-center justify-center">
                                    {imagePreview ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-xs text-gray-400 text-center px-2">Chưa chọn ảnh</span>
                                    )}
                                </div>
                                <label className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white rounded-md cursor-pointer transition">
                                    <Upload className="w-4 h-4" />
                                    Chọn ảnh
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>
                        </AdminFormField>

                        <DialogFooter className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setOpenFormDialog(false)}>
                                Hủy
                            </Button>
                            <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                                {editingId ? "Lưu thay đổi" : "Thêm danh mục"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminCard>
    );
}
