"use client";

import { useState, useEffect } from "react";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import { Pencil, Trash2, Eye, PlusCircle, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";
import { AdminNewsService } from "@/api/news/admin-news.service";
import { News } from "@/model/News";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import NewsFormDialog from "@/components/admin/forms/NewsFormDialog";

export default function NewsManagement() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            setLoading(true);
            const data = await AdminNewsService.getAll();
            setNews(data.data || []);
        } catch (error) {
            console.error("Lỗi khi tải tin tức:", error);
            toast.error("Không thể tải danh sách tin tức");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingNews(null);
        setOpenFormDialog(true);
    };

    const handleEdit = (id: number) => {
        const item = news.find((n) => n.id === id);
        if (item) {
            setEditingNews(item);
            setOpenFormDialog(true);
        }
    };

    const handleFormSuccess = async () => {
        setOpenFormDialog(false);
        setEditingNews(null);
        loadNews();
    };

    const handleDelete = async (id: number) => {
        const item = news.find((n) => n.id === id);
        const itemTitle = item?.title || "tin tức";

        try {
            await AdminNewsService.delete(id);
            setNews((prev) => prev.filter((n) => n.id !== id));
            setOpenDialogId(null);
            toast.success(`Đã xóa "${itemTitle}" thành công!`);
        } catch (error) {
            console.error("Lỗi khi xóa tin tức:", error);
            toast.error("Không thể xóa tin tức");
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
        } catch {
            return dateString;
        }
    };

    const isAllSelected = news.length > 0 && news.every(n => selectedIds.includes(n.id));
    const isSomeSelected = news.some(n => selectedIds.includes(n.id)) && !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(news.map(n => n.id));
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
            await Promise.all(selectedIds.map(id => AdminNewsService.delete(id)));
            toast.success(`Đã xóa ${selectedIds.length} tin tức`);
            setSelectedIds([]);
            setOpenBulkDeleteDialog(false);
            await loadNews();
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa tin tức");
        }
    };

    return (
        <AdminPageLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <Newspaper className="w-5 h-5 text-blue-500" />
                        Quản lý tin tức
                    </h1>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleAdd}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs"
                        >
                            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                            Thêm tin tức
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
            <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden">
                {loading ? (
                    <AdminLoading message="Đang tải danh sách tin tức..." />
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
                                        <th className="px-6 py-4 text-left">Tiêu đề</th>
                                        <th className="px-6 py-4">Lượt xem</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Ngày tạo</th>
                                        <th className="px-6 py-4">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                                    {news.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                                                        <Newspaper className="w-8 h-8 opacity-50" />
                                                    </div>
                                                    <p>Chưa có tin tức nào</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        news.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                            >
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(item.id)}
                                                        onChange={() => handleSelectOne(item.id)}
                                                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-mono text-gray-500">{item.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="w-20 h-14 mx-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-gray-50 dark:bg-[#111]">
                                                        {item.image ? (
                                                            <img
                                                                src={item.image}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                                <Newspaper className="w-6 h-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    <div className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {item.slug}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                    {item.views.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${item.is_active
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                            }`}
                                                    >
                                                        {item.is_active ? "Hiển thị" : "Ẩn"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-xs">
                                                    {formatDate(item.created_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => toast.info("Chức năng đang phát triển")}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleEdit(item.id)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                                                            title="Sửa"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <Dialog
                                                            open={openDialogId === item.id.toString()}
                                                            onOpenChange={(open) =>
                                                                setOpenDialogId(open ? item.id.toString() : null)
                                                            }
                                                        >
                                                            <DialogTrigger asChild>
                                                                <button
                                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                                    title="Xóa"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </DialogTrigger>
                                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-red-500 text-lg">
                                                                        Xóa tin tức {item.title}?
                                                                    </DialogTitle>
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                                        Dữ liệu sẽ được chuyển vào thùng rác.
                                                                    </div>
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
                                                                        onClick={() => handleDelete(item.id)}
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
                    </>
                )}
            </AdminCard>

            <NewsFormDialog
                open={openFormDialog}
                onOpenChange={setOpenFormDialog}
                onSuccess={handleFormSuccess}
                newsToEdit={editingNews}
            />

            <Dialog open={openBulkDeleteDialog} onOpenChange={setOpenBulkDeleteDialog}>
                <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg">
                            Xóa {selectedIds.length} tin tức?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa {selectedIds.length} tin tức đã chọn? Dữ liệu sẽ được chuyển vào thùng rác.
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

