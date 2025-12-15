"use client";

import { useState, useMemo, useEffect } from "react";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  LayoutGrid,
  Filter,
  Eye,
  Tag
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/pagination/Pagination";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryService } from "@/api/categories/category.service";
import { Category } from "@/model/Category";
import { cn } from "@/lib/utils";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";
import CategoryDetailDialog from "@/components/admin/dialogs/CategoryDetailDialog";
import CategoryFormDialog from "@/components/admin/forms/CategoryFormDialog";

const EMPTY_FORM = {
  name: "",
  description: "",
  image: "",
  status: true,
};

const ITEMS_PER_PAGE = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MenuCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
  const [openDeleteDialogId, setOpenDeleteDialogId] = useState<number | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loadingStatusId, setLoadingStatusId] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

  const getImageUrl = (img?: string | null) => {
    if (!img) return "/image/food/food.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/storage")) return `${API_BASE}${img}`;
    return `${API_BASE}/storage/${img}`;
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getCategories();
      const sortedData = [...data].sort((a: Category, b: Category) => b.id - a.id);
      setCategories(sortedData.map((c: Category) => ({
        ...c,
        description: c.description || ""
      })));
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(
    () => categories.filter(c => {
      const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all"
        ? true
        : filterStatus === "active"
          ? c.status
          : !c.status;
      return matchesSearch && matchesStatus;
    }),
    [categories, search, filterStatus]
  );

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const isAllSelected = currentCategories.length > 0 && currentCategories.every(c => selectedIds.includes(c.id));
  const isSomeSelected = currentCategories.some(c => selectedIds.includes(c.id)) && !isAllSelected;

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(selectedIds.filter(id => !currentCategories.find(c => c.id === id)));
    } else {
      const newIds = [...selectedIds, ...currentCategories.filter(c => !selectedIds.includes(c.id)).map(c => c.id)];
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
      await Promise.all(selectedIds.map(id => CategoryService.deleteCategory(id)));
      toast.success(`Đã xóa ${selectedIds.length} danh mục`);
      setSelectedIds([]);
      setOpenBulkDeleteDialog(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa danh mục");
    }
  };

  const handleToggleStatus = async (id: number, checkedParam?: boolean) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const newStatus = typeof checkedParam === "boolean" ? checkedParam : !cat.status;
    setLoadingStatusId(id);

    try {
      const fd = new FormData();
      fd.append("name", cat.name || "");
      fd.append("description", cat.description || "");
      fd.append("status", newStatus ? "1" : "0");
      fd.append("_method", "PUT");

      const res = await fetch(`${API_BASE}/api/categories/${id}`, {
        method: "POST",
        body: fd
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Toggle Status Error:", errorData);
        throw new Error(errorData.message || "Không thể cập nhật trạng thái");
      }

      setCategories(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));

      if (newStatus) {
        toast.success(`Đã hiển thị danh mục "${cat.name}"`);
      } else {
        toast.success(`Đã ẩn danh mục "${cat.name}" và tất cả món ăn thuộc danh mục này`);
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message: string }).message
        : "Không thể cập nhật trạng thái";
      toast.error(errorMessage);
    } finally {
      setLoadingStatusId(null);
    }
  };

  const handleDelete = async (id: number) => {
    const category = categories.find(c => c.id === id);
    const categoryName = category?.name || "danh mục";

    try {
      await CategoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      setOpenDeleteDialogId(null);
      toast.success(`Đã xóa danh mục "${categoryName}" thành công!`);
    } catch (error) {
      toast.error("Không thể xóa danh mục");
    }
  };

  const handleOpenForm = (category?: Category) => {
    setEditingCategory(category || null);
    setOpenFormDialog(true);
  };

  const handleFormSuccess = () => {
    fetchCategories();
  };

  return (
    <AdminPageLayout
      header={
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-blue-500" />
            Quản lý danh mục
          </h1>
          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={e => setSearch(e.target.value)}
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
                  <DropdownMenuRadioItem value="active">Đang hoạt động</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="inactive">Đang ẩn</DropdownMenuRadioItem>
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
              onClick={() => handleOpenForm()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Thêm mới
            </Button>
          </div>
        </div>
      }
    >

      <div className="md:hidden relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm danh mục..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm text-sm"
        />
      </div>

      <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden">
        {loading && categories.length === 0 ? (
          <AdminLoading message="Đang tải danh sách danh mục..." />
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
                    <th className="px-6 py-4">Tên danh mục</th>
                    <th className="px-6 py-4 hidden md:table-cell">Mô tả</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                  {currentCategories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                            <Tag className="w-8 h-8 opacity-50" />
                          </div>
                          <p>Không tìm thấy danh mục nào.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentCategories.map((cat) => (
                      <tr key={cat.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200">
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(cat.id)}
                            onChange={() => handleSelectOne(cat.id)}
                            className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                          />
                        </td>

                        <td className="px-6 py-4 font-mono text-gray-500">{cat.id}</td>
                        <td className="px-6 py-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm mx-auto">
                            <img
                              src={getImageUrl(cat.image)}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                              onError={(e) => (e.currentTarget.src = "/image/food/food.jpg")}
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{cat.name}</td>
                        <td className="px-6 py-4 hidden md:table-cell text-gray-500 dark:text-gray-400 max-w-xs truncate">{cat.description || <span className="italic opacity-50">Không có mô tả</span>}</td>
                        <td className="px-6 py-4">
                          <Switch
                            checked={!!cat.status}
                            onCheckedChange={(c) => handleToggleStatus(cat.id, c)}
                            disabled={loadingStatusId === cat.id}
                            className="mx-auto data-[state=checked]:bg-green-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setOpenViewDialogId(cat.id)} title="Xem chi tiết" className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => handleOpenForm(cat)} title="Chỉnh sửa" className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => setOpenDeleteDialogId(cat.id)} title="Xóa" className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"><Trash2 className="w-4 h-4" /></button>
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

      <CategoryDetailDialog
        open={!!openViewDialogId}
        onOpenChange={(open) => !open && setOpenViewDialogId(null)}
        category={categories.find(c => c.id === openViewDialogId)}
      />

      <Dialog open={!!openDeleteDialogId} onOpenChange={(o) => !o && setOpenDeleteDialogId(null)}>
        <DialogContent className="max-w-md rounded-xl bg-white dark:bg-[#1f1f1f]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <div className="py-3 text-gray-600 dark:text-gray-300">
            Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-gray-900 dark:text-white">#{openDeleteDialogId}</span> không?
            <br />Dữ liệu sẽ được chuyển vào thùng rác.
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenDeleteDialogId(null)}>Hủy bỏ</Button>
            <Button variant="destructive" onClick={() => openDeleteDialogId && handleDelete(openDeleteDialogId)}>Xóa ngay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CategoryFormDialog
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
        category={editingCategory}
        onSuccess={handleFormSuccess}
        categories={categories}
      />

      <Dialog open={openBulkDeleteDialog} onOpenChange={setOpenBulkDeleteDialog}>
        <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-red-500 text-lg">
              Xóa {selectedIds.length} danh mục?
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa {selectedIds.length} danh mục đã chọn? Dữ liệu sẽ được chuyển vào thùng rác.
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
