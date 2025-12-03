"use client";

import { useState, useMemo, useEffect } from "react";
import { Ingredient } from "@/model/Ingredient";
import { Eye, Pencil, Trash2, PlusCircle, Search, Leaf, Tag, CheckCircle, XCircle, Scale, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { AdminCard, AdminPageHeader, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";
import IngredientFormDialog from "@/components/admin/forms/IngredientFormDialog";
import { IngredientService } from "@/api/ingredients/ingredient.service";

export default function IngredientsManagement() {
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [openViewDialogId, setOpenViewDialogId] = useState<string | null>(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
    const itemsPerPage = 10;



    // Bulk Delete States
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

    const fetchIngredients = async () => {
        try {
            setLoading(true);
            const data = await IngredientService.getIngredients();
            setIngredients(data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách nguyên liệu:", error);
            toast.error("Không thể tải danh sách nguyên liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIngredients();
    }, []);

    const filteredIngredients = useMemo(() => {
        return ingredients.filter((i) => {
            const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filterStatus === "all"
                ? true
                : filterStatus === "active"
                    ? i.active
                    : !i.active;
            return matchesSearch && matchesStatus;
        });
    }, [ingredients, search, filterStatus]);

    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentIngredients = filteredIngredients.slice(startIndex, startIndex + itemsPerPage);

    // Bulk selection helpers
    const isAllSelected = currentIngredients.length > 0 && currentIngredients.every(i => selectedIds.includes(i.id));
    const isSomeSelected = currentIngredients.some(i => selectedIds.includes(i.id)) && !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(selectedIds.filter(id => !currentIngredients.find(i => i.id === id)));
        } else {
            const newIds = [...selectedIds, ...currentIngredients.filter(i => !selectedIds.includes(i.id)).map(i => i.id)];
            setSelectedIds(newIds);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDelete = async () => {
        try {
            await Promise.all(selectedIds.map(id => IngredientService.deleteIngredient(id)));
            toast.success(`Đã xóa ${selectedIds.length} nguyên liệu`);
            setSelectedIds([]);
            setOpenBulkDeleteDialog(false);
            fetchIngredients();
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa nguyên liệu");
        }
    };

    const handleToggleStatus = async (id: string) => {
        const ingredient = ingredients.find((i) => i.id === id);
        if (!ingredient) return;

        try {
            const newStatus = !ingredient.active;
            await IngredientService.updateIngredient(id, { active: newStatus });

            setIngredients((prev) =>
                prev.map((i) => (i.id === id ? { ...i, active: newStatus } : i))
            );

            const statusText = newStatus ? "được kích hoạt" : "đã ngưng sử dụng";
            toast.success(`Nguyên liệu "${ingredient.name}" ${statusText}.`);
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            toast.error("Không thể cập nhật trạng thái");
        }
    };

    const handleAdd = () => {
        setEditingIngredient(null);
        setOpenFormDialog(true);
    };

    const handleEdit = (id: string) => {
        const ingredient = ingredients.find(i => i.id === id);
        if (ingredient) {
            setEditingIngredient(ingredient);
            setOpenFormDialog(true);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await IngredientService.deleteIngredient(id);
            setIngredients((prev) => prev.filter((i) => i.id !== id));
            setOpenDialogId(null);
            toast.success("Đã xóa nguyên liệu thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa nguyên liệu:", error);
            toast.error("Không thể xóa nguyên liệu");
        }
    };


    return (
        <AdminCard>
            {/* 1. Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-blue-500" />
                    Quản lý nguyên liệu
                </h1>
                <div className="flex items-center gap-2">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm nguyên liệu..."
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
                                {filterStatus !== 'all' && (
                                    <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-blue-600" />
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                                <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active">Hiển thị</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="inactive">Đang ẩn</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        onClick={handleAdd}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs"
                    >
                        <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                        Thêm nguyên liệu
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

            {/* Mobile Search */}
            <div className="md:hidden relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm nguyên liệu..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm text-sm"
                />
            </div>

            {/* Table */}
            <AdminCard className="flex flex-col border-none shadow-md p-0 h-full">
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
                                <th className="px-6 py-4">Mã NL</th>
                                <th className="px-6 py-4">Tên nguyên liệu</th>
                                <th className="px-6 py-4">Đơn vị</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">

                            {currentIngredients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                            <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                                                <Leaf className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p>Không tìm thấy nguyên liệu nào.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                currentIngredients.map((i: any) => (
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
                                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{i.name}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{i.unit}</td>
                                        <td className="px-6 py-4">
                                            <Switch
                                                checked={i.active}
                                                onCheckedChange={() => handleToggleStatus(i.id)}
                                                className="mx-auto data-[state=checked]:bg-green-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    disabled={!i.active}
                                                    onClick={() => setOpenViewDialogId(i.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    disabled={!i.active}
                                                    onClick={() => handleEdit(i.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all disabled:opacity-50"
                                                    title="Sửa"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <Dialog
                                                    open={openDialogId === i.id}
                                                    onOpenChange={(open) =>
                                                        setOpenDialogId(open ? i.id : null)
                                                    }
                                                >
                                                    <DialogTrigger asChild>
                                                        <button
                                                            disabled={!i.active}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                                                            title="Xóa"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-red-500 text-lg">
                                                                Xóa nguyên liệu {i.name}?
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <DialogFooter className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => setOpenDialogId(null)}
                                                            >
                                                                Hủy
                                                            </Button>
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDelete(i.id)}
                                                            >
                                                                Xóa
                                                            </Button>
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
            </AdminCard>

            {/* View Dialog */}
            <Dialog open={!!openViewDialogId} onOpenChange={(o) => !o && setOpenViewDialogId(null)}>
                <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
                    {(() => {
                        const activeIng: any = ingredients.find((i: any) => i.id === openViewDialogId);
                        if (!activeIng) return null;
                        return (
                            <>
                                <div className="relative px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <Leaf className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết nguyên liệu</DialogTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Mã ID: <span className="font-mono">#{activeIng.id}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                                        {/* Cột ảnh minh họa */}
                                        <div className="flex flex-col gap-3 h-full">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mô phỏng</label>
                                            <div className="relative w-full h-full min-h-[250px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-black/20 flex flex-col items-center justify-center gap-4">
                                                <div className={`p-8 rounded-full ${activeIng.active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    <Leaf className="w-24 h-24" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-500">
                                                    {activeIng.name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cột thông tin */}
                                        <div className="flex flex-col space-y-5">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 block">Thông tin nguyên liệu</label>
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{activeIng.name}</h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${activeIng.active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                                        {activeIng.active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                        {activeIng.active ? "Hiển thị" : "Đang ẩn"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                                            <Scale className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Đơn vị tính</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{activeIng.unit}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                                            <Tag className="w-4 h-4 text-purple-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Mã nguyên liệu</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{activeIng.id}</p>
                                                        </div>
                                                    </div>
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

            {/* Bulk Delete Dialog */}
            <Dialog open={openBulkDeleteDialog} onOpenChange={setOpenBulkDeleteDialog}>
                <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg">
                            Xóa {selectedIds.length} nguyên liệu?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa {selectedIds.length} nguyên liệu đã chọn? Hành động này không thể hoàn tác.
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


            {/* Ingredient Form Dialog */}
            <IngredientFormDialog
                open={openFormDialog}
                onOpenChange={setOpenFormDialog}
                onSuccess={fetchIngredients}
                ingredient={editingIngredient}
            />
        </AdminCard >
    );
}
