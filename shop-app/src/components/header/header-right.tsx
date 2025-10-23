"use client";

import { ToggleTheme } from "@/components/toggle-theme";
import Link from "next/link";
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
import React, { useState } from "react";
import { UserRoundIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

function formatDateDisplay(selected: Date, today: Date) {
    const getDayKey = (d: Date) => d.toISOString().split("T")[0];
    const todayKey = getDayKey(today);
    const selectedKey = getDayKey(selected);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowKey = getDayKey(tomorrow);

    if (selectedKey === todayKey) {
        return "Hôm nay";
    } else if (selectedKey === tomorrowKey) {
        return "Ngày mai";
    } else {
        return selected.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }
}

export default function HeaderRight() {
    const numberPeople = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ];
    const time = [
        "Cả ngày", 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    ];

    const today = React.useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date>(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    });
    const [month, setMonth] = React.useState<Date>(() => new Date());
    const [selectNumberPeople, setSelectNumberPeople] = useState("1");
    const [selectTime, setSelectTime] = useState("Cả ngày");

    const getTimeLabel = () => {
        if (selectTime === "Cả ngày") {
            return selectTime;
        }
        return `Lúc ${selectTime} giờ`;
    };

    const isTimeDisabled = (num: string | number) => {
        return num === 22 || num === 23;
    };

    return (
        <nav className="flex flex-row-reverse items-center gap-2">
            <div className="mr-2 pr-2 border-r">
                <ToggleTheme />
            </div>

            <Button variant="ghost" className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[var(--co-orage-signature-start)] to-[var(--co-orage-signature-end)] text-white rounded-md shadow-sm hover:shadow-md transition-all hover:from-amber-600 hover:to-orange-600">
                <Link
                    href="/register"
                    className="">
                    Đăng ký
                </Link>
            </Button>

            <Button variant="ghost" className="flex items-center rounded-full transition-all hover:border-2 hover:border-orange-400 px-4 py-2">
                <Link
                    href="/login"
                    className="">
                    Đăng nhập
                </Link>
            </Button>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex items-center rounded-full transition-all hover:border-2 hover:border-orange-400 px-4 py-2"
                        onClick={() => setOpen(true)}
                    >
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
                        selected={date}
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
                        disabled={(date) => date < today}
                    />
                </PopoverContent>
            </Popover>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center rounded-full transition-all hover:border-2 hover:border-orange-400 px-4 py-2" variant={"ghost"}>{getTimeLabel()}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-50">
                    {time.map((num) => {
                        const isDisabled = isTimeDisabled(num);
                        return (
                            <DropdownMenuItem
                                key={num}
                                onSelect={() => {
                                    if (!isDisabled) setSelectTime(num.toString());
                                }}
                                className={
                                    selectTime === num.toString()
                                        ? "bg-accent font-bold"
                                        : isDisabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                }
                                disabled={isDisabled}

                                tabIndex={isDisabled ? -1 : 0}
                                aria-disabled={isDisabled}>
                                {num === "Cả ngày" ? "Cả ngày" : `Lúc ${num} giờ`}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center rounded-full transition-all hover:border-2 hover:border-orange-400 px-4 py-2">
                    {selectNumberPeople} <UserRoundIcon className="ml-2 w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-50">
                    {numberPeople.map((num) => (
                        <DropdownMenuItem
                            key={num}
                            onSelect={() => setSelectNumberPeople(num.toString())}
                            className={
                                selectNumberPeople === num.toString()
                                    ? "bg-accent font-bold"
                                    : ""
                            }>
                            {" "}
                            {num} người
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
}
