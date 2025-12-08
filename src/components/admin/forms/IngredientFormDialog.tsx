"use client";

import { useState, useEffect } from "react";
import { Leaf, Scale } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { IngredientService, CreateIngredientData, UpdateIngredientData } from "@/api/ingredients/ingredient.service";
import { Ingredient } from "@/model/Ingredient";
import { AdminFormField, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

interface IngredientFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    ingredient?: Ingredient | null;
}

export default function IngredientFormDialog({ open, onOpenChange, onSuccess, ingredient }: IngredientFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        unit: "",
        active: true,
    });

    useEffect(() => {
        if (ingredient && open) {
            setFormData({
                name: ingredient.name,
                unit: ingredient.unit,
                active: ingredient.active,
            });
        } else if (!ingredient && open) {
            setFormData({
                name: "",
                unit: "",
                active: true,
            });
        }
    }, [ingredient, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.unit) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
            return;
        }

        setLoading(true);
        try {
            if (ingredient) {
                const updateData: UpdateIngredientData = {
                    name: formData.name,
                    unit: formData.unit,
                    active: formData.active,
                };
                await IngredientService.updateIngredient(ingredient.id, updateData);
                toast.success(`Cập nhật nguyên liệu "${formData.name}" thành công!`);
            } else {
                const createData: CreateIngredientData = {
                    name: formData.name,
                    unit: formData.unit,
                    active: formData.active,
                };
                await IngredientService.createIngredient(createData);
                toast.success(`Thêm nguyên liệu "${formData.name}" thành công!`);
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi lưu nguyên liệu:", error);
            const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[500px] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {ingredient ? "Cập nhật nguyên liệu" : "Thêm nguyên liệu mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 space-y-4">
                        <AdminFormField label="Tên nguyên liệu" required>
                            <div className="relative">
                                <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                    placeholder="Ví dụ: Thịt bò, Hành tây..."
                                    required
                                />
                            </div>
                        </AdminFormField>

                        <AdminFormField label="Đơn vị tính" required>
                            <div className="relative">
                                <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                    placeholder="Ví dụ: Kg, Gram, Lít..."
                                    required
                                />
                            </div>
                        </AdminFormField>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl border border-gray-100 dark:border-gray-700">
                            <div>
                                <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Trạng thái</span>
                                <span className="text-sm text-gray-500">Kích hoạt nguyên liệu này</span>
                            </div>
                            <Switch
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                            {loading ? "Đang lưu..." : ingredient ? "Lưu thay đổi" : "Thêm nguyên liệu"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
