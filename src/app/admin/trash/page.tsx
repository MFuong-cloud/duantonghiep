"use client";

import { useState, useEffect, useCallback } from "react";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { Button } from "@/components/ui/button";
import { TableService } from "@/api/tables/table.service";
import { CategoryService } from "@/api/categories/category.service";
import { DishService } from "@/api/menu/menu.service";
import { UserService } from "@/api/users/user.service";
import { AdminNewsService } from "@/api/news/news.service";
import { toast } from "sonner";
import { Table } from "@/model/Table";
import { Category } from "@/model/Category";
import { Dish } from "@/model/Dish";
import { User } from "@/model/User";
import { News } from "@/model/News";
import { Trash2, RefreshCcw, AlertTriangle, Newspaper } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

type TabType = "tables" | "categories" | "dishes" | "users" | "news";

export default function TrashPage() {
    const [activeTab, setActiveTab] = useState<TabType>("tables");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<(Table | Category | Dish | User | News)[]>([]);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Bulk selection
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setData([]);
        setSelectedIds([]); // Reset selection
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
            } else if (activeTab === "users") {
                const res = await UserService.getTrash();
                setData(res);
            } else if (activeTab === "news") {
                const res = await AdminNewsService.getTrash();
                // AdminNewsService.getTrash returns pagination object, simplify for trash view or handle pagination later
                // For now, assuming we just show the first page or all if API allows
                setData(res.data || []);
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

    const getItemName = (item: Table | Category | Dish | User | News) => {
        if ('name' in item) return item.name;
        if ('title' in item) return item.title; // For News
        return `Item #${item.id}`;
    };

    const handleRestore = async (id: number, name: string) => {
        try {
            if (activeTab === "tables") {
                await TableService.restoreTable(id);
            } else if (activeTab === "categories") {
                await CategoryService.restoreCategory(id);
            } else if (activeTab === "dishes") {
                await DishService.restoreDish(id);
            } else if (activeTab === "users") {
                await UserService.restore(id);
            } else if (activeTab === "news") {
                await AdminNewsService.restore(id);
            }
            toast.success(`Đã khôi phục "${name}" thành công`);
            fetchData();
        } catch {
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
            } else if (activeTab === "users") {
                await UserService.forceDelete(deleteId);
            } else if (activeTab === "news") {
                await AdminNewsService.forceDelete(deleteId);
            }
            toast.success("Đã xóa vĩnh viễn");
            setDeleteId(null);
            fetchData();
        } catch {
            toast.error("Xóa thất bại");
        } finally {
            setIsDeleting(false);
        }
    };

    // Bulk selection handlers
    const handleSelectAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map(item => item.id));
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        setIsDeleting(true);
        try {
            for (const id of selectedIds) {
                if (activeTab === "tables") {
                    await TableService.forceDeleteTable(id);
                } else if (activeTab === "categories") {
                    await CategoryService.forceDeleteCategory(id);
                } else if (activeTab === "dishes") {
                    await DishService.forceDeleteDish(id);
                } else if (activeTab === "users") {
                    await UserService.forceDelete(id);
                } else if (activeTab === "news") {
                    await AdminNewsService.forceDelete(id);
                }
            }
            toast.success(`Đã xóa vĩnh viễn ${selectedIds.length} mục`);
            setShowBulkDeleteDialog(false);
            setSelectedIds([]);
            fetchData();
        } catch {
            toast.error("Xóa thất bại");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkRestore = async () => {
        if (selectedIds.length === 0) return;
        setIsDeleting(true);
        try {
            for (const id of selectedIds) {
                if (activeTab === "tables") {
                    await TableService.restoreTable(id);
                } else if (activeTab === "categories") {
                    await CategoryService.restoreCategory(id);
                } else if (activeTab === "dishes") {
                    await DishService.restoreDish(id);
                } else if (activeTab === "users") {
                    await UserService.restore(id);
                } else if (activeTab === "news") {
                    await AdminNewsService.restore(id);
                }
            }
            toast.success(`Đã khôi phục ${selectedIds.length} mục`);
            setSelectedIds([]);
            fetchData();
        } catch {
            toast.error("Khôi phục thất bại");
        } finally {
            setIsDeleting(false);
        }
    };

    const tabs: { id: TabType; label: string }[] = [
        { id: "tables", label: "Bàn ăn" },
        { id: "categories", label: "Danh mục món" },
        { id: "dishes", label: "Món ăn" },
        { id: "users", label: "Người dùng" },
        { id: "news", label: "Tin tức" }, // Added News tab
    ];

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return "/images/placeholder.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        if (imagePath.startsWith("storage/")) {
            return `http://127.0.0.1:8000/${imagePath}`;
        }
        const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage";
        return `${baseUrl}/${imagePath}`;
    };

    return (
        <AdminPageLayout
            header={
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Thùng rác - Dữ liệu đã xóa</h1>
                    <div className="flex gap-2 flex-wrap">
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
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] flex items-center justify-between">
                        <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            <Trash2 className="w-5 h-5 text-red-500" />
                            Danh sách {tabs.find(t => t.id === activeTab)?.label} đã xóa
                        </h3>
                        {selectedIds.length > 0 && (
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Đã chọn: <strong className="text-blue-600 dark:text-blue-400">{selectedIds.length}</strong>
                                </span>
                                <Button
                                    onClick={handleBulkRestore}
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                    disabled={isDeleting}
                                >
                                    <RefreshCcw className="w-4 h-4" />
                                    Khôi phục đã chọn
                                </Button>
                                <Button
                                    onClick={() => setShowBulkDeleteDialog(true)}
                                    variant="destructive"
                                    size="sm"
                                    className="gap-2"
                                    disabled={isDeleting}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Xóa đã chọn
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="flex-1 overflow-auto min-h-0">
                        <table className="w-full text-sm text-center">
                            <thead className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 text-xs uppercase text-gray-900 dark:text-white font-bold tracking-wider shadow-sm">
                                <tr>
                                    <th className="px-4 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === data.length && data.length > 0}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                        />
                                    </th>
                                    <th className="px-6 py-4 font-medium">ID</th>
                                    {(activeTab === "categories" || activeTab === "dishes" || activeTab === "users" || activeTab === "news") && <th className="px-6 py-4 font-medium">Hình ảnh</th>}
                                    <th className="px-6 py-4 font-medium">Tên / Tiêu đề</th>
                                    {activeTab === "tables" && <th className="px-6 py-4 font-medium">Sức chứa</th>}
                                    {activeTab === "categories" && <th className="px-6 py-4 font-medium">Mô tả</th>}
                                    {activeTab === "dishes" && <th className="px-6 py-4 font-medium">Danh mục</th>}
                                    {activeTab === "dishes" && <th className="px-6 py-4 font-medium">Mô tả</th>}
                                    {activeTab === "dishes" && <th className="px-6 py-4 font-medium">Giá</th>}
                                    {activeTab === "users" && <th className="px-6 py-4 font-medium">Số điện thoại</th>}
                                    {activeTab === "users" && <th className="px-6 py-4 font-medium">Email</th>}
                                    {activeTab === "users" && <th className="px-6 py-4 font-medium">Vai trò</th>}
                                    {activeTab === "news" && <th className="px-6 py-4 font-medium">Lượt xem</th>}
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
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(item.id)}
                                                    onChange={() => handleSelectItem(item.id)}
                                                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-6 py-4 font-mono text-gray-500 text-xs">#{item.id}</td>

                                            {(activeTab === "categories" || activeTab === "dishes" || activeTab === "users" || activeTab === "news") && (
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-12 mx-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-[#111]">
                                                        {activeTab === "users" ? (
                                                            'avatar_url' in item && item.avatar_url ? (
                                                                <img
                                                                    src={item.avatar_url}
                                                                    alt={getItemName(item)}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 font-semibold">
                                                                    {getItemName(item).charAt(0).toUpperCase()}
                                                                </div>
                                                            )
                                                        ) : activeTab === "news" ? (
                                                            'image' in item && item.image ? (
                                                                <img
                                                                    src={getImageUrl(item.image)}
                                                                    alt={item.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                                    <Newspaper className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                            )
                                                        ) : (
                                                            'image_url' in item && item.image_url ? (
                                                                <img
                                                                    src={item.image_url}
                                                                    alt={getItemName(item)}
                                                                    className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                                                    No img
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </td>
                                            )}

                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-gray-800 dark:text-gray-100 block line-clamp-2">
                                                    {getItemName(item)}
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
                                                <td className="px-6 py-4 text-gray-500">
                                                    <p className="truncate text-xs max-w-[200px] mx-auto" title={(item as Category).description}>
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
                                                <td className="px-6 py-4 text-gray-500">
                                                    <p className="truncate text-xs max-w-[200px] mx-auto" title={(item as Dish).description}>
                                                        {(item as Dish).description || "-"}
                                                    </p>
                                                </td>
                                            )}

                                            {activeTab === "dishes" && (
                                                <td className="px-6 py-4 font-mono font-medium text-blue-600 dark:text-blue-400">
                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((item as Dish).price || 0)}
                                                </td>
                                            )}

                                            {activeTab === "users" && (
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                    {(item as User).phone || "-"}
                                                </td>
                                            )}

                                            {activeTab === "users" && (
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                    {(item as User).email || "-"}
                                                </td>
                                            )}

                                            {activeTab === "users" && (
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${(item as User).role === 'owner' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                                                        (item as User).role === 'manager' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                                                            (item as User).role === 'employee' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                                                'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                                                        }`}>
                                                        {(item as User).role === 'owner' && 'Chủ cửa hàng'}
                                                        {(item as User).role === 'manager' && 'Quản lý'}
                                                        {(item as User).role === 'employee' && 'Nhân viên'}
                                                        {(item as User).role === 'customer' && 'Khách hàng'}
                                                    </span>
                                                </td>
                                            )}

                                            {activeTab === "news" && (
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                                    {(item as News).views}
                                                </td>
                                            )}

                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleRestore(item.id, getItemName(item))}
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

            {/* Bulk Delete Dialog */}
            <Dialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            Xóa vĩnh viễn {selectedIds.length} mục?
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600 dark:text-gray-300">
                            Bạn đang chuẩn bị xóa vĩnh viễn <span className="font-bold text-red-500">{selectedIds.length}</span> mục.
                            Hành động này <span className="font-bold text-red-500">KHÔNG THỂ</span> hoàn tác.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBulkDeleteDialog(false)} disabled={isDeleting}>Hủy</Button>
                        <Button variant="destructive" onClick={handleBulkDelete} disabled={isDeleting}>
                            {isDeleting ? "Đang xóa..." : `Xóa ${selectedIds.length} mục`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPageLayout>
    );
}
