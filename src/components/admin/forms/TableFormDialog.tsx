import { useState, useEffect } from "react";
import { Armchair } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

interface FormData {
    name: string;
    capacity: number | "";
    status: "available" | "occupied" | "reserved";
}

export default function TableFormDialog({ open, onOpenChange, onSuccess, table }: TableFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [checkingName, setCheckingName] = useState(false);
    const [nameError, setNameError] = useState("");
    const [formData, setFormData] = useState<FormData>({
        name: "",
        capacity: "",
        status: "available",
    });

    useEffect(() => {
        if (table && open) {
            setFormData({
                name: table.name,
                capacity: table.capacity,
                status: table.status,
            });
            setNameError("");
        } else if (!table && open) {
            setFormData({
                name: "",
                capacity: "",
                status: "available",
            });
            setNameError("");
        }
    }, [table, open]);

    // Kiểm tra tên bàn trùng lặp real-time
    useEffect(() => {
        if (!formData.name.trim() || !open) {
            setNameError("");
            return;
        }

        // Nếu đang sửa và tên không đổi thì không cần kiểm tra
        if (table && formData.name === table.name) {
            setNameError("");
            return;
        }

        const timeoutId = setTimeout(async () => {
            setCheckingName(true);
            try {
                const tables = await TableService.getTables();
                const isDuplicate = tables.some(
                    (t) => t.name.toLowerCase() === formData.name.toLowerCase() && t.id !== table?.id
                );

                if (isDuplicate) {
                    setNameError("Tên bàn đã tồn tại, vui lòng chọn tên khác");
                } else {
                    setNameError("");
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra tên bàn:", error);
            } finally {
                setCheckingName(false);
            }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timeoutId);
    }, [formData.name, table, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập tên bàn");
            return;
        }

        if (nameError) {
            toast.error(nameError);
            return;
        }

        if (formData.capacity === "" || formData.capacity < 1 || formData.capacity > 6) {
            toast.error("Sức chứa bàn phải từ 1 đến 6 người");
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
                toast.success(`Cập nhật bàn "${formData.name}" thành công!`);
            } else {
                const createData: CreateTableData = {
                    name: formData.name,
                    capacity: formData.capacity,
                    status: formData.status,
                };
                await TableService.createTable(createData);
                toast.success(`Thêm bàn "${formData.name}" thành công!`);
            }

            onSuccess();
            onOpenChange(false);
        } catch (error: unknown) {
            // Parse validation errors từ backend
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>; message?: string } } };

                if (axiosError.response?.data?.errors) {
                    const errors = axiosError.response.data.errors;
                    const firstError = Object.values(errors)[0]?.[0];
                    toast.error(firstError || "Có lỗi xảy ra khi lưu bàn");
                } else if (axiosError.response?.data?.message) {
                    toast.error(axiosError.response.data.message);
                } else {
                    toast.error("Có lỗi xảy ra khi lưu bàn");
                }
            } else {
                toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
            }
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
                    <DialogDescription className="sr-only">
                        {table ? "Cập nhật thông tin bàn" : "Thêm bàn mới vào hệ thống"}
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cột Trái: Form Inputs */}
                            <div className="space-y-4">
                                <AdminFormField label="Tên bàn" required>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={cn(
                                                adminInputClass,
                                                "bg-white dark:bg-[#2a2a2a]",
                                                nameError && "border-red-500 focus:border-red-500"
                                            )}
                                            placeholder="Nhập tên bàn (VD: Bàn 10)"
                                            required
                                        />
                                        {checkingName && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                    </div>
                                    {nameError && (
                                        <p className="text-xs text-red-500 mt-1">{nameError}</p>
                                    )}
                                </AdminFormField>

                                <AdminFormField label="Sức chứa (người)" required>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData({ ...formData, capacity: val === "" ? "" : parseInt(val) });
                                        }}
                                        className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a]")}
                                        min="1"
                                        max="6"
                                        required
                                    />
                                </AdminFormField>

                                <AdminFormField label="Trạng thái" required>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value as "available" | "occupied" | "reserved" })}
                                    >
                                        <SelectTrigger className={cn(adminInputClass, "bg-white dark:bg-[#2a2a2a]")}>
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl">
                                            <SelectItem value="available">Trống</SelectItem>
                                            <SelectItem value="occupied">Đang dùng</SelectItem>
                                            <SelectItem value="reserved">Đã đặt</SelectItem>
                                        </SelectContent>
                                    </Select>
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
