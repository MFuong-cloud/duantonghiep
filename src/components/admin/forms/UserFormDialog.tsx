"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload, User as UserIcon, Mail, Phone, Lock, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UserService, CreateUserData, UpdateUserData } from "@/api/users/user.service";
import { User } from "@/model/User";
import { AdminFormField, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

interface UserFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    user?: User | null;
}

export default function UserFormDialog({ open, onOpenChange, onSuccess, user }: UserFormDialogProps) {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
        phone: "",
    });

    useEffect(() => {
        if (user && open) {
            setFormData({
                name: user.name,
                email: user.email,
                password: "", // Không hiển thị password cũ
                role: user.role,
                phone: user.phone || "",
            });
            if (user.avatar) {
                setImagePreview(user.avatar);
            }
        } else if (!user && open) {
            setFormData({
                name: "",
                email: "",
                password: "",
                role: "customer",
                phone: "",
            });
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }, [user, open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                toast.error("Vui lòng chọn file ảnh");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Kích thước ảnh không được vượt quá 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập họ và tên");
            return;
        }

        if (!user && !formData.password) {
            toast.error("Vui lòng nhập mật khẩu");
            return;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Email không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            const imageFile = fileInputRef.current?.files?.[0] || null;

            if (user) {
                const updateData: UpdateUserData = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    phone: formData.phone,
                };

                if (formData.password) {
                    updateData.password = formData.password;
                }

                if (imageFile) {
                    updateData.avatar = imageFile;
                }

                await UserService.updateUser(user.id, updateData);
                toast.success("Cập nhật người dùng thành công!");
            } else {
                const createData: CreateUserData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    phone: formData.phone,
                    avatar: imageFile,
                };

                await UserService.createUser(createData);
                toast.success("Thêm người dùng thành công!");
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error("Lỗi khi lưu người dùng:", error);
            const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[800px] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl max-h-[95vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {user ? "Cập nhật người dùng" : "Thêm người dùng mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Avatar Column */}
                            <div className="md:col-span-1 flex flex-col items-center space-y-4">
                                <div className="relative group cursor-pointer">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-700 shadow-sm">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 dark:bg-[#2a2a2a] flex items-center justify-center text-gray-400">
                                                <UserIcon className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                                    >
                                        <Upload className="w-6 h-6" />
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleRemoveImage}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                    >
                                        Xóa ảnh
                                    </Button>
                                )}
                                <p className="text-xs text-center text-gray-500">
                                    Cho phép: JPG, PNG, GIF<br />Tối đa 5MB
                                </p>
                            </div>

                            {/* Form Fields Column */}
                            <div className="md:col-span-2 space-y-4">
                                <AdminFormField label="Họ và tên" required>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                            placeholder="Nhập họ tên"
                                            required
                                        />
                                    </div>
                                </AdminFormField>

                                <AdminFormField label="Email">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                            placeholder="example@email.com (không bắt buộc)"
                                        />
                                    </div>
                                </AdminFormField>

                                <div className="grid grid-cols-2 gap-4">
                                    <AdminFormField label="Mật khẩu" required={!user}>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                                placeholder={user ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                                                required={!user}
                                            />
                                        </div>
                                    </AdminFormField>

                                    <AdminFormField label="Số điện thoại">
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                                placeholder="0912..."
                                            />
                                        </div>
                                    </AdminFormField>
                                </div>

                                <AdminFormField label="Vai trò" required>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a] appearance-none")}
                                        >
                                            <option value="customer">Khách hàng (Customer)</option>
                                            <option value="employee">Nhân viên (Employee)</option>
                                            <option value="manager">Quản lý (Manager)</option>
                                            <option value="owner">Chủ cửa hàng (Owner)</option>
                                        </select>
                                    </div>
                                </AdminFormField>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                            {loading ? "Đang lưu..." : user ? "Lưu thay đổi" : "Thêm người dùng"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
