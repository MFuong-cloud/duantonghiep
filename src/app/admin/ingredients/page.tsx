"use client";

import { useState, useMemo, useEffect } from "react";
import { Ingredient } from "@/model/Ingredient";
import { Eye, Pencil, Trash2, PlusCircle, Search, Leaf, Tag, CheckCircle, XCircle, Scale } from "lucide-react";
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
import { Pagination } from "@/components/admin/pagination/Pagination";
import { AdminCard, AdminPageHeader, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

export default function IngredientsManagement() {
    const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("ingredientsData");
            return saved
                ? JSON.parse(saved)
                : [
                    { id: "NL001", name: "Thịt bò", unit: "Kg", active: true },
                    { id: "NL002", name: "Hành lá", unit: "Gram", active: true },
                    { id: "NL003", name: "Ớt tươi", unit: "Trái", active: false },
                ];
        }
        return [];
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [openViewDialogId, setOpenViewDialogId] = useState<string | null>(null);
    const itemsPerPage = 8;

    useEffect(() => {
        localStorage.setItem("ingredientsData", JSON.stringify(ingredients));
    }, [ingredients]);

    const filteredIngredients = useMemo(() => {
        return ingredients.filter((i) =>
            i.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [ingredients, search]);

    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentIngredients = filteredIngredients.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleToggleStatus = (id: string) => {
        setIngredients((prev) =>
            prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i))
        );

        const ing = ingredients.find((i) => i.id === id);
        if (ing) {
            const newStatus = ing.active ? "Ẩn" : "Hiển thị";
            toast.success(`Nguyên liệu "${ing.name}" đã chuyển sang ${newStatus}.`);
        }
    };

    const handleAdd = () => toast.info("Form thêm nguyên liệu sắp có 🚀");
    const handleEdit = (id: string) =>
        toast.info(`Sửa nguyên liệu ${id} đang được phát triển ✏️`);
    const handleDelete = (id: string) => {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
        setOpenDialogId(null);
        toast.success("Đã xóa nguyên liệu thành công!");
    };

    return (
        <AdminCard>
            {/* 1. Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Leaf className="w-6 h-6 text-blue-500" />
                        Quản lý nguyên liệu
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Theo dõi kho nguyên liệu, cập nhật trạng thái để phối hợp bếp và mua hàng.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm nguyên liệu..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                            className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
                        />
                    </div>
                    <Button
                        onClick={handleAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all"
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Thêm nguyên liệu
                    </Button>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm nguyên liệu..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm"
                />
            </div>

            {/* Table */}
            <AdminCard className="overflow-hidden border-none shadow-md p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-gray-50 dark:bg-[#252525] border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                            <tr>
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
                                    <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                        Không có nguyên liệu nào
                                    </td>
                                </tr>
                            ) : (
                                currentIngredients.map((i: any) => (
                                    <tr
                                        key={i.id}
                                        className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                    >
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
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1f1f1f]">
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
        </AdminCard>
    );
}
