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
        label: "Đã hủy",
        bgColor: "#fee2e2",
        textColor: "#991b1b",
    },
};

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
    const currentStatus = statusConfig[value as keyof typeof statusConfig];

    return (
        <Select
            value={value.toString()}
            onValueChange={(val) => onChange(parseInt(val))}
            disabled={disabled}
        >
            <SelectTrigger
                className="border-0"
                style={{
                    backgroundColor: currentStatus.bgColor,
                    color: currentStatus.textColor,
                }}
            >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem
                        key={key}
                        value={key}
                        style={{
                            backgroundColor: config.bgColor,
                            color: config.textColor,
                        }}
                    >
                        {config.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
