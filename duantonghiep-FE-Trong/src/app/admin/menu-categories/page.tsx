"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Pagination } from "@/components/admin/pagination/Pagination";

export default function MenuCategoriesPage() {
    const [categories, setCategories] = useState([
        { id: "CT001", name: "Khai vị", active: true },
        { id: "CT002", name: "Món chính", active: true },
        { id: "CT003", name: "Tráng miệng", active: false },
    ]);

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const itemsPerPage = 10;

    // Load categories từ localStorage khi mount
    useEffect(() => {
        const savedCategories = localStorage.getItem("categories");
        if (savedCategories) setCategories(JSON.parse(savedCategories));
    }, []);

    const filteredCategories = useMemo(
        () => categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
        [categories, search]
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

    const handleToggleStatus = (id: string) => {
        setCategories(prev => {
            const newCats = prev.map(c => c.id === id ? { ...c, active: !c.active } : c);
            localStorage.setItem("categories", JSON.stringify(newCats)); // lưu trạng thái
            return newCats;
        });

        const cat = categories.find(c => c.id === id);
        if (cat) {
            if (cat.active) toast.error(`Danh mục "${cat.name}" đã ẩn.`);
            else toast.success(`Danh mục "${cat.name}" hiển thị.`);
        }
    };

    const handleDelete = (id: string) => {
        setCategories(prev => {
            const newCats = prev.filter(c => c.id !== id);
            localStorage.setItem("categories", JSON.stringify(newCats));
            return newCats;
        });
        setOpenDialogId(null);
        toast.error("Đã xóa danh mục!");
    };

    return (
        <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-5">Quản lý danh mục món ăn</h2>

            {/* Search */}
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Tìm danh mục..."
                    value={search}
                    onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="flex-1 bg-gray-100 dark:bg-[#2a2a2a] border border-gray-300 dark:border-gray-700 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400 dark:placeholder-gray-500"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                <table className="w-full text-sm min-w-[600px]">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            {["Mã danh mục", "Tên danh mục", "Trạng thái", "Hành động"].map(h => (
                                <th key={h} className="p-3 text-left text-gray-700 dark:text-gray-200 font-semibold">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.map(cat => (
                            <tr key={cat.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition">
                                <td className="p-3">{cat.id}</td>
                                <td className="p-3">{cat.name}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={cat.active}
                                            onCheckedChange={() => handleToggleStatus(cat.id)}
                                        />
                                        <span className={`font-medium ${cat.active ? "text-green-500" : "text-red-500"}`}>
                                            {cat.active ? "Hiển thị" : "Ẩn"}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-3 flex gap-3 items-center">
                                    <Eye
                                        className="w-5 h-5 text-gray-700 dark:text-gray-200 cursor-pointer hover:text-blue-500"
                                        onClick={() => console.log("Xem chi tiết")}
                                    />
                                    <Pencil
                                        className="w-5 h-5 text-blue-500 cursor-pointer hover:text-blue-700"
                                        onClick={() => console.log("Sửa")}
                                    />

                                    <Dialog open={openDialogId === cat.id} onOpenChange={(open) => setOpenDialogId(open ? cat.id : null)}>
                                        <DialogTrigger asChild>
                                            <Trash2
                                                className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                                            />
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader><DialogTitle>Xóa danh mục {cat.name}?</DialogTitle></DialogHeader>
                                            <DialogFooter className="flex justify-end gap-2">
                                                <button className="px-3 py-1 bg-gray-200 dark:bg-[#2a2a2a] rounded-md" onClick={() => setOpenDialogId(null)}>Hủy</button>
                                                <button className="px-3 py-1 bg-red-500 text-white rounded-md" onClick={() => handleDelete(cat.id)}>Xóa</button>
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
