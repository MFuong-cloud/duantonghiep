"use client";

import { useState, useMemo, useEffect } from "react";
import { User } from "@/model/User";
import { Eye, Pencil, Trash2, Search, PlusCircle, CheckCircle, XCircle, Mail, Phone, Shield, User as UserIcon, Filter, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";
import UserFormDialog from "@/components/admin/forms/UserFormDialog";
import { UserService } from "@/api/users/user.service";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const itemsPerPage = 10;

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await UserService.getUsers();
            // Sắp xếp theo ID giảm dần để hiển thị mới nhất trước
            const sortedUsers = data.sort((a, b) => b.id - a.id);
            setUsers(sortedUsers);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) => {
                const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.email.toLowerCase().includes(search.toLowerCase()) ||
                    (u.phone && u.phone.includes(search)) ||
                    u.role.toLowerCase().includes(search.toLowerCase());

                const matchesStatus = filterStatus === "all"
                    ? true
                    : filterStatus === "active"
                        ? u.status === "active"
                        : u.status !== "active";

                return matchesSearch && matchesStatus;
            }
        );
    }, [users, search, filterStatus]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const isAllSelected = currentUsers.length > 0 && currentUsers.every(u => selectedIds.includes(u.id));
    const isSomeSelected = currentUsers.some(u => selectedIds.includes(u.id)) && !isAllSelected;

    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(selectedIds.filter(id => !currentUsers.find(u => u.id === id)));
        } else {
            const newIds = [...selectedIds, ...currentUsers.filter(u => !selectedIds.includes(u.id)).map(u => u.id)];
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
            await Promise.all(selectedIds.map(id => UserService.deleteUser(id)));
            toast.success(`Đã xóa ${selectedIds.length} người dùng`);
            setSelectedIds([]);
            setOpenBulkDeleteDialog(false);
            fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa người dùng");
        }
    };


    // const handleToggleStatus = async (id: number) => {
    //     // Database không có cột status nên tạm thời disable chức năng này
    // };

    const handleAdd = () => {
        setEditingUser(null);
        setOpenFormDialog(true);
    };

    const handleEdit = (id: number) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setEditingUser(user);
            setOpenFormDialog(true);
        }
    };

    const handleDelete = async (id: number) => {
        const user = users.find((u) => u.id === id);
        const userName = user?.name || "người dùng";

        try {
            await UserService.deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            setOpenDialogId(null);
            toast.success(`Đã xóa người dùng "${userName}" thành công!`);
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            toast.error("Không thể xóa người dùng");
        }
    };



    return (
        <AdminCard>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-blue-500" />
                    Quản lý người dùng
                </h1>
                <div className="flex items-center gap-2">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm người dùng..."
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
                            <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as "all" | "active" | "inactive")}>
                                <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="active">Đang hoạt động</DropdownMenuRadioItem>
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
                        Thêm người dùng
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

            <div className="md:hidden relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm người dùng..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm text-sm"
                />
            </div>

            <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden">
                {loading ? (
                    <AdminLoading message="Đang tải danh sách người dùng..." />
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
                                        <th className="px-6 py-4">Mã</th>
                                        <th className="px-6 py-4">Họ và tên</th>
                                        <th className="px-6 py-4">Ảnh</th>
                                        <th className="px-6 py-4">Số điện thoại</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Vai trò</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                                    {currentUsers.length === 0 ? (
                                        <tr>

                                            <td colSpan={9} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                                    <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                                                        <UserX className="w-8 h-8 opacity-50" />
                                                    </div>
                                                    <p>Không tìm thấy người dùng nào.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentUsers.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                            >
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(u.id)}
                                                        onChange={() => handleSelectOne(u.id)}
                                                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 font-mono text-gray-500">{u.id}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-800 dark:text-gray-100">{u.name}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <Avatar className="w-10 h-10 border border-gray-200 dark:border-gray-700">
                                                            <AvatarImage src={u.avatar} alt={u.name} />
                                                            <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{u.phone}</td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{u.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap",
                                                        u.role === 'customer' && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
                                                        u.role === 'employee' && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                                                        u.role === 'manager' && "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
                                                        u.role === 'owner' && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
                                                    )}>
                                                        {u.role === 'customer' && "Khách hàng"}
                                                        {u.role === 'employee' && "Nhân viên"}
                                                        {u.role === 'manager' && "Quản lý"}
                                                        {u.role === 'owner' && "Chủ cửa hàng"}
                                                        {!['customer', 'employee', 'manager', 'owner'].includes(u.role) && u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium whitespace-nowrap">
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Hoạt động
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => setOpenViewDialogId(u.id)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                            title="Xem chi tiết"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleEdit(u.id)}
                                                            className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                                                            title="Sửa"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <Dialog
                                                            open={openDialogId === u.id}
                                                            onOpenChange={(open) =>
                                                                setOpenDialogId(open ? u.id : null)
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
                                                                        Xóa người dùng {u.name}?
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
                                                                        onClick={() => handleDelete(u.id)}
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
                    </>
                )}
            </AdminCard>

            <Dialog open={!!openViewDialogId} onOpenChange={(o) => !o && setOpenViewDialogId(null)}>
                <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 h-[95vh] flex flex-col">
                    {(() => {
                        const activeUser = users.find(u => u.id === openViewDialogId);
                        if (!activeUser) return null;
                        return (
                            <>
                                <div className="relative px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Chi tiết người dùng</DialogTitle>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Mã ID: <span className="font-mono">#{activeUser.id}</span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-5">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                                        <div className="flex flex-col gap-3 h-full">
                                            <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Ảnh đại diện</label>
                                            <div className="relative w-full h-full min-h-[250px] rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-black/20 flex items-center justify-center">
                                                {activeUser.avatar ? (
                                                    <img
                                                        src={activeUser.avatar}
                                                        alt={activeUser.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-6xl font-bold text-gray-300">
                                                        {activeUser.name.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-5">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-1 block">Họ và tên</label>
                                                <div className="flex items-start justify-between gap-4">
                                                    <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{activeUser.name}</h3>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${activeUser.status === 'active' ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                                                        {activeUser.status === 'active' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                        {activeUser.status === 'active' ? "Hoạt động" : "Bị khóa"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                                            <Mail className="w-4 h-4 text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{activeUser.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                                            <Phone className="w-4 h-4 text-green-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Số điện thoại</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{activeUser.phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                                                            <Shield className="w-4 h-4 text-purple-500" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-wider">Vai trò</p>
                                                            <p className="font-medium text-gray-900 dark:text-gray-100">{activeUser.role}</p>
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

            <Dialog open={openBulkDeleteDialog} onOpenChange={setOpenBulkDeleteDialog}>
                <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg">
                            Xóa {selectedIds.length} người dùng?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-400">
                        Bạn có chắc chắn muốn xóa {selectedIds.length} người dùng đã chọn? Hành động này không thể hoàn tác.
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

            <UserFormDialog
                open={openFormDialog}
                onOpenChange={setOpenFormDialog}
                onSuccess={fetchUsers}
                user={editingUser}
            />
        </AdminCard >
    );
}
