"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
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
        bgColor: "#f3e8ff", // purple-100
        textColor: "#6b21a8", // purple-800
    },
};

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
    const currentStatus = statusConfig[value as keyof typeof statusConfig] || statusConfig[0];

    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onChange(parseInt(val))}
            disabled={disabled}
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
                {[0, 1, 4, 3, 2].map((key) => { // 0->1->4->3->2 (2 hidden)
                    const statusKey = key.toString();
                    const config = statusConfig[key as keyof typeof statusConfig];
                    const isStatusCompleted = key === 2; // Status 2: Hoàn thành

                    return (
                        <SelectItem
                            key={statusKey}
                            value={statusKey}
                            disabled={isStatusCompleted}
                            style={{
                                color: config.textColor,
                            }}
                            className={`cursor-pointer font-medium text-xs my-1 ${isStatusCompleted ? 'hidden' : ''}`}
                        >
                            {config.label}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
