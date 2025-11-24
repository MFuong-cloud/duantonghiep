"use client";

import { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2, Eye, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/pagination/Pagination";

interface Table {
    id: number;
    name: string;
    capacity: number;
    status: "available" | "occupied" | "reserved";
    branch_id?: number;
}

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
        <div className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-[#3b82f6] flex items-center gap-2">
                    <PlusCircle className="w-6 h-6 text-[#3b82f6]" />
                    Quản lý bàn
                </h2>
                <Button
                    onClick={handleAdd}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> Thêm bàn
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên bàn..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 pl-9 p-2 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
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
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-[800px] w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">ID</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Tên bàn</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Sức chứa</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Trạng thái</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTables.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    Không có bàn nào
                                </td>
                            </tr>
                        ) : (
                            currentTables.map((table) => (
                                <tr
                                    key={table.id}
                                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition"
                                >
                                    <td className="p-3">{table.id}</td>
                                    <td className="p-3 font-medium">{table.name}</td>
                                    <td className="p-3">{table.capacity} người</td>
                                    <td className="p-3">
                                        <span className={`font-medium ${getStatusColor(table.status)}`}>
                                            {getStatusText(table.status)}
                                        </span>
                                    </td>
                                    <td className="p-3 flex justify-center items-center gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]" title="Xem chi tiết">
                                                    <Eye className="w-5 h-5 text-[#3b82f6]" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-[#3b82f6] text-xl">Thông tin bàn #{table.id}</DialogTitle>
                                                </DialogHeader>
                                                <div className="mt-4 space-y-2 text-sm">
                                                    <p><b>Tên bàn:</b> {table.name}</p>
                                                    <p><b>Sức chứa:</b> {table.capacity} người</p>
                                                    <p><b>Trạng thái:</b> <span className={getStatusColor(table.status)}>{getStatusText(table.status)}</span></p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <button
                                            onClick={() => handleEdit(table.id)}
                                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"
                                            title="Sửa"
                                        >
                                            <Pencil className="w-5 h-5 text-[#10b981]" />
                                        </button>

                                        <Dialog open={openDialogId === table.id} onOpenChange={(open) => setOpenDialogId(open ? table.id : null)}>
                                            <DialogTrigger asChild>
                                                <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a]" title="Xóa">
                                                    <Trash2 className="w-5 h-5 text-red-500" />
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
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />

            {/* Form Dialog */}
            {openFormDialog && (
                <TableFormDialog
                    open={openFormDialog}
                    onOpenChange={setOpenFormDialog}
                    onSave={handleSaveTable}
                    table={editingTable}
                />
            )}
        </div>
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
        status: "available" as "available" | "occupied" | "reserved",
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
            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#3b82f6]">
                        {table ? "Sửa bàn" : "Thêm bàn mới"}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Tên bàn <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none"
                            placeholder="Nhập tên bàn"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Sức chứa (người) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 })}
                            className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none"
                            min="1"
                            max="20"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Trạng thái <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                            className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none"
                            required
                        >
                            <option value="available">Trống</option>
                            <option value="occupied">Đang dùng</option>
                            <option value="reserved">Đã đặt</option>
                        </select>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" className="bg-[#3b82f6] hover:bg-[#2563eb] text-white">
                            {table ? "Cập nhật" : "Thêm bàn"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

