"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    value?: string | File | null;
    onChange: (file: File | null) => void;
    currentImageUrl?: string | null;
}

export default function ImageUpload({ value, onChange, currentImageUrl }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (value instanceof File) {
            const objectUrl = URL.createObjectURL(value);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (typeof value === "string") {
            setPreview(getImageUrl(value));
        } else if (currentImageUrl) {
            setPreview(getImageUrl(currentImageUrl));
        } else {
            setPreview(null);
        }
    }, [value, currentImageUrl]);

    const getImageUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http") || path.startsWith("blob")) return path;

        // Xử lý path ảnh từ storage Laravel
        if (path.startsWith("storage/")) {
            return `http://127.0.0.1:8000/${path}`;
        }

        const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL || "http://127.0.0.1:8000/storage";
        return `${baseUrl}/${path}`;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChange(file);
        }
    };

    const handleRemove = () => {
        onChange(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-4">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-32 h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden
                        ${preview ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"}
                    `}
                >
                    {preview ? (
                        <>
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white text-xs font-medium">Thay đổi</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-2">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <span className="text-xs text-gray-500 block">Tải ảnh lên</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <div className="text-sm text-gray-500">
                        <p>Chấp nhận: JPG, PNG, GIF</p>
                        <p>Kích thước tối đa: 2MB</p>
                    </div>
                    {preview && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={handleRemove}
                            className="flex items-center gap-1 h-8"
                        >
                            <X className="w-4 h-4" />
                            Xóa ảnh
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
