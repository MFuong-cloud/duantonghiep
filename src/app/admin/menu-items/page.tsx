"use client";

import { useState, useMemo, useEffect } from "react";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import { Pencil, Trash2, Eye, PlusCircle, Search, Tag, CheckCircle, XCircle, Filter, UtensilsCrossed, Type, DollarSign, AlignLeft, Image as ImageIcon } from "lucide-react";
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

    const itemsPerPage = 10;

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
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
                setLoading(false);
            }
        };
        loadData();
    }, []);
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
            // Sắp xếp theo ID giảm dần để hiển thị mới nhất trước
            const sortedDishes = dishesData.sort((a, b) => b.id - a.id);
            setItems(sortedDishes);
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
                                <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => { setFilterStatus(v as any); setCurrentPage(1); }}>
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
                        <Button
                            onClick={handleAdd}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs"
                        >
                            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                            Thêm món
                        </Button>
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
                                <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#252525] border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-4 py-4 w-12">
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
                                                <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
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

            <Dialog open={!!openViewDialogId} onOpenChange={(o) => !o && setOpenViewDialogId(null)}>
                <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
                    {(() => {
                        const activeItem = items.find(i => i.id === openViewDialogId);
                        if (!activeItem) return null;
                        return (
                            <>
                                <div className="relative px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết món ăn</DialogTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Mã ID: <span className="font-mono">#{activeItem.id}</span></p>
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
                                                {activeItem.image_urls && activeItem.image_urls.length > 0 ? (
                                                    <div className="grid grid-cols-2 gap-2 p-2 overflow-y-auto h-full max-h-[480px]">
                                                        {activeItem.image_urls.map((img, idx) => (
                                                            <img key={idx} src={img} alt={`${activeItem.name} ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                                        ))}
                                                    </div>
                                                ) : (activeItem.images && activeItem.images.length > 0) ? (
                                                    <div className="grid grid-cols-2 gap-2 p-2 overflow-y-auto h-full max-h-[480px]">
                                                        {activeItem.images.map((img, idx) => (
                                                            <img key={idx} src={img} alt={`${activeItem.name} ${idx + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                                                        ))}
                                                    </div>
                                                ) : getImageSrc(activeItem) ? (
                                                    <img
                                                        src={getImageSrc(activeItem)!}
                                                        alt={activeItem.name}
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
                                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{activeItem.name}</h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border shrink-0 ${activeItem.status !== false ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800" : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"}`}>
                                                        {activeItem.status !== false ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                        {activeItem.status !== false ? "Đang bán" : "Ngưng bán"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <Tag className="w-4 h-4" />
                                                    <span>Danh mục: <span className="font-semibold text-gray-900 dark:text-gray-100">{getCategoryName(activeItem.category_id)}</span></span>
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
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(activeItem.price || 0).replace(',00', '')}
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
                                                    {activeItem.description || "Chưa có mô tả."}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                    <Button onClick={() => setOpenViewDialogId(null)}>Đóng</Button>
                                </div>
                            </>
                        );
                    })()}
                </DialogContent>
            </Dialog>

            <Dialog open={openBulkDeleteDialog} onOpenChange={setOpenBulkDeleteDialog}>
                <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg">
                            Xóa {selectedIds.length} món ăn?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa {selectedIds.length} món ăn đã chọn? Hành động này không thể hoàn tác.
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



