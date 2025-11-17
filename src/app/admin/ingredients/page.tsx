"use client";

import { useState, useMemo, useEffect } from "react";
import { Eye, Pencil, Trash2, PlusCircle, Search, Leaf } from "lucide-react";
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

export default function IngredientsManagement() {
    const [ingredients, setIngredients] = useState(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("ingredientsData");
            return saved
                ? JSON.parse(saved)
                : [
                    { id: "NL001", name: "Thịt bò", unit: "Kg", active: true },
                    { id: "NL002", name: "Hành lá", unit: "Gram", active: true },
                    { id: "NL003", name: "Ớt tươi", unit: "Trái", active: false },
                ];
        }
        return [];
    });

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialogId, setOpenDialogId] = useState<string | null>(null);
    const itemsPerPage = 8;

    useEffect(() => {
        localStorage.setItem("ingredientsData", JSON.stringify(ingredients));
    }, [ingredients]);

    const filteredIngredients = useMemo(() => {
        return ingredients.filter((i) =>
            i.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [ingredients, search]);

    const totalPages = Math.ceil(filteredIngredients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentIngredients = filteredIngredients.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const handleToggleStatus = (id: string) => {
        setIngredients((prev) =>
            prev.map((i) => (i.id === id ? { ...i, active: !i.active } : i))
        );

        const ing = ingredients.find((i) => i.id === id);
        if (ing) {
            const newStatus = ing.active ? "Ẩn" : "Hiển thị";
            toast.success(`Nguyên liệu "${ing.name}" đã chuyển sang ${newStatus}.`);
        }
    };

    const handleAdd = () => toast.info("Form thêm nguyên liệu sắp có 🚀");
    const handleEdit = (id: string) =>
        toast.info(`Sửa nguyên liệu ${id} đang được phát triển ✏️`);
    const handleDelete = (id: string) => {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
        setOpenDialogId(null);
        toast.success("Đã xóa nguyên liệu thành công!");
    };

    return (
        <div className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* Header */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
                <h2 className="text-2xl font-bold text-[#3b82f6] flex items-center gap-2">
                    <Leaf className="w-6 h-6 text-[#3b82f6]" />
                    Quản lý nguyên liệu
                </h2>
                <Button
                    onClick={handleAdd}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
                >
                    <PlusCircle className="w-4 h-4" /> Thêm nguyên liệu
                </Button>
            </div>

            {/* Search */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên nguyên liệu..."
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
                <table className="min-w-[800px] w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-[#2a2a2a]">
                        <tr>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">
                                Mã NL
                            </th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">
                                Tên nguyên liệu
                            </th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">
                                Đơn vị
                            </th>
                            <th className="p-3 text-left text-[#3b82f6] font-semibold">
                                Trạng thái
                            </th>
                            <th className="p-3 text-center text-[#3b82f6] font-semibold w-[150px]">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentIngredients.map((i) => (
                            <tr
                                key={i.id}
                                className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition ${!i.active ? "opacity-50" : ""
                                    }`}
                            >
                                <td className="p-3">{i.id}</td>
                                <td className="p-3 font-medium">{i.name}</td>
                                <td className="p-3">{i.unit}</td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={i.active}
                                            onCheckedChange={() => handleToggleStatus(i.id)}
                                        />
                                        <span
                                            className={`font-medium ${i.active ? "text-green-500" : "text-red-500"
                                                }`}
                                        >
                                            {i.active ? "Hiển thị" : "Ẩn"}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-3 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* Xem chi tiết */}
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button
                                                    disabled={!i.active}
                                                    className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-5 h-5 text-[#3b82f6]" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-[#3b82f6] text-xl">
                                                        Thông tin nguyên liệu {i.id}
                                                    </DialogTitle>
                                                </DialogHeader>
                                                <div className="mt-4 space-y-2 text-sm">
                                                    <p>
                                                        <b>Tên:</b> {i.name}
                                                    </p>
                                                    <p>
                                                        <b>Đơn vị:</b> {i.unit}
                                                    </p>
                                                    <p>
                                                        <b>Trạng thái:</b>{" "}
                                                        {i.active ? "Hiển thị" : "Ẩn"}
                                                    </p>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {/* Sửa */}
                                        <button
                                            disabled={!i.active}
                                            onClick={() => handleEdit(i.id)}
                                            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#333]"
                                            title="Sửa"
                                        >
                                            <Pencil className="w-5 h-5 text-[#10b981]" />
                                        </button>

                                        {/* Xóa */}
                                        <Dialog
                                            open={openDialogId === i.id}
                                            onOpenChange={(open) =>
                                                setOpenDialogId(open ? i.id : null)
                                            }
                                        >
                                            <DialogTrigger asChild>
                                                <button
                                                    disabled={!i.active}
                                                    className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-[#3a0a0a]"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-5 h-5 text-red-500" />
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg">
                                                <DialogHeader>
                                                    <DialogTitle className="text-red-500 text-lg">
                                                        Xóa nguyên liệu {i.name}?
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
                                                        onClick={() => handleDelete(i.id)}
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

            {/* Pagination */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}
