"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface StatusSelectProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    bookingDate?: string;
}

const statusConfig = {
    0: {
        label: "Chờ xác nhận",
        bgColor: "#fef3c7",
        textColor: "#a16207",
    },
    1: {
        label: "Đã xác nhận",
        bgColor: "#dbeafe",
        textColor: "#1e40af",
    },
    2: {
        label: "Hoàn thành",
        bgColor: "#d1fae5",
        textColor: "#065f46",
    },
    3: {
        label: "Hủy đơn",
        bgColor: "#fee2e2",
        textColor: "#991b1b",
    },
    4: {
        label: "Đã tiếp khách",
        bgColor: "#f3e8ff",
        textColor: "#6b21a8",
    },
};

export function StatusSelect({ value, onChange, disabled, bookingDate }: StatusSelectProps) {
    const currentStatus = statusConfig[value as keyof typeof statusConfig] || statusConfig[0];

    const isBeforeBookingDate = (bookingDate: string | undefined): boolean => {
        if (!bookingDate) return false;
        const booking = new Date(bookingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        booking.setHours(0, 0, 0, 0);
        return booking > today;
    };

    const cannotServeGuest = isBeforeBookingDate(bookingDate);

    // Khi đã tiếp khách (status = 4), disable toàn bộ dropdown
    const hasServedGuest = value === 4;

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="inline-block">
                        <Select
                            value={value.toString()}
                            onValueChange={(val) => onChange(parseInt(val))}
                            disabled={disabled || hasServedGuest}
                        >
                            <SelectTrigger
                                className="border-0 font-medium h-8 text-xs"
                                style={{
                                    backgroundColor: currentStatus.bgColor,
                                    color: currentStatus.textColor,
                                }}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[0, 1, 4, 3, 2].map((key) => {
                                    const statusKey = key.toString();
                                    const config = statusConfig[key as keyof typeof statusConfig];
                                    const isStatusCompleted = key === 2;
                                    const isServeGuestStatus = key === 4;
                                    const isCancelStatus = key === 3;

                                    // Disable "Đã tiếp khách" nếu chưa đến ngày
                                    const cannotServeYet = isServeGuestStatus && cannotServeGuest;

                                    // Disable "Hủy đơn" nếu đã tiếp khách
                                    const cannotCancelAfterServed = isCancelStatus && value === 4;

                                    const shouldDisable = isStatusCompleted || cannotServeYet || cannotCancelAfterServed;

                                    const item = (
                                        <SelectItem
                                            key={statusKey}
                                            value={statusKey}
                                            disabled={shouldDisable}
                                            style={{
                                                color: shouldDisable ? '#9ca3af' : config.textColor,
                                            }}
                                            className={`cursor-pointer font-medium text-xs my-1 ${isStatusCompleted ? 'hidden' : ''} ${shouldDisable && !isStatusCompleted ? 'opacity-50' : ''}`}
                                        >
                                            {config.label}
                                            {isServeGuestStatus && cannotServeGuest && bookingDate && (
                                                <span className="ml-2 text-[10px] text-red-500">
                                                    (Chưa đến ngày: {formatDate(bookingDate)})
                                                </span>
                                            )}
                                            {isCancelStatus && cannotCancelAfterServed && (
                                                <span className="ml-2 text-[10px] text-red-500">
                                                    (Đã tiếp khách)
                                                </span>
                                            )}
                                        </SelectItem>
                                    );

                                    // Tooltip cho "Đã tiếp khách" khi chưa đến ngày
                                    if (isServeGuestStatus && cannotServeGuest && bookingDate) {
                                        return (
                                            <TooltipProvider key={statusKey}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        {item}
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" className="bg-red-50 border-red-200 text-red-800 max-w-xs">
                                                        <p className="font-semibold">⚠️ Chưa thể tiếp khách</p>
                                                        <p className="text-xs mt-1">
                                                            Ngày đặt bàn: <strong>{formatDate(bookingDate)}</strong>
                                                        </p>
                                                        <p className="text-xs">
                                                            Chỉ có thể chuyển sang trạng thái này khi đã đến ngày đặt bàn.
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    }

                                    // Tooltip cho "Hủy đơn" khi đã tiếp khách
                                    if (isCancelStatus && cannotCancelAfterServed) {
                                        return (
                                            <TooltipProvider key={statusKey}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        {item}
                                                    </TooltipTrigger>
                                                    <TooltipContent side="left" className="bg-red-50 border-red-200 text-red-800 max-w-xs">
                                                        <p className="font-semibold">🚫 Không thể hủy đơn</p>
                                                        <p className="text-xs mt-1">
                                                            Đơn hàng đã chuyển sang trạng thái <strong>&quot;Đã tiếp khách&quot;</strong>.
                                                        </p>
                                                        <p className="text-xs">
                                                            Khách hàng đã đến nhà hàng, không thể hủy đơn.
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        );
                                    }

                                    return item;
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                </TooltipTrigger>
                {hasServedGuest && (
                    <TooltipContent side="top" className="bg-purple-50 border-purple-200 text-purple-800 max-w-xs">
                        <p className="font-semibold">🔒 Đã tiếp khách</p>
                        <p className="text-xs mt-1">
                            Không thể thay đổi trạng thái sau khi đã tiếp khách.
                        </p>
                        <p className="text-xs">
                            Trạng thái sẽ tự động chuyển sang &quot;Hoàn thành&quot; khi thanh toán thành công.
                        </p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
}
