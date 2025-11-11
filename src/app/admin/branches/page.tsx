"use client";

import { useState, useMemo } from "react";
import { Pencil, Trash2, Eye, PlusCircle, Search, Building2 } from "lucide-react";
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

export default function BranchesManagement() {
    const [branches, setBranches] = useState([
        { id: "CN001", name: "Chi nhánh Hà Nội", address: "123 Cầu Giấy, Hà Nội", phone: "0987654321", active: true },
        { id: "CN002", name: "Chi nhánh TP.HCM", address: "45 Lê Lợi, Q.1", phone: "0912345678", active: false },
        { id: "CN003", name: "Chi nhánh Đà Nẵng", address: "27 Nguyễn Văn Linh", phone: "0909123456", active: true },
        ...Array.from({ length: 25 }, (_, i) => ({
            id: `CN00${i + 4}`,
            name: `Chi nhánh Test ${i + 1}`,
            address: `Địa chỉ Test ${i + 1}`,
            phone: `09000000${i + 1}`,
            active: i % 2 === 0,
        })),
    ]);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const itemsPerPage = 7;

    // filter theo search
    const filteredBranches = useMemo(() => {
        return branches.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));
    }, [branches, search]);

    const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

    const handleToggleStatus = (id: string) => {
        setBranches((prev) =>
            prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
        );

        const branch = branches.find((b) => b.id === id);
        if (branch) {
            const newStatus = branch.active ? "Ngưng" : "Hoạt động";
            toast.success(`Chi nhánh "${branch.name}" đã chuyển sang ${newStatus}.`);
        }
    };

    const handleAdd = () => toast.info("Form thêm chi nhánh sắp có 🚀");
    const handleEdit = (id: string) => toast.info(`Sửa chi nhánh ${id} đang được phát triển ✏️`);
    const handleDelete = (id: string) => {
        setBranches((prev) => prev.filter((b) => b.id !== id));
        setOpenDialogId(null);
        toast.success("Đã xóa chi nhánh thành công!");
    };

    return (
        <div className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-[#3b82f6] flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-[#3b82f6]" />
                    Quản lý chi nhánh
                </h2>
                <Button
                    onClick={handleAdd}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> Thêm chi nhánh
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên chi nhánh..."
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
                <table className="min-w-[900px] w-full text-sm table-fixed">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            <th className="p-3 text-left w-[80px] text-[#3b82f6] font-semibold">Mã CN</th>
                            <th className="p-3 text-left w-[200px] text-[#3b82f6] font-semibold">Tên chi nhánh</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Địa chỉ</th>
                            <th className="p-3 text-left w-[140px] text-[#3b82f6] font-semibold">SĐT</th>
                            <th className="p-3 text-left w-[140px] text-[#3b82f6] font-semibold">Trạng thái</th>
                            <th className="p-3 text-center w-[160px] text-[#3b82f6] font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentBranches.map((b) => (
                            <tr key={b.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition">
                                <td className="p-3">{b.id}</td>
                                <td className="p-3 font-medium">{b.name}</td>
                                <td className="p-3">{b.address}</td>
                                <td className="p-3">{b.phone}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Switch checked={b.active} onCheckedChange={() => handleToggleStatus(b.id)} />
                                        <span className={`font-medium ${b.active ? "text-green-500" : "text-red-500"}`}>
                                            {b.active ? "Hoạt động" : "Ngưng"}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-3 flex justify-center items-center gap-2">
                                    {/* Xem nhanh */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]" title="Xem chi tiết">
                                                <Eye className="w-5 h-5 text-[#3b82f6]" />
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                            <DialogHeader>
                                                <DialogTitle className="text-[#3b82f6] text-xl">Thông tin chi nhánh {b.id}</DialogTitle>
                                            </DialogHeader>
                                            <div className="mt-4 space-y-2 text-sm">
                                                <p><b>Tên:</b> {b.name}</p>
                                                <p><b>Địa chỉ:</b> {b.address}</p>
                                                <p><b>SĐT:</b> {b.phone}</p>
                                                <p><b>Trạng thái:</b> {b.active ? "Hoạt động" : "Ngưng hoạt động"}</p>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Sửa */}
                                    <button onClick={() => handleEdit(b.id)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]" title="Chỉnh sửa">
                                        <Pencil className="w-5 h-5 text-[#10b981]" />
                                    </button>

                                    {/* Xóa */}
                                    <Dialog open={openDialogId === b.id} onOpenChange={(open) => setOpenDialogId(open ? b.id : null)}>
                                        <DialogTrigger asChild>
                                            <button className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a]" title="Xóa chi nhánh">
                                                <Trash2 className="w-5 h-5 text-red-500" />
                                            </button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                            <DialogHeader>
                                                <DialogTitle className="text-red-500 text-lg">Xóa chi nhánh {b.name}?</DialogTitle>
                                            </DialogHeader>
                                            <DialogFooter className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => { toast.info("Đã hủy thao tác."); setOpenDialogId(null); }}>Hủy</Button>
                                                <Button variant="destructive" onClick={() => handleDelete(b.id)}>Xóa</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
}
