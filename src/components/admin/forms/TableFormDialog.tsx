"use client";

import { useState, useEffect } from "react";
import { Armchair } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { TableService, CreateTableData, UpdateTableData } from "@/api/tables/table.service";
import { Table } from "@/model/Table";
import { AdminFormField, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

interface TableFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    table?: Table | null;
}

export default function TableFormDialog({ open, onOpenChange, onSuccess, table }: TableFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        capacity: 4,
        status: "available" as "available" | "occupied" | "reserved",
    });

    useEffect(() => {
        if (table && open) {
            setFormData({
                name: table.name,
                capacity: table.capacity,
                status: table.status,
            });
        } else if (!table && open) {
            setFormData({
                name: "",
                capacity: 4,
                status: "available",
            });
        }
    }, [table, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên bàn");
            return;
        }

        setLoading(true);
        try {
            if (table) {
                const updateData: UpdateTableData = {
                    name: formData.name,
                    capacity: formData.capacity,
                    status: formData.status,
                };
                await TableService.updateTable(table.id, updateData);
                toast.success("Cập nhật bàn thành công!");
            } else {
                const createData: CreateTableData = {
                    name: formData.name,
                    capacity: formData.capacity,
                    status: formData.status,
                };
                await TableService.createTable(createData);
                toast.success("Thêm bàn thành công!");
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi lưu bàn:", error);
            const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[800px] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {table ? "Cập nhật bàn" : "Thêm bàn mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cột Trái: Form Inputs */}
                            <div className="space-y-4">
                                <AdminFormField label="Tên bàn" required>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a]")}
                                        placeholder="Nhập tên bàn (VD: Bàn 10)"
                                        required
                                    />
                                </AdminFormField>

                                <AdminFormField label="Sức chứa (người)" required>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 4 })}
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a]")}
                                        min="1"
                                        max="50"
                                        required
                                    />
                                </AdminFormField>

                                <AdminFormField label="Trạng thái" required>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a] appearance-none")}
                                        required
                                    >
                                        <option value="available">Trống</option>
                                        <option value="occupied">Đang dùng</option>
                                        <option value="reserved">Đã đặt</option>
                                    </select>
                                </AdminFormField>
                            </div>

                            {/* Cột Phải: Minh họa */}
                            <div className="hidden md:flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <Armchair className="w-32 h-32 text-gray-300 dark:text-gray-600 mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-center">
                                    Hình ảnh mô phỏng bàn
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                            {loading ? "Đang lưu..." : table ? "Lưu thay đổi" : "Tạo bàn"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
