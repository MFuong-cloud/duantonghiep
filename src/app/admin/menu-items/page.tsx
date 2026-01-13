"use client";

import { useState, useMemo, useEffect } from "react";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import { Pencil, Trash2, Eye, PlusCircle, Search, Filter, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/admin/pagination/Pagination";
import DishFormDialog from "@/components/admin/forms/DishFormDialog";
import { DishService } from "@/api/menu/menu.service";
import { CategoryService } from "@/api/categories/category.service";
import { Dish } from "@/model/Dish";
import { Category } from "@/model/Category";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { getValidImageUrl } from "@/lib/utils";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";
import DishDetailDialog from "@/components/admin/dialogs/DishDetailDialog";
import { useAdminBroadcast, useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export default function MenuItemsManagement() {
    const [items, setItems] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [filterCategory, setFilterCategory] = useState<number | "all">("all");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingDish, setEditingDish] = useState<Dish | null>(null);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

    // Socket.IO Broadcast Hook
    const { updateMenu, createResource, deleteResource } = useAdminBroadcast({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        token: 'admin-token-placeholder',
        userId: 'admin-1',
    });

    const itemsPerPage = 10;

    const fetchData = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const [dishesData, categoriesData] = await Promise.all([
                DishService.getDishes(),
                CategoryService.getCategories(),
            ]);
            const sortedDishes = dishesData.sort((a, b) => b.id - a.id);
            setItems(sortedDishes);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            toast.error("Không thể tải dữ liệu món ăn");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Realtime Updates Listener
    useRealtimeUpdates({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        role: 'admin',
        onMenuUpdate: () => fetchData(false) // Reload data silently
    });
    const filteredItems = useMemo(() => {
        return items.filter((i) => {
            const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = filterCategory === "all" ? true : i.category_id === filterCategory;
            const matchesStatus = filterStatus === "all"
                ? true
                : filterStatus === "active"
                    ? i.status !== false
                    : i.status === false;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [items, search, filterCategory, filterStatus]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const isAllSelected = currentItems.length > 0 && currentItems.every(i => selectedIds.includes(i.id));
    const isSomeSelected = currentItems.some(i => selectedIds.includes(i.id)) && !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(selectedIds.filter(id => !currentItems.find(i => i.id === id)));
        } else {
            const newIds = [...selectedIds, ...currentItems.filter(i => !selectedIds.includes(i.id)).map(i => i.id)];
            setSelectedIds(newIds);
        }
    };

    const handleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedIds.map(id => DishService.deleteDish(id)));

            // Broadcast deletes
            selectedIds.forEach(id => deleteResource('menu', id));

            toast.success(`Đã xóa ${selectedIds.length} món ăn`);
            setSelectedIds([]);
            setOpenBulkDeleteDialog(false);
            const dishesData = await DishService.getDishes();
            setItems(dishesData);
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa món ăn");
        }
    };

    const getCategoryName = (categoryId: number): string => {
        const cat = categories.find((c) => c.id === categoryId);
        return cat?.name || "Chưa phân loại";
    };


    const handleToggleStatus = async (id: number) => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        try {
            const currentStatus = item.status !== false;
            const newStatus = !currentStatus;

            await DishService.updateDish(id, { status: newStatus });

            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
            );

            // Broadcast update
            updateMenu({
                menuId: id,
                ...item,
                status: newStatus,
                action: 'updated'
            });

            toast.success(`Món "${item.name}" đã chuyển sang ${newStatus ? "Còn hàng" : "Hết hàng"}.`);
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
        const item = items.find((i) => i.id === id);
        const itemName = item?.name || "món ăn";

        try {
            await DishService.deleteDish(id);
            setItems((prev) => prev.filter((i) => i.id !== id));
            setOpenDialogId(null);

            // Broadcast delete
            deleteResource('menu', id);

            toast.success(`Đã xóa món "${itemName}" thành công!`);
        } catch (error) {
            console.error("Lỗi khi xóa món:", error);
            const message = error instanceof Error ? error.message : "Không thể xóa món ăn";
            toast.error(message);
        }
    };

    const handleFormSuccess = async () => {
        try {
            const dishesData = await DishService.getDishes();
            const sortedDishes = dishesData.sort((a, b) => b.id - a.id);
            setItems(sortedDishes);

            // Vì chúng ta không biết chính xác item nào vừa được thêm/sửa từ hàm này (do hạn chế của hàm handleSuccess hiện tại),
            // chúng ta sẽ gửi một event 'menu:refetch' để yêu cầu client fetch lại toàn bộ menu
            // Hoặc tốt hơn, chúng ta nên sửa DishFormDialog để trả về item. 
            // KHẮC PHỤC TẠM: Gửi event create/update với item mới nhất (vì id giảm dần)
            if (sortedDishes.length > 0) {
                // Nếu là edit (editingDish != null), ta broadcast update
                if (editingDish) {
                    const updatedItem = sortedDishes.find(d => d.id === editingDish.id);
                    if (updatedItem) {
                        updateMenu({ menuId: updatedItem.id, ...updatedItem });
                    }
                } else {
                    // Nếu là add mới, item mới nhất là item đầu tiên (do sort b.id - a.id)
                    const newItem = sortedDishes[0];
                    createResource('menu', newItem);
                }
            }

        } catch (error) {
            console.error("Lỗi khi tải lại dữ liệu:", error);
        }
    };

    return (
        <AdminPageLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5 text-blue-500" />
                        Quản lý món ăn
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm món ăn..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-48"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 h-8 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline text-xs">Lọc</span>
                                    {(filterCategory !== 'all' || filterStatus !== 'all') && (
                                        <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-blue-600" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => { setFilterStatus(v as "all" | "active" | "inactive"); setCurrentPage(1); }}>
                                    <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="active">Đang bán</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="inactive">Ngưng bán</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>Danh mục</DropdownMenuLabel>
                                <DropdownMenuRadioGroup value={filterCategory.toString()} onValueChange={(v) => { setFilterCategory(v === "all" ? "all" : parseInt(v)); setCurrentPage(1); }}>
                                    <DropdownMenuRadioItem value="all">Tất cả danh mục</DropdownMenuRadioItem>
                                    {categories.map((c) => (
                                        <DropdownMenuRadioItem key={c.id} value={c.id.toString()}>
                                            {c.name}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={handleAdd}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs"
                        >
                            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                            Thêm món
                        </Button>
                        {selectedIds.length > 0 && (
                            <Button
                                onClick={() => setOpenBulkDeleteDialog(true)}
                                size="sm"
                                variant="destructive"
                                className="h-8 text-xs"
                            >
                                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                Xóa ({selectedIds.length})
                            </Button>
                        )}
                    </div>
                </div>
            }
        >
            <div className="md:hidden relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm món ăn..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm text-sm"
                />
            </div>

            <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden">
                {loading ? (
                    <AdminLoading message="Đang tải danh sách món ăn..." />
                ) : (
                    <>
                        <div className="flex-1 overflow-auto min-h-0">
                            <table className="w-full text-sm text-center">
                                <thead className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 text-xs uppercase text-gray-900 dark:text-white font-bold tracking-wider shadow-sm">
                                    <tr>
                                        <th className="px-6 py-4 w-12">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Hình ảnh</th>
                                        <th className="px-6 py-4">Tên món</th>
                                        <th className="px-6 py-4">Danh mục</th>
                                        <th className="px-6 py-4">Giá bán</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                                    {currentItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                                                        <UtensilsCrossed className="w-8 h-8 opacity-50" />
                                                    </div>
                                                    <p>Không có món ăn nào</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentItems.map((i) => (
                                            <tr
                                                key={i.id}
                                                className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                            >
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(i.id)}
                                                        onChange={() => handleSelectOne(i.id)}
                                                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-mono text-gray-500">{i.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-12 mx-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-[#111]">
                                                        <img
                                                            src={getValidImageUrl(i)}
                                                            alt={i.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{i.name}</td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                                                        {getCategoryName(i.category_id)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(i.price || 0).replace(',00', '')}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Switch
                                                        checked={i.status !== false}
                                                        onCheckedChange={() => handleToggleStatus(i.id)}
                                                        className="mx-auto data-[state=checked]:bg-green-500"
                                                    />
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setOpenViewDialogId(i.id)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleEdit(i.id)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                                                            title="Sửa"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <Dialog open={openDialogId === i.id.toString()} onOpenChange={(open) => setOpenDialogId(open ? i.id.toString() : null)}>
                                                            <DialogTrigger asChild>
                                                                <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Xóa">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </DialogTrigger>
                                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-red-500 text-lg">Xóa món {i.name}?</DialogTitle>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Dữ liệu sẽ được chuyển vào thùng rác.</div>
                                                                </DialogHeader>
                                                                <DialogFooter className="flex justify-end gap-2">
                                                                    <Button variant="outline" onClick={() => setOpenDialogId(null)}>Hủy</Button>
                                                                    <Button variant="destructive" onClick={() => handleDelete(i.id)}>Xóa</Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1f1f1f]">
                            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    </>
                )}
            </AdminCard>

            <DishFormDialog
                open={openFormDialog}
                onOpenChange={setOpenFormDialog}
                onSuccess={handleFormSuccess}
                dish={editingDish}
            />

            <DishDetailDialog
                open={!!openViewDialogId}
                onOpenChange={(open) => !open && setOpenViewDialogId(null)}
                dish={items.find(i => i.id === openViewDialogId)}
                categories={categories}
            />

            <Dialog open={openBulkDeleteDialog} onOpenChange={setOpenBulkDeleteDialog}>
                <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg">
                            Xóa {selectedIds.length} món ăn?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa {selectedIds.length} món ăn đã chọn? Dữ liệu sẽ được chuyển vào thùng rác.
                    </p>
                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setOpenBulkDeleteDialog(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleBulkDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );

}



