"use client";

import { useState, useMemo, useEffect } from "react";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import {
  Pencil,
  Trash2,
  Plus,
  // Upload, // Unused
  Search,
  Image as ImageIcon,
  LayoutGrid,
  // MoreHorizontal, // Unused
  Filter,
  Eye,
  // X, // Unused
  Tag,
  FileText,
  CheckCircle,
  XCircle
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
  // DialogTrigger, // Unused
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
// import { cn } from "@/lib/utils"; // Unused

import { CategoryService } from "@/api/categories/category.service";
import { Category } from "@/model/Category";

// --- Config ---
const EMPTY_FORM = {
  name: "",
  description: "",
  image: "",
  status: true,
};

const ITEMS_PER_PAGE = 10;
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function MenuCategoriesPage() {
  // --- State ---
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Dialog States
  const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
  const [openDeleteDialogId, setOpenDeleteDialogId] = useState<number | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);

  // Form States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loadingStatusId, setLoadingStatusId] = useState<number | null>(null);

  // --- Helpers ---
  const getImageUrl = (img?: string | null) => {
    if (!img) return "/image/food/food.jpg"; // Placeholder mặc định
    if (img.startsWith("http")) return img;
    if (img.startsWith("/storage")) return `${API_BASE}${img}`;
    return `${API_BASE}/storage/${img}`;
  };

  // --- Effects ---
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await CategoryService.getCategories();
      // Normalize data: đảm bảo status là boolean và description là string
      setCategories(data.map((c: any) => ({
        ...c,
        status: !!c.status,
        description: c.description || "" // Convert null thành string rỗng
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

  // --- Logic ---
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

  const handleToggleStatus = async (id: number, checkedParam?: boolean) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const newStatus = typeof checkedParam === "boolean" ? checkedParam : !cat.status;
    setLoadingStatusId(id);

    try {
      // Gửi dạng FormData giống như form save
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

      setCategories(prev => prev.map(c => c.id === id ? { ...c, status: newStatus ? 1 : 0 } : c));

      // Hiển thị thông báo phù hợp
      if (newStatus) {
        toast.success(`Đã hiển thị danh mục "${cat.name}"`);
      } else {
        toast.success(`Đã ẩn danh mục "${cat.name}" và tất cả món ăn thuộc danh mục này`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Không thể cập nhật trạng thái");
    } finally {
      setLoadingStatusId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await CategoryService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      setOpenDeleteDialogId(null);
      toast.success("Đã xóa danh mục!");
    } catch (error) {
      toast.error("Không thể xóa danh mục");
    }
  };

  // --- Form Handlers ---
  const handleOpenForm = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        status: !!category.status,
      });
      setImagePreview(category.image ? getImageUrl(category.image) : null);
    } else {
      setEditingId(null);
      setFormData(EMPTY_FORM);
      setImagePreview(null);
    }
    setImageFile(null);
    setOpenFormDialog(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      toast.error("Tên danh mục không được để trống");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.name.trim());
      fd.append("description", formData.description?.trim() || "");
      // Thử gửi status dạng số
      fd.append("status", formData.status ? "1" : "0");
      if (imageFile) fd.append("image", imageFile);

      // Debug log - xem tất cả dữ liệu trong FormData
      console.log("Form data being sent:");
      for (let [key, value] of fd.entries()) {
        console.log(`  ${key}:`, value);
      }

      // Kiểm tra tên trùng
      const trimmedName = formData.name.trim().toLowerCase();
      const isDuplicate = categories.some(cat => {
        // Nếu đang edit, bỏ qua category hiện tại
        if (editingId && cat.id === editingId) return false;
        return cat.name.trim().toLowerCase() === trimmedName;
      });

      if (isDuplicate) {
        toast.error(`Tên danh mục "${formData.name}" đã tồn tại!`);
        return;
      }

      let res;
      if (editingId) {
        fd.append("_method", "PUT");
        res = await fetch(`${API_BASE}/api/categories/${editingId}`, { method: "POST", body: fd });
      } else {
        res = await fetch(`${API_BASE}/api/categories`, { method: "POST", body: fd });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("API Error:", errorData);

        // Hiển thị lỗi validation nếu có
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(errorData.message || "Lỗi API");
      }

      const json = await res.json();
      console.log("API Response:", json);
      const data = (json as any)?.data ?? json;
      // Normalize data: đảm bảo status là boolean và description là string
      const normalized = {
        ...data,
        status: !!data.status,
        description: data.description || "" // Convert null thành string rỗng
      };

      if (editingId) {
        setCategories(prev => prev.map(c => c.id === editingId ? normalized : c));
        toast.success("Cập nhật thành công");
      } else {
        setCategories(prev => [normalized, ...prev]);
        toast.success("Thêm mới thành công");
      }

      setOpenFormDialog(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Có lỗi xảy ra khi lưu");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // --- Render ---
  if (loading && categories.length === 0) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <AdminPageLayout
      header={
        <>
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <LayoutGrid className="w-6 h-6 text-blue-500" />
                Quản lý danh mục
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Hiển thị và quản lý các nhóm món ăn trên hệ thống.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Lọc</span>
                    {filterStatus !== 'all' && (
                      <span className="ml-1 flex h-2 w-2 rounded-full bg-blue-600" />
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
              <Button
                onClick={() => handleOpenForm()}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm mới
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm danh mục..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm"
            />
          </div>
        </>
      }
    >

      {/* 2. Main Table Card */}
      <AdminCard className="overflow-hidden border-none shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#252525] border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
              <tr>
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
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                        <LayoutGrid className="w-8 h-8 opacity-50" />
                      </div>
                      <p>Không tìm thấy danh mục nào.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentCategories.map((cat) => (
                  <tr key={cat.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200">
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
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1f1f1f]">
          <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </AdminCard>

      {/* --- DIALOGS --- */}
      {/* 1. VIEW DIALOG (UPDATED: TO HƠN, XEM FULL ẢNH) */}
      <Dialog open={!!openViewDialogId} onOpenChange={(o) => !o && setOpenViewDialogId(null)}>
        {/* Dialog xem chi tiết - Gần toàn màn hình */}
        <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
          {(() => {
            const activeCat = categories.find(c => c.id === openViewDialogId);
            if (!activeCat) return null;
            return (
              <>
                <div className="relative px-8 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết danh mục</DialogTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Mã ID: <span className="font-mono">#{activeCat.id}</span></p>
                    </div>
                  </div>
                </div>

                {/* Content cuộn được */}
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                    {/* Cột ảnh: Đã chỉnh để xem full */}
                    <div className="flex flex-col gap-3 h-full">
                      <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Hình ảnh</label>
                      <div className="relative w-full h-full min-h-[250px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-black/20">
                        {/* Dùng object-cover để ảnh fill toàn bộ khung */}
                        <img
                          src={getImageUrl(activeCat.image)}
                          alt={activeCat.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Cột thông tin */}
                    <div className="flex flex-col space-y-5">
                      <div>
                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 block">Tên danh mục</label>
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{activeCat.name}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${activeCat.status ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                            {activeCat.status ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            {activeCat.status ? "Hoạt động" : "Đang ẩn"}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mô tả</label>
                        </div>
                        <div className="flex-1 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 text-gray-600 dark:text-gray-300 text-base leading-relaxed min-h-[200px] overflow-auto break-words whitespace-pre-wrap">
                          {activeCat.description || "Chưa có mô tả."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 py-5 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
                  <Button variant="outline" onClick={() => setOpenViewDialogId(null)} className="px-8 h-11 text-base">Đóng</Button>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>

      {/* 2. DELETE */}
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
            <br />Hành động này không thể hoàn tác.
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpenDeleteDialogId(null)}>Hủy bỏ</Button>
            <Button variant="destructive" onClick={() => openDeleteDialogId && handleDelete(openDeleteDialogId)}>Xóa ngay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. FORM DIALOG (UPDATED: TO HƠN, ẢNH LỚN HƠN) */}
      <Dialog open={openFormDialog} onOpenChange={setOpenFormDialog}>
        {/* Dialog form - Gần toàn màn hình */}
        <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl h-[95vh] flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              {editingId ? <Pencil className="w-5 h-5 text-orange-500" /> : <Plus className="w-5 h-5 text-blue-500" />}
              {editingId ? "Cập nhật danh mục" : "Thêm danh mục mới"}
            </DialogTitle>
          </div>

          <form onSubmit={handleSaveCategory} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Cột Trái: Input */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Tên danh mục <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-lg"
                      placeholder="Ví dụ: Món nướng, Hải sản..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-semibold text-gray-700 dark:text-gray-300">
                      Mô tả
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                      placeholder="Nhập mô tả chi tiết..."
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Trạng thái hiển thị</span>
                      <span className="text-sm text-gray-500">Bật để danh mục xuất hiện trên menu khách hàng</span>
                    </div>
                    <Switch
                      checked={formData.status}
                      onCheckedChange={(c) => setFormData({ ...formData, status: c })}
                    />
                  </div>
                </div>

                {/* Cột Phải: Ảnh (Đã làm to) */}
                <div className="flex flex-col h-full">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Ảnh đại diện</label>

                  <label className="flex-1 relative group cursor-pointer overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:border-blue-500 transition-all bg-gray-50/30 min-h-[250px] flex items-center justify-center">
                    {imagePreview ? (
                      <>
                        {/* Dùng object-cover để ảnh fill toàn bộ khung */}
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl absolute inset-0" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl z-10">
                          <p className="text-white font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Pencil className="w-4 h-4" /> Thay đổi ảnh
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                          <ImageIcon className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Click để tải ảnh lên</p>
                        <p className="text-sm text-gray-400 mt-1">PNG, JPG tối đa 3MB</p>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
              <Button type="button" variant="outline" onClick={() => setOpenFormDialog(false)} className="px-6 h-11 text-base">Hủy bỏ</Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 text-base font-semibold">
                {editingId ? "Lưu thay đổi" : "Tạo danh mục"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

    </AdminPageLayout>
  );
}
