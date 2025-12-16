"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, User as UserIcon, Mail, Phone, Lock, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    const [isDragging, setIsDragging] = useState(false);
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
            if (user.avatar_url) {
                setImagePreview(user.avatar_url);
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
            processImageFile(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const processImageFile = (file: File) => {
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
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processImageFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error("Vui lòng nhập họ và tên");
            return;
        }

        if (!formData.phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }

        if (!/^[0-9]{10,11}$/.test(formData.phone)) {
            toast.error("Số điện thoại phải có 10-11 chữ số");
            return;
        }

        if (!formData.role) {
            toast.error("Vui lòng chọn vai trò");
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
                toast.success(`Cập nhật người dùng "${formData.name}" thành công!`);
            } else {
                const createData: CreateUserData = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    phone: formData.phone,
                    avatar: imageFile,
                };

                console.log('Creating user with data:', {
                    ...createData,
                    avatar: imageFile ? `File: ${imageFile.name} (${imageFile.size} bytes)` : 'No file',
                });

                await UserService.createUser(createData);
                toast.success(`Thêm người dùng "${formData.name}" thành công!`);
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
                                <div
                                    className="relative group cursor-pointer"
                                    onDragEnter={handleDragEnter}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <div className={cn(
                                        "w-32 h-32 rounded-full overflow-hidden border-4 shadow-sm transition-colors",
                                        isDragging
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-gray-100 dark:border-gray-700"
                                    )}>
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
                                        className={cn(
                                            "absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer",
                                            isDragging ? "bg-blue-500/60" : "bg-black/40"
                                        )}
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
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Vui lòng nhập họ và tên')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
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
                                            onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Vui lòng nhập email hợp lệ')}
                                            onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
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
                                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Vui lòng nhập mật khẩu')}
                                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                                className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                                placeholder={user ? "Để trống nếu không đổi" : "Nhập mật khẩu"}
                                                required={!user}
                                            />
                                        </div>
                                    </AdminFormField>

                                    <AdminFormField label="Số điện thoại" required>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity('Vui lòng nhập số điện thoại')}
                                                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity('')}
                                                pattern="[0-9]{10,11}"
                                                className={cn(adminInputClass, "pl-9 bg-white dark:bg-[#2a2a2a]")}
                                                placeholder="0912345678"
                                                required
                                            />
                                        </div>
                                    </AdminFormField>
                                </div>

                                <AdminFormField label="Vai trò" required>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    type="button"
                                                    className={cn(
                                                        adminInputClass,
                                                        "pl-9 pr-10 bg-white dark:bg-[#2a2a2a] rounded-xl cursor-pointer text-left flex items-center justify-between"
                                                    )}
                                                >
                                                    <span>
                                                        {formData.role === 'customer' && 'Khách hàng (Customer)'}
                                                        {formData.role === 'employee' && 'Nhân viên (Employee)'}
                                                        {formData.role === 'manager' && 'Quản lý (Manager)'}
                                                        {formData.role === 'owner' && 'Chủ cửa hàng (Owner)'}
                                                    </span>
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className="rounded-xl bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 shadow-lg p-1"
                                                style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
                                            >
                                                <DropdownMenuItem
                                                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                                                    className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 focus:bg-blue-100 dark:focus:bg-blue-900/30 rounded-lg px-3 py-2"
                                                >
                                                    Khách hàng (Customer)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setFormData({ ...formData, role: 'employee' })}
                                                    className="cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 focus:bg-green-100 dark:focus:bg-green-900/30 rounded-lg px-3 py-2"
                                                >
                                                    Nhân viên (Employee)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setFormData({ ...formData, role: 'manager' })}
                                                    className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:bg-purple-100 dark:focus:bg-purple-900/30 rounded-lg px-3 py-2"
                                                >
                                                    Quản lý (Manager)
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setFormData({ ...formData, role: 'owner' })}
                                                    className="cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 focus:bg-amber-100 dark:focus:bg-amber-900/30 rounded-lg px-3 py-2"
                                                >
                                                    Chủ cửa hàng (Owner)
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
