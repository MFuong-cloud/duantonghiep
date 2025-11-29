"use client";

import { useState, useMemo, useEffect } from "react";
import { Table } from "@/model/Table";
import { Pencil, Trash2, Eye, PlusCircle, Search, LayoutGrid, Users, Armchair, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/pagination/Pagination";
import { AdminCard, AdminPageHeader, adminInputClass, AdminFormField } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

type TableStatus = Table["status"];

export default function TablesManagement() {
    const [tables, setTables] = useState<Table[]>([
        { id: 1, name: "Bàn 1", capacity: 4, status: "available" },
        { id: 2, name: "Bàn 2", capacity: 2, status: "occupied" },
        { id: 3, name: "Bàn 3", capacity: 6, status: "available" },
        { id: 4, name: "Bàn 4", capacity: 4, status: "reserved" },
        { id: 5, name: "Bàn 5", capacity: 8, status: "available" },
        { id: 6, name: "Bàn 6", capacity: 2, status: "occupied" },
    ]);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const itemsPerPage = 10;

    const filteredTables = useMemo(() => {
        return tables.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
    }, [tables, search]);

    const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTables = filteredTables.slice(startIndex, startIndex + itemsPerPage);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available":
                return "text-green-500";
            case "occupied":
                return "text-red-500";
            case "reserved":
                return "text-yellow-500";
            default:
                return "text-gray-500";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "available":
                return "Trống";
            case "occupied":
                return "Đang dùng";
            case "reserved":
                return "Đã đặt";
            default:
                return status;
        }
    };

    const handleAdd = () => {
        setEditingTable(null);
        setOpenFormDialog(true);
    };

    const handleEdit = (id: number) => {
        const table = tables.find((t) => t.id === id);
        if (table) {
            setEditingTable(table);
            setOpenFormDialog(true);
        }
    };

    const handleDelete = (id: number) => {
        const table = tables.find((t) => t.id === id);
        if (table && table.status === "occupied") {
            toast.error("Không thể xóa bàn đang được sử dụng!");
            return;
        }
        setTables((prev) => prev.filter((t) => t.id !== id));
        setOpenDialogId(null);
        toast.success("Đã xóa bàn thành công!");
    };

    const handleSaveTable = (tableData: Omit<Table, "id">) => {
        if (editingTable) {
            setTables((prev) =>
                prev.map((t) => (t.id === editingTable.id ? { ...t, ...tableData } : t))
            );
            toast.success("Cập nhật bàn thành công!");
        } else {
            const newId = Math.max(...tables.map((t) => t.id), 0) + 1;
            setTables((prev) => [...prev, { id: newId, ...tableData }]);
            toast.success("Thêm bàn thành công!");
        }
        setOpenFormDialog(false);
        setEditingTable(null);
    };

    return (
        <AdminCard>
            {/* 1. Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <LayoutGrid className="w-6 h-6 text-blue-500" />
                        Quản lý bàn
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Theo dõi tình trạng bàn, tối ưu việc nhận khách và lịch đặt.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm bàn..."
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
                        Thêm bàn
                    </Button>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm bàn..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="text-sm text-green-600 dark:text-green-400 mb-1">Bàn trống</div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {tables.filter((t) => t.status === "available").length}
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="text-sm text-red-600 dark:text-red-400 mb-1">Đang dùng</div>
                    <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                        {tables.filter((t) => t.status === "occupied").length}
                    </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Đã đặt</div>
                    <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                        {tables.filter((t) => t.status === "reserved").length}
                    </div>
                </div>
            </div>

            {/* Table */}
            <AdminCard className="overflow-hidden border-none shadow-md p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-center">
                        <thead className="bg-gray-50 dark:bg-[#252525] border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Tên bàn</th>
                                <th className="px-6 py-4">Sức chứa</th>
                                <th className="px-6 py-4">Trạng thái</th>
                                <th className="px-6 py-4">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                            {currentTables.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-gray-500 dark:text-gray-400">
                                        Không có bàn nào
                                    </td>
                                </tr>
                            ) : (
                                currentTables.map((table) => (
                                    <tr
                                        key={table.id}
                                        className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 font-mono text-gray-500">{table.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{table.name}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{table.capacity} người</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${table.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
                                                table.status === 'occupied' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {table.status === 'available' ? <CheckCircle className="w-3 h-3" /> :
                                                    table.status === 'occupied' ? <XCircle className="w-3 h-3" /> :
                                                        <Clock className="w-3 h-3" />}
                                                {getStatusText(table.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setOpenViewDialogId(table.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleEdit(table.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                                                    title="Sửa"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>

                                                <Dialog open={openDialogId === table.id} onOpenChange={(open) => setOpenDialogId(open ? table.id : null)}>
                                                    <DialogTrigger asChild>
                                                        <button className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Xóa">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-red-500 text-lg">Xóa bàn {table.name}?</DialogTitle>
                                                        </DialogHeader>
                                                        <DialogFooter className="flex justify-end gap-2">
                                                            <Button variant="outline" onClick={() => setOpenDialogId(null)}>Hủy</Button>
                                                            <Button variant="destructive" onClick={() => handleDelete(table.id)}>Xóa</Button>
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

            {/* Form Dialog */}
            {openFormDialog && (
                <TableFormDialog
                    open={openFormDialog}
                    onOpenChange={setOpenFormDialog}
                    onSave={handleSaveTable}
                    table={editingTable}
                />
            )}

            {/* View Dialog */}
            <Dialog open={!!openViewDialogId} onOpenChange={(o) => !o && setOpenViewDialogId(null)}>
                <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
                    {(() => {
                        const activeTable = tables.find(t => t.id === openViewDialogId);
                        if (!activeTable) return null;
                        return (
                            <>
                                <div className="relative px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <LayoutGrid className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết bàn</DialogTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Mã ID: <span className="font-mono">#{activeTable.id}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                                        {/* Cột ảnh minh họa */}
                                        <div className="flex flex-col gap-3 h-full">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mô phỏng</label>
                                            <div className="relative w-full h-full min-h-[250px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-black/20 flex flex-col items-center justify-center gap-4">
                                                <div className={`p-8 rounded-full ${activeTable.status === 'available' ? 'bg-green-100 text-green-600' :
                                                    activeTable.status === 'occupied' ? 'bg-red-100 text-red-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                    <Armchair className="w-24 h-24" />
                                                </div>
                                                <p className="text-lg font-medium text-gray-500">
                                                    {activeTable.name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Cột thông tin */}
                                        <div className="flex flex-col space-y-5">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 block">Thông tin bàn</label>
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{activeTable.name}</h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${activeTable.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        activeTable.status === 'occupied' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                        }`}>
                                                        {activeTable.status === 'available' ? <CheckCircle className="w-4 h-4" /> :
                                                            activeTable.status === 'occupied' ? <XCircle className="w-4 h-4" /> :
                                                                <Clock className="w-4 h-4" />}
                                                        {getStatusText(activeTable.status)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                                            <Users className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Sức chứa</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{activeTable.capacity} người</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                                            <LayoutGrid className="w-4 h-4 text-purple-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Khu vực</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">Tầng 1 (Mặc định)</p>
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

// Form Dialog Component
interface TableFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: Omit<Table, "id">) => void;
    table?: Table | null;
}

function TableFormDialog({ open, onOpenChange, onSave, table }: TableFormDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        capacity: 4,
        status: "available" as TableStatus,
    });

    useEffect(() => {
        if (table) {
            setFormData({
                name: table.name,
                capacity: table.capacity,
                status: table.status,
            });
        } else {
            setFormData({
                name: "",
                capacity: 4,
                status: "available",
            });
        }
    }, [table, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên bàn");
            return;
        }
        onSave(formData);
    };

    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl h-[95vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {table ? "Cập nhật bàn" : "Thêm bàn mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                            {/* Cột Trái: Form Inputs */}
                            <div className="space-y-4">
                                <AdminFormField label="Tên bàn" required>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={cn(adminInputClass, "bg-gray-100 dark:bg-[#2a2a2a]")}
                                        placeholder="Nhập tên bàn (VD: Bàn 10)"
                                        required
                                    />
                                </AdminFormField>

                                <AdminFormField label="Sức chứa (người)" required>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 })}
                                        className={cn(adminInputClass, "bg-gray-100 dark:bg-[#2a2a2a]")}
                                        min="1"
                                        max="50"
                                        required
                                    />
                                </AdminFormField>

                                <AdminFormField label="Trạng thái" required>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as TableStatus })}
                                        className={cn(adminInputClass, "bg-gray-100 dark:bg-[#2a2a2a] appearance-none")}
                                        required
                                    >
                                        <option value="available">Trống</option>
                                        <option value="occupied">Đang dùng</option>
                                        <option value="reserved">Đã đặt</option>
                                    </select>
                                </AdminFormField>
                            </div>

                            {/* Cột Phải: Minh họa */}
                            <div className="hidden lg:flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <Armchair className="w-32 h-32 text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-center">
                                    Hình ảnh mô phỏng bàn sẽ hiển thị ở đây
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-11 text-base">
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 text-base font-semibold">
                            {table ? "Lưu thay đổi" : "Tạo bàn"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

