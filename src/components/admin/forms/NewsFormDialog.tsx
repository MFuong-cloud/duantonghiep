"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/admin/forms/ImageUpload";
import { AdminNewsService } from "@/api/news/news.service";
import { News } from "@/model/News";
import { toast } from "sonner";
import "react-quill-new/dist/quill.snow.css";


const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const newsSchema = z.object({
    title: z.string().min(1, "Vui lòng nhập tiêu đề").max(255, "Tiêu đề quá dài"),
    content: z.string().min(1, "Vui lòng nhập nội dung"),
    is_active: z.boolean(),
    image: z.any().optional(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    newsToEdit?: News | null;
}

export default function NewsFormDialog({
    open,
    onOpenChange,
    onSuccess,
    newsToEdit,
}: NewsFormDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            title: "",
            content: "",
            is_active: true,
        },
    });




    useEffect(() => {
        if (open) {
            if (newsToEdit) {
                reset({
                    title: newsToEdit.title,
                    content: newsToEdit.content,
                    is_active: newsToEdit.is_active,
                });
                setImageFile(null);
            } else {
                reset({
                    title: "",
                    content: "",
                    is_active: true,
                });
                setImageFile(null);
            }
        }
    }, [open, newsToEdit, reset]);

    const onSubmit = async (data: NewsFormValues) => {
        try {
            setIsSubmitting(true);

            setIsSubmitting(true);
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", data.content);
            formData.append("is_active", data.is_active ? "1" : "0");

            if (imageFile) {
                formData.append("image", imageFile);
            }

            if (newsToEdit) {
                formData.append("_method", "PUT");
                await AdminNewsService.update(newsToEdit.id, formData);
                toast.success("Cập nhật tin tức thành công!");
            } else {
                await AdminNewsService.create(formData);
                toast.success("Thêm tin tức thành công!");
            }

            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error("Lỗi khi lưu tin tức:", error);
            const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // React Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl h-[95vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {newsToEdit ? "Cập nhật tin tức" : "Thêm tin tức mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                            {/* Cột trái: Thông tin cơ bản (chiếm 1 phần) */}
                            <div className="lg:col-span-1 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Tiêu đề <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Nhập tiêu đề tin tức..."
                                        {...register("title")}
                                        className={errors.title ? "border-red-500" : ""}
                                    />
                                    {errors.title && (
                                        <p className="text-xs text-red-500">{errors.title.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Hình ảnh</Label>
                                    <div className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800/50">
                                        <ImageUpload
                                            value={imageFile}
                                            onChange={(file) => setImageFile(file)}
                                            currentImageUrl={newsToEdit?.image}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2 border-t mt-4">
                                    <Controller
                                        control={control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <Switch
                                                id="is_active"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label htmlFor="is_active">Hiển thị tin tức này</Label>
                                </div>
                            </div>

                            {/* Cột phải: Nội dung Rich Text (chiếm 2 phần) */}
                            <div className="lg:col-span-2 space-y-2 h-full flex flex-col min-h-[500px]">
                                <Label htmlFor="content">
                                    Nội dung <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col bg-white text-black">
                                    <Controller
                                        control={control}
                                        name="content"
                                        render={({ field }) => (
                                            <ReactQuill
                                                theme="snow"
                                                value={field.value}
                                                onChange={field.onChange}
                                                modules={quillModules}
                                                className="h-full flex flex-col"
                                            />
                                        )}
                                    />
                                </div>
                                {errors.content && (
                                    <p className="text-xs text-red-500">{errors.content.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="px-6 h-11 text-base"
                        >
                            Hủy bỏ
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 text-base font-semibold"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang xử lý..." : newsToEdit ? "Cập nhật" : "Thêm mới"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
            {/* Styles to fix Quill height issues */}
            <style jsx global>{`
                .quill {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                .ql-container {
                    flex: 1;
                    overflow-y: auto;
                    font-size: 16px;
                }
                .ql-editor {
                    min-height: 200px;
                }
                .ql-toolbar {
                    background-color: #f8f9fa;
                    border-bottom: 1px solid #e2e8f0 !important;
                }
            `}</style>
        </Dialog>
    );
}
