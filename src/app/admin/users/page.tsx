"use client";

import { useState, useMemo, useEffect } from "react";
import { User } from "@/model/User";
import { Eye, Pencil, Trash2, Search, PlusCircle, Tag, CheckCircle, XCircle, Mail, Phone, Shield, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export default function UsersManagement() {
    const [users, setUsers] = useState<User[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("usersData");
            return saved
                ? JSON.parse(saved)
                : [
                    {
                        id: 1,
                        name: "Nguyễn Văn A",
                        avatar: "https://github.com/shadcn.png",
                        phone: "0901234567",
                        email: "vana@example.com",
                        role: "Quản trị viên",
                        status: "active",
                    },
                    {
                        id: 2,
                        name: "Trần Thị B",
                        avatar: "https://github.com/shadcn.png",
                        phone: "0912345678",
                        email: "thib@example.com",
                        role: "Nhân viên",
                        status: "active",
                    },
                    {
                        id: 3,
                        name: "Phạm Văn C",
                        avatar: "https://github.com/shadcn.png",
                        phone: "0923456789",
                        email: "vanc@example.com",
                        role: "Khách hàng",
                        status: "inactive",
                    },
                ];
        }
        return [];
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<number | null>(null);
    const [openViewDialogId, setOpenViewDialogId] = useState<number | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        localStorage.setItem("usersData", JSON.stringify(users));
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                (u.phone && u.phone.includes(search)) ||
                u.role.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleToggleStatus = (id: number) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u))
        );

        const user = users.find((u) => u.id === id);
        if (user) {
            const newStatus = user.status === "active" ? "bị khóa" : "được mở khóa";
            toast.success(`Tài khoản "${user.name}" đã ${newStatus}.`);
        }
    };

    const handleAdd = () => toast.info("Form thêm người dùng đang được phát triển 🚀");
    const handleEdit = (id: number) =>
        toast.info(`Sửa thông tin người dùng ${id} (coming soon ✏️)`);
    const handleDelete = (id: number) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setOpenDialogId(null);
        toast.success("Xóa người dùng thành công!");
    };

    return (
        <AdminCard>
            {/* 1. Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <UserIcon className="w-6 h-6 text-blue-500" />
                        Quản lý người dùng
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        Phân quyền, khóa tài khoản và theo dõi hoạt động nhân viên/khách hàng.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm người dùng..."
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
                        Thêm người dùng
                    </Button>
                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm người dùng..."
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
                            {currentUsers.map((u) => (
                                <tr
                                    key={u.id}
                                    className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200"
                                >
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
                                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium">
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Switch
                                            checked={u.status === 'active'}
                                            onCheckedChange={() => handleToggleStatus(u.id)}
                                            className="mx-auto data-[state=checked]:bg-green-500"
                                        />
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                disabled={u.status !== 'active'}
                                                onClick={() => setOpenViewDialogId(u.id)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50"
                                                title="Xem chi tiết"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            <button
                                                disabled={u.status !== 'active'}
                                                onClick={() => handleEdit(u.id)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all disabled:opacity-50"
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
                                                        disabled={u.status !== 'active'}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
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
                            ))}
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
                                        {/* Cột ảnh */}
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

                                        {/* Cột thông tin */}
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
        </AdminCard>
    );
}
