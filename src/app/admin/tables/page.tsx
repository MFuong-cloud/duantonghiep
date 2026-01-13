"use client";

import { useState, useMemo, useEffect } from "react";
import { Table } from "@/model/Table";
import { Pencil, Trash2, Eye, PlusCircle, Search, LayoutGrid, Armchair, CheckCircle, XCircle, Clock, Filter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { AdminCard } from "@/components/admin/layout/AdminUI";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import TableFormDialog from "@/components/admin/forms/TableFormDialog";
import { TableService } from "@/api/tables/table.service";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";
import TableDetailDialog from "@/components/admin/dialogs/TableDetailDialog";
import { Order } from "@/model/Order";

import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

export default function TablesManagement() {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "available" | "occupied" | "reserved">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    // Detail Dialog State
    const [detailTable, setDetailTable] = useState<Table | null>(null);
    const [ordersToday, setOrdersToday] = useState(0);
    const [allOrdersToday, setAllOrdersToday] = useState<Order[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [viewDetailOpen, setViewDetailOpen] = useState(false);

    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingTable, setEditingTable] = useState<Table | null>(null);
    const itemsPerPage = 10;

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

    const fetchTables = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const data = await TableService.getTables();
            // Sắp xếp theo ID giảm dần để hiển thị mới nhất trước
            const sortedTables = data.sort((a, b) => b.id - a.id);
            setTables(sortedTables);
        } catch (error) {
            console.error("Lỗi khi tải danh sách bàn:", error);
            toast.error("Không thể tải danh sách bàn");
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // Realtime Updates Listener
    useRealtimeUpdates({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        role: 'admin',
        onTableUpdate: () => fetchTables(false) // Reload data silently
    });

    const filteredTables = useMemo(() => {
        return tables.filter((t) => {
            const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filterStatus === "all" ? true : t.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [tables, search, filterStatus]);

    const totalPages = Math.ceil(filteredTables.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTables = filteredTables.slice(startIndex, startIndex + itemsPerPage);

    const isAllSelected = currentTables.length > 0 && currentTables.every(t => selectedIds.includes(t.id));
    const isSomeSelected = currentTables.some(t => selectedIds.includes(t.id)) && !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(selectedIds.filter(id => !currentTables.find(t => t.id === id)));
        } else {
            const newIds = [...selectedIds, ...currentTables.filter(t => !selectedIds.includes(t.id)).map(t => t.id)];
            setSelectedIds(newIds);
        }
    };

    const handleViewDetail = async (id: number) => {
        try {
            const res = await TableService.getTableDetail(id);
            setDetailTable(res.table);
            setOrdersToday(res.ordersToday);
            setAllOrdersToday(res.allOrdersToday);
            setActiveOrders(res.activeOrders);
            setViewDetailOpen(true);
        } catch (error) {
            console.error("Error fetching table details:", error);
            toast.error("Không thể tải chi tiết bàn");
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
        const occupiedTables = tables.filter(t => selectedIds.includes(t.id) && t.status === "occupied");
        if (occupiedTables.length > 0) {
            toast.error(`Không thể xóa ${occupiedTables.length} bàn đang được sử dụng!`);
            return;
        }

        try {
            await Promise.all(selectedIds.map(id => TableService.deleteTable(id)));
            toast.success(`Đã xóa ${selectedIds.length} bàn`);
            setSelectedIds([]);
            setOpenBulkDeleteDialog(false);
            fetchTables();
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa bàn");
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

    const handleDelete = async (id: number) => {
        const table = tables.find((t) => t.id === id);
        if (table && table.status === "occupied") {
            toast.error("Không thể xóa bàn đang được sử dụng!");
            return;
        }

        try {
            await TableService.deleteTable(id);
            const tableName = table?.name || "bàn";
            setTables((prev) => prev.filter((t) => t.id !== id));
            setOpenDialogId(null);
            toast.success(`Đã xóa bàn "${tableName}" thành công!`);
        } catch (error) {
            console.error("Lỗi khi xóa bàn:", error);
            toast.error("Không thể xóa bàn");
        }
    };



    return (
        <AdminPageLayout
            header={
                <div className="flex flex-col gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-blue-500" />
                            Quản lý bàn
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm bàn..."
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
                                <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                                    <DropdownMenuLabel>Trạng thái</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | "available" | "occupied" | "reserved")}>
                                        <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="available">Trống</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="occupied">Đang dùng</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="reserved">Đã đặt</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                onClick={handleAdd}
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm h-8 text-xs"
                            >
                                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                                Thêm bàn
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

                    {/* Stats cards - compact inline */}
                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="text-green-600 dark:text-green-400">Trống:</div>
                            <div className="font-bold text-green-700 dark:text-green-300">
                                {tables.filter((t) => t.status === "available").length}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="text-red-600 dark:text-red-400">Đang dùng:</div>
                            <div className="font-bold text-red-700 dark:text-red-300">
                                {tables.filter((t) => t.status === "occupied").length}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="text-yellow-600 dark:text-yellow-400">Đã đặt:</div>
                            <div className="font-bold text-yellow-700 dark:text-yellow-300">
                                {tables.filter((t) => t.status === "reserved").length}
                            </div>
                        </div>
                    </div>
                </div>
            }
        >

            <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden">
                {loading ? (
                    <AdminLoading message="Đang tải danh sách bàn..." />
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
                                        <th className="px-6 py-4">Tên bàn</th>
                                        <th className="px-6 py-4">Sức chứa</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                                    {currentTables.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                                                        <Armchair className="w-8 h-8 opacity-50" />
                                                    </div>
                                                    <p>Không tìm thấy bàn nào.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentTables.map((table) => (
                                            <tr
                                                key={table.id}
                                                className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                            >
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(table.id)}
                                                        onChange={() => handleSelectOne(table.id)}
                                                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                                    />
                                                </td>
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
                                                            onClick={() => handleViewDetail(table.id)}
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
                                                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Dữ liệu sẽ được chuyển vào thùng rác.</div>
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
                        <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1f1f1f]">
                            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    </>
                )}
            </AdminCard>

            {openFormDialog && (
                <TableFormDialog
                    open={openFormDialog}
                    onOpenChange={setOpenFormDialog}
                    onSuccess={fetchTables}
                    table={editingTable}
                />
            )}

            {viewDetailOpen && (
                <TableDetailDialog
                    open={viewDetailOpen}
                    onOpenChange={setViewDetailOpen}
                    table={detailTable}
                    ordersToday={ordersToday}
                    allOrdersToday={allOrdersToday}
                    activeOrders={activeOrders}
                />
            )}
            {/* <Dialog open={!!openViewDialogId} onOpenChange={(o) => !o && setOpenViewDialogId(null)}>
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
            </Dialog> */}

            <Dialog open={openBulkDeleteDialog} onOpenChange={setOpenBulkDeleteDialog}>
                <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg">
                            Xóa {selectedIds.length} bàn?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa {selectedIds.length} bàn đã chọn? Dữ liệu sẽ được chuyển vào thùng rác.
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
