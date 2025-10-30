"use client";

import { ToggleTheme } from "@/components/toggle-theme";
import { useBooking } from "@/contexts/BookingContext";
import Link from "next/link";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    UserRoundIcon,
    CalendarDays,
    Clock3,
    LogIn,
    UserPlus,
} from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

function formatDateDisplay(selected: Date | null, today: Date) {
    if (!selected) return "Chọn ngày";
    const getKey = (d: Date) => d.toISOString().split("T")[0];
    const todayKey = getKey(today);
    const selectedKey = getKey(selected);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (selectedKey === todayKey) return "Hôm nay";
    if (selectedKey === getKey(tomorrow)) return "Ngày mai";
    return selected.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function HeaderRight() {
    const numberPeople = Array.from({ length: 18 }, (_, i) => i + 1);
    const time = ["Cả ngày", 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    const today = React.useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const [open, setOpen] = React.useState(false);
    const [month, setMonth] = React.useState<Date>(() => new Date());

    const {
        date,
        setDate,
        time: selectTime,
        setTime,
        guests: selectGuests,
        setGuests,
    } = useBooking();

    const getTimeLabel = () => {
        if (selectTime === "Cả ngày") return "Cả ngày";
        return selectTime ? `Lúc ${selectTime} giờ` : "Chọn giờ";
    };

    const isTimeDisabled = (num: string | number) => num === 22 || num === 23;

    return (
        <TooltipProvider delayDuration={100}>
            {/* Dùng grid để chia các vùng rõ ràng */}
            <nav
                className="
                    flex items-center justify-end 
                    gap-6
                    border-l border-gray-200 dark:border-gray-700
                    pl-6
                "
            >
                {/* 🕹 Nhóm chọn thông tin booking */}
                <div className="flex items-center gap-3 border-r border-gray-300 dark:border-gray-700 pr-6">
                    {/* 📅 Ngày */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center rounded-full hover:border-2 hover:border-orange-400 px-4 py-2 transition-all"
                                    >
                                        <CalendarDays className="mr-2 w-4 h-4" />
                                        {formatDateDisplay(date, today)}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto overflow-hidden p-0"
                                    align="end"
                                    alignOffset={-8}
                                    sideOffset={10}
                                >
                                    <Calendar
                                        mode="single"
                                        selected={date ?? undefined}
                                        captionLayout="dropdown"
                                        month={month}
                                        onMonthChange={setMonth}
                                        onSelect={(selectedDate) => {
                                            if (!selectedDate) return;
                                            const newDate = new Date(selectedDate);
                                            newDate.setHours(0, 0, 0, 0);
                                            if (newDate >= today) {
                                                setDate(newDate);
                                                setMonth(newDate);
                                                setOpen(false);
                                            }
                                        }}
                                        disabled={(d) => d < today}
                                    />
                                </PopoverContent>
                            </Popover>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Chọn ngày đặt bàn</TooltipContent>
                    </Tooltip>

                    {/* 🕒 Giờ */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="flex items-center rounded-full hover:border-2 hover:border-orange-400 px-4 py-2 transition-all"
                                        variant="ghost"
                                    >
                                        <Clock3 className="w-4 h-4 mr-2" />
                                        {getTimeLabel()}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                    {time.map((num) => {
                                        const isDisabled = isTimeDisabled(num);
                                        return (
                                            <DropdownMenuItem
                                                key={num}
                                                onSelect={() => {
                                                    if (!isDisabled) setTime(num.toString());
                                                }}
                                                disabled={isDisabled}
                                                className={
                                                    selectTime === num.toString()
                                                        ? "bg-accent font-bold"
                                                        : isDisabled
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                }
                                            >
                                                {num === "Cả ngày" ? "Cả ngày" : `Lúc ${num} giờ`}
                                            </DropdownMenuItem>
                                        );
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Chọn giờ dùng bữa</TooltipContent>
                    </Tooltip>

                    {/* 👥 Số khách */}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="flex items-center rounded-full hover:border-2 hover:border-orange-400 px-4 py-2 transition-all"
                                    >
                                        {selectGuests}{" "}
                                        <UserRoundIcon className="ml-2 w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="max-h-60 overflow-y-auto">
                                    {numberPeople.map((num) => (
                                        <DropdownMenuItem
                                            key={num}
                                            onSelect={() => setGuests(num.toString())}
                                            className={
                                                selectGuests === num.toString()
                                                    ? "bg-accent font-bold"
                                                    : ""
                                            }
                                        >
                                            {num} người
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Chọn số lượng khách</TooltipContent>
                    </Tooltip>
                </div>

                {/* 🔑 Nhóm đăng nhập / đăng ký */}
                <div className="flex items-center gap-3 border-r border-gray-300 dark:border-gray-700 pr-6">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="flex items-center rounded-full hover:border-2 hover:border-orange-400 transition-all px-4 py-2"
                            >
                                <LogIn className="w-4 h-4 mr-2" />
                                <Link href="/login">Đăng nhập</Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Đăng nhập tài khoản</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md shadow-sm hover:shadow-md transition-all hover:from-amber-600 hover:to-orange-600"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                <Link href="/register">Đăng ký</Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Tạo tài khoản mới</TooltipContent>
                    </Tooltip>
                </div>

                {/* 🌗 Đổi theme */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>
                            <ToggleTheme />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Đổi giao diện sáng / tối
                    </TooltipContent>
                </Tooltip>
            </nav>
        </TooltipProvider>
    );
}
