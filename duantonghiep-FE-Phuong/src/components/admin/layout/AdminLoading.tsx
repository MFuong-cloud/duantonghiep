import { Loader2 } from "lucide-react";

interface AdminLoadingProps {
    message?: string;
}

export function AdminLoading({ message = "Đang tải dữ liệu..." }: AdminLoadingProps) {
    return (
        <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">{message}</p>
            </div>
        </div>
    );
}
