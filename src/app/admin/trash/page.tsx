"use client";

import { useState, useEffect, useCallback } from "react";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { Button } from "@/components/ui/button";
import { TableService } from "@/api/tables/table.service";
import { CategoryService } from "@/api/categories/category.service";
import { DishService } from "@/api/menu/menu.service";
import { toast } from "sonner";
import { Table } from "@/model/Table";
import { Category } from "@/model/Category";
import { Dish } from "@/model/Dish";
import { Trash2, RefreshCcw, AlertTriangle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

type TabType = "tables" | "categories" | "dishes";

export default function TrashPage() {
    const [activeTab, setActiveTab] = useState<TabType>("tables");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setData([]);
        try {
            if (activeTab === "tables") {
                const res = await TableService.getTrash();
                setData(res);
            } else if (activeTab === "categories") {
                const res = await CategoryService.getTrash();
                setData(res);
            } else if (activeTab === "dishes") {
                const res = await DishService.getTrash();
                setData(res);
            }
        } catch (error) {
            toast.error("Không thể tải dữ liệu thùng rác");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRestore = async (id: number, name: string) => {
        try {
            if (activeTab === "tables") {
                await TableService.restoreTable(id);
            } else if (activeTab === "categories") {
                await CategoryService.restoreCategory(id);
            } else if (activeTab === "dishes") {
                await DishService.restoreDish(id);
            }
            toast.success(`Đã khôi phục "${name}" thành công`);
            fetchData();
        } catch (error) {
            toast.error("Khôi phục thất bại");
        }
    };

    const handleForceDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            if (activeTab === "tables") {
                await TableService.forceDeleteTable(deleteId);
            } else if (activeTab === "categories") {
                await CategoryService.forceDeleteCategory(deleteId);
            } else if (activeTab === "dishes") {
                await DishService.forceDeleteDish(deleteId);
            }
            toast.success("Đã xóa vĩnh viễn");
            setDeleteId(null);
            fetchData();
        } catch (error) {
            toast.error("Xóa thất bại");
        } finally {
            setIsDeleting(false);
        }
    };

    const tabs: { id: TabType; label: string }[] = [
        { id: "tables", label: "Bàn ăn" },
        { id: "categories", label: "Danh mục món" },
        { id: "dishes", label: "Món ăn" },
    ];

    return (

        <AdminPageLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Thùng rác - Dữ liệu đã xóa</h1>
                    <div className="flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "bg-white dark:bg-[#1E293B] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A3649]"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            }
        >

            <div className="h-full overflow-hidden p-1">
                <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden bg-white dark:bg-[#1f1f1f]">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f]">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            Danh sách {tabs.find(t => t.id === activeTab)?.label} đã xóa
                        </h3>
                    </div>
                    <div className="flex-1 overflow-auto min-h-0">
                        <table className="w-full text-sm text-center">
                            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#252525] border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-medium">ID</th>
                                    {(activeTab === "categories" || activeTab === "dishes") && <th className="px-6 py-4 font-medium">Hình ảnh</th>}
                                    <th className="px-6 py-4 font-medium text-left">Tên</th>
                                    {activeTab === "tables" && <th className="px-6 py-4 font-medium">Sức chứa</th>}
                                    {activeTab === "categories" && <th className="px-6 py-4 font-medium text-left">Mô tả</th>}
                                    {activeTab === "dishes" && <th className="px-6 py-4 font-medium">Danh mục</th>}
                                    {activeTab === "dishes" && <th className="px-6 py-4 font-medium text-left">Mô tả</th>}
                                    {activeTab === "dishes" && <th className="px-6 py-4 font-medium">Giá</th>}
                                    <th className="px-6 py-4 font-medium">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Đang tải dữ liệu...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center opacity-60">
                                                <Trash2 className="w-12 h-12 text-gray-300 mb-2" />
                                                <p>Thùng rác trống</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item) => (
                                        <tr key={item.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                            <td className="px-6 py-4 font-mono text-gray-500 text-xs">#{item.id}</td>

                                            {(activeTab === "categories" || activeTab === "dishes") && (
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-12 mx-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-[#111]">
                                                        {(item as any).image_url ? (
                                                            <img
                                                                src={(item as any).image_url}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                                No img
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            )}

                                            <td className="px-6 py-4 text-left">
                                                <span className="font-semibold text-gray-800 dark:text-gray-100 block">
                                                    {item.name}
                                                </span>
                                            </td>

                                            {activeTab === "tables" && (
                                                <td className="px-6 py-4 text-gray-500">
                                                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200 dark:border-gray-700">
                                                        {(item as Table).capacity} người
                                                    </span>
                                                </td>
                                            )}

                                            {activeTab === "categories" && (
                                                <td className="px-6 py-4 text-gray-500 text-left max-w-[200px]">
                                                    <p className="truncate text-xs" title={(item as Category).description}>
                                                        {(item as Category).description || "-"}
                                                    </p>
                                                </td>
                                            )}

                                            {activeTab === "dishes" && (
                                                <td className="px-6 py-4">
                                                    {(item as Dish).category?.name ? (
                                                        <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                                            {(item as Dish).category?.name}
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium">Đã xóa</span>
                                                    )}
                                                </td>
                                            )}

                                            {activeTab === "dishes" && (
                                                <td className="px-6 py-4 text-gray-500 text-left max-w-[200px]">
                                                    <p className="truncate text-xs" title={(item as Dish).description}>
                                                        {(item as Dish).description || "-"}
                                                    </p>
                                                </td>
                                            )}

                                            {activeTab === "dishes" && (
                                                <td className="px-6 py-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((item as Dish).price || 0)}
                                                </td>
                                            )}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleRestore(item.id, item.name)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border border-transparent hover:border-green-200 dark:hover:border-green-800"
                                                        title="Khôi phục"
                                                    >
                                                        <RefreshCcw className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(item.id)}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-800"
                                                        title="Xóa vĩnh viễn"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </AdminCard>
            </div>

            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Xóa vĩnh viễn?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            Hành động này <span className="font-bold text-red-500">KHÔNG THỂ</span> hoàn tác.
                            Dữ liệu sẽ bị xóa hoàn toàn khỏi hệ thống.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>Hủy</Button>
                        <Button variant="destructive" onClick={handleForceDelete} disabled={isDeleting}>
                            {isDeleting ? "Đang xóa..." : "Xóa vĩnh viễn"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );
}
