"use client";

import { useState, useMemo, useEffect } from "react";
import { Pencil, Trash2, Eye, PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/pagination/Pagination";

export default function MenuItemsManagement() {
    const [items, setItems] = useState([
        { id: "FD001", name: "Phở Bò", category: "Khai vị", price: 45000, active: true },
        { id: "FD002", name: "Bún Chả", category: "Món chính", price: 55000, active: true },
        { id: "FD003", name: "Gỏi Cuốn", category: "Tráng miệng", price: 30000, active: false },
        ...Array.from({ length: 25 }, (_, i) => ({
            id: `FD00${i + 4}`,
            name: `Món Test ${i + 1}`,
            category: `Danh mục ${i % 5 + 1}`,
            price: 20000 + i * 1000,
            active: i % 2 === 0,
        })),
    ]);

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const itemsPerPage = 7;

    // Load danh mục từ localStorage
    useEffect(() => {
        const savedCategories = localStorage.getItem("categories");
        if (savedCategories) setCategories(JSON.parse(savedCategories));
    }, []);

    const filteredItems = useMemo(() => {
        return items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    }, [items, search]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    const isCategoryActive = (categoryName: string) => {
        const cat = categories.find(c => c.name === categoryName);
        return cat?.active ?? true;
    };

    const handleToggleStatus = (id: string) => {
        const item = items.find(i => i.id === id);
        if (item && !isCategoryActive(item.category)) {
            toast.error(`Món thuộc danh mục ẩn, không thể thao tác!`);
            return;
        }

        setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));

        if (item) {
            const newStatus = item.active ? "Ngưng" : "Còn";
            toast.success(`Món "${item.name}" đã chuyển sang ${newStatus}.`);
        }
    };

    const handleAdd = () => toast.info("Form thêm món sắp có 🚀");
    const handleEdit = (id: string) => {
        const item = items.find(i => i.id === id);
        if (item && !isCategoryActive(item.category)) {
            toast.error("Món thuộc danh mục ẩn, không thể sửa!");
            return;
        }
        toast.info(`Sửa món ${id} đang được phát triển ✏️`);
    };
    const handleDelete = (id: string) => {
        const item = items.find(i => i.id === id);
        if (item && !isCategoryActive(item.category)) {
            toast.error("Món thuộc danh mục ẩn, không thể xóa!");
            return;
        }

        setItems(prev => prev.filter(i => i.id !== id));
        setOpenDialogId(null);
        toast.success("Đã xóa món thành công!");
    };

    return (
        <div className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-[#3b82f6] flex items-center gap-2">
                    <PlusCircle className="w-6 h-6 text-[#3b82f6]" />
                    Quản lý món ăn
                </h2>
                <Button
                    onClick={handleAdd}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> Thêm món
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên món..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 pl-9 p-2 rounded-md focus:ring-2 focus:ring-[#3b82f6] outline-none placeholder-gray-400 dark:placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="min-w-[900px] w-full text-sm table-fixed">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            <th className="p-3 text-left w-[80px] text-[#3b82f6] font-semibold">Mã</th>
                            <th className="p-3 text-left w-[200px] text-[#3b82f6] font-semibold">Tên món</th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">Danh mục</th>
                            <th className="p-3 text-left w-[100px] text-[#3b82f6] font-semibold">Giá</th>
                            <th className="p-3 text-left w-[140px] text-[#3b82f6] font-semibold">Trạng thái</th>
                            <th className="p-3 text-center w-[160px] text-[#3b82f6] font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((i) => {
                            const disabled = !isCategoryActive(i.category); // danh mục ẩn
                            return (
                                <tr
                                    key={i.id}
                                    className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition ${disabled ? "opacity-50" : ""}`}
                                >
                                    <td className="p-3">{i.id}</td>
                                    <td className="p-3 font-medium">{i.name}</td>
                                    <td className="p-3">{i.category}</td>
                                    <td className="p-3">{i.price.toLocaleString()} ₫</td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={i.active}
                                                onCheckedChange={() => handleToggleStatus(i.id)}
                                                disabled={disabled}
                                            />
                                            <span className={`font-medium ${i.active ? "text-green-500" : "text-red-500"}`}>
                                                {i.active ? "Còn" : "Ngưng"}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-3 flex justify-center items-center gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button disabled={disabled} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]" title="Xem chi tiết">
                                                    <Eye className="w-5 h-5 text-[#3b82f6]" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-[#3b82f6] text-xl">Thông tin món {i.id}</DialogTitle>
                                                </DialogHeader>
                                                <div className="mt-4 space-y-2 text-sm">
                                                    <p><b>Tên:</b> {i.name}</p>
                                                    <p><b>Danh mục:</b> {i.category}</p>
                                                    <p><b>Giá:</b> {i.price.toLocaleString()} ₫</p>
                                                    <p><b>Trạng thái:</b> {i.active ? "Còn" : "Ngưng"}</p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <button onClick={() => handleEdit(i.id)} disabled={disabled} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]" title="Sửa">
                                            <Pencil className="w-5 h-5 text-[#10b981]" />
                                        </button>

                                        <Dialog open={openDialogId === i.id} onOpenChange={(open) => setOpenDialogId(open ? i.id : null)}>
                                            <DialogTrigger asChild>
                                                <button disabled={disabled} className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a]" title="Xóa">
                                                    <Trash2 className="w-5 h-5 text-red-500" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-red-500 text-lg">Xóa món {i.name}?</DialogTitle>
                                                </DialogHeader>
                                                <DialogFooter className="flex justify-end gap-2">
                                                    <Button variant="outline" onClick={() => { toast.info("Đã hủy thao tác."); setOpenDialogId(null); }}>Hủy</Button>
                                                    <Button variant="destructive" onClick={() => handleDelete(i.id)}>Xóa</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>

            {/* Pagination */}
            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
}
