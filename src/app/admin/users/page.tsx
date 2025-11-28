"use client";

import { useState, useMemo, useEffect } from "react";
import { User, Eye, Pencil, Trash2, Search, PlusCircle } from "lucide-react";
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

export default function UsersManagement() {
    const [users, setUsers] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("usersData");
            return saved
                ? JSON.parse(saved)
                : [
                    {
                        id: "U001",
                        name: "Nguyễn Văn A",
                        email: "vana@example.com",
                        role: "Quản trị viên",
                        active: true,
                    },
                    {
                        id: "U002",
                        name: "Trần Thị B",
                        email: "thib@example.com",
                        role: "Nhân viên",
                        active: true,
                    },
                    {
                        id: "U003",
                        name: "Phạm Văn C",
                        email: "vanc@example.com",
                        role: "Khách hàng",
                        active: false,
                    },
                ];
        }
        return [];
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        localStorage.setItem("usersData", JSON.stringify(users));
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()) ||
                u.role.toLowerCase().includes(search.toLowerCase())
        );
    }, [users, search]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentUsers = filteredUsers.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleToggleStatus = (id: string) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
        );

        const user = users.find((u) => u.id === id);
        if (user) {
            const newStatus = user.active ? "bị khóa" : "được mở khóa";
            toast.success(`Tài khoản "${user.name}" đã ${newStatus}.`);
        }
    };

    const handleAdd = () => toast.info("Form thêm người dùng đang được phát triển 🚀");
    const handleEdit = (id: string) =>
        toast.info(`Sửa thông tin người dùng ${id} (coming soon ✏️)`);
    const handleDelete = (id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setOpenDialogId(null);
        toast.success("Xóa người dùng thành công!");
    };

    return (
        <div className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-[#3b82f6] flex items-center gap-2">
                    <User className="w-6 h-6 text-[#3b82f6]" />
                    Quản lý người dùng
                </h2>
                <Button
                    onClick={handleAdd}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> Thêm người dùng
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email hoặc vai trò..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 pl-9 p-2 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-[900px] w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Mã</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Họ và tên</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Email</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Vai trò</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Trạng thái</th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold w-[150px]">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((u) => (
                            <tr
                                key={u.id}
                                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition ${!u.active ? "opacity-50" : ""
                                    }`}
                            >
                                <td className="p-3">{u.id}</td>
                                <td className="p-3 font-medium">{u.name}</td>
                                <td className="p-3">{u.email}</td>
                                <td className="p-3">{u.role}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={u.active}
                                            onCheckedChange={() => handleToggleStatus(u.id)}
                                        />
                                        <span
                                            className={`font-medium ${u.active ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {u.active ? "Hoạt động" : "Bị khóa"}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* Xem chi tiết */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    disabled={!u.active}
                                                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-5 h-5 text-[#3b82f6]" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-[#3b82f6] text-xl">
                                                        Thông tin người dùng {u.id}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="mt-4 space-y-2 text-sm">
                                                    <p><b>Họ và tên:</b> {u.name}</p>
                                                    <p><b>Email:</b> {u.email}</p>
                                                    <p><b>Vai trò:</b> {u.role}</p>
                                                    <p><b>Trạng thái:</b> {u.active ? "Hoạt động" : "Bị khóa"}</p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Sửa */}
                                        <button
                                            disabled={!u.active}
                                            onClick={() => handleEdit(u.id)}
                                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"
                                            title="Sửa"
                                        >
                                            <Pencil className="w-5 h-5 text-[#10b981]" />
                                        </button>

                                        {/* Xóa */}
                                        <Dialog
                                            open={openDialogId === u.id}
                                            onOpenChange={(open) =>
                                                setOpenDialogId(open ? u.id : null)
                                            }
                                        >
                                            <DialogTrigger asChild>
                                                <button
                                                    disabled={!u.active}
                                                    className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a]"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-500" />
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

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
