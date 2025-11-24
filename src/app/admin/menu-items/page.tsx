"use client";

import { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2, Eye, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/pagination/Pagination";
import DishFormDialog from "@/components/admin/forms/DishFormDialog";
import { DishService } from "@/api/menu/menu.service";
import { CategoryService } from "@/api/categories/category.service";
import { Dish } from "@/model/Dish";
import { Category } from "@/model/Category";
import { AdminCard, AdminPageHeader, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

export default function MenuItemsManagement() {
    const [items, setItems] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);
    const itemsPerPage = 7;

    // Load dữ liệu từ API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [dishesData, categoriesData] = await Promise.all([
                    DishService.getDishes(),
                    CategoryService.getCategories(),
                ]);
                setItems(dishesData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                toast.error("Không thể tải dữ liệu món ăn");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    }, [items, search]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const getCategoryName = (categoryId: number): string => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat?.name || "Chưa phân loại";
    };

    const handleToggleStatus = async (id: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        try {
            // Xử lý trường hợp is_active có thể là undefined/null
            const currentStatus = item.is_active !== false; // Mặc định là true nếu undefined/null
            const newStatus = !currentStatus;

            await DishService.updateDish(id, { is_active: newStatus });

            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, is_active: newStatus } : i))
            );

            toast.success(`Món "${item.name}" đã chuyển sang ${newStatus ? "Còn" : "Ngưng"}.`);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : typeof error === "string"
                        ? error
                        : "Không thể cập nhật trạng thái món ăn";
            toast.error(errorMessage);
        }
    };

    const handleAdd = () => {
        setEditingDish(null);
        setOpenFormDialog(true);
    };

    const handleEdit = (id: number) => {
        const item = items.find((i) => i.id === id);
        if (item) {
            setEditingDish(item);
            setOpenFormDialog(true);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await DishService.deleteDish(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
            setOpenDialogId(null);
            toast.success("Đã xóa món thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa món:", error);
            const message = error instanceof Error ? error.message : "Không thể xóa món ăn";
            toast.error(message);
        }
    };

    const handleFormSuccess = async () => {
        // Reload data sau khi thêm/sửa thành công
        try {
            const dishesData = await DishService.getDishes();
            setItems(dishesData);
        } catch (error) {
            console.error("Lỗi khi tải lại dữ liệu:", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6] mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AdminCard>
            <AdminPageHeader
                title="Quản lý món ăn"
                description="Quản lý thực đơn, theo dõi trạng thái hiển thị và cập nhật giá bán."
                icon={<PlusCircle className="w-5 h-5 text-[#3b82f6]" />}
                actions={
                    <Button
                        onClick={handleAdd}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" /> Thêm món
                    </Button>
                }
            />

            {/* Search */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên món..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className={cn(adminInputClass, "pl-9 bg-gray-50 dark:bg-[#2a2a2a]")}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-[1100px] w-full text-sm table-auto">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold w-[60px]">ID</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold min-w-[200px]">Tên món</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold min-w-[160px]">Danh mục</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold w-[120px]">Ảnh</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold w-[120px]">Giá</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold w-[160px]">Trạng thái</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold w-[180px]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    Không có món ăn nào
                                </td>
                            </tr>
                        ) : (
                            currentItems.map((i) => (
                                <tr
                                    key={i.id}
                                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition"
                                >
                                    <td className="p-3 text-center">{i.id}</td>
                                    <td className="p-3 font-medium text-center">{i.name}</td>
                                    <td className="p-3 text-center">{getCategoryName(i.category_id)}</td>
                                    <td className="p-3">
                                        <div className="w-16 h-12 mx-auto rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#111]">
                                            {i.image_url || i.image ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={(i as any).image_url || (i as any).image}
                                                    alt={i.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[11px] text-gray-400">
                                                    No image
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-3 text-center">{i.price?.toLocaleString("vi-VN")} ₫</td>
                                    <td className="p-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Switch
                                                checked={i.is_active !== false}
                                                onCheckedChange={() => handleToggleStatus(i.id)}
                                            />
                                            <span className={`font-medium ${i.is_active !== false ? "text-green-500" : "text-red-500"}`}>
                                                {i.is_active !== false ? "Còn" : "Ngưng"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-3 flex justify-center items-center gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]" title="Xem chi tiết">
                                                    <Eye className="w-5 h-5 text-[#3b82f6]" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-[#3b82f6] text-xl">Thông tin món #{i.id}</DialogTitle>
                                                </DialogHeader>
                                                <div className="mt-4 space-y-2 text-sm">
                                                    <p><b>Tên:</b> {i.name}</p>
                                                    <p><b>Danh mục:</b> {getCategoryName(i.category_id)}</p>
                                                    <p><b>Giá:</b> {i.price?.toLocaleString("vi-VN")} ₫</p>
                                                    <p><b>Mô tả:</b> {i.description || "Không có mô tả"}</p>
                                                    <p><b>Trạng thái:</b> {i.is_active !== false ? "Còn" : "Ngưng"}</p>
                                                    {i.image_url && (
                                                        <div className="mt-4">
                                                            <img
                                                                src={i.image_url}
                                                                alt={i.name}
                                                                className="w-full h-48 object-cover rounded-md"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <button
                                            onClick={() => handleEdit(i.id)}
                                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"
                                            title="Sửa"
                                        >
                                            <Pencil className="w-5 h-5 text-[#10b981]" />
                                        </button>

                                        <Dialog open={openDialogId === i.id.toString()} onOpenChange={(open) => setOpenDialogId(open ? i.id.toString() : null)}>
                                            <DialogTrigger asChild>
                                                <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a]" title="Xóa">
                                                    <Trash2 className="w-5 h-5 text-red-500" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-red-500 text-lg">Xóa món {i.name}?</DialogTitle>
                                                </DialogHeader>
                                                <DialogFooter className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => setOpenDialogId(null)}>Hủy</Button>
                                                    <Button variant="destructive" onClick={() => handleDelete(i.id)}>Xóa</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {/* Form Dialog */}
            <DishFormDialog
                open={openFormDialog}
                onOpenChange={setOpenFormDialog}
                onSuccess={handleFormSuccess}
                dish={editingDish}
            />
        </AdminCard>
    );
}
