"use client";

import { ToggleTheme } from "@/components/toggle-theme";
import { useBooking } from "@/contexts/BookingContext";

import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import { UserRoundIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {useAuth} from "@/api/auth/AuthContext";

function formatDateDisplay(selected: Date | null, today: Date) {
    if (!selected) return "Chọn ngày";
    const getDayKey = (d: Date) => d.toISOString().split("T")[0];
    const todayKey = getDayKey(today);
    const selectedKey = getDayKey(selected);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowKey = getDayKey(tomorrow);

    if (selectedKey === todayKey) return "Hôm nay";
    if (selectedKey === tomorrowKey) return "Ngày mai";
    return selected.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function HeaderRight() {
    const numberPeople = Array.from({ length: 18 }, (_, i) => i + 1);
    const time = [
        "Cả ngày", 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    ];

    const today = React.useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const [open, setOpen] = React.useState(false);
    const [month, setMonth] = React.useState<Date>(() => new Date());
    const { isLogin } = useAuth();

    const { date, setDate, time: selectTime, setTime, guests: selectNumberPeople, setGuests } = useBooking();

    const getTimeLabel = () => {
        if (selectTime === "Cả ngày") return selectTime;
        return `Lúc ${selectTime} giờ`;
    };

    const isTimeDisabled = (num: string | number) => num === 22 || num === 23;

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        window.dispatchEvent(new Event('auth-change'));
        window.location.reload();
    };

    return (
        <nav className="flex flex-row-reverse items-center gap-2">
            <div className="mr-2 pr-2 border-r">
                <ToggleTheme />
            </div>

            {isLogin ? (
                // Nếu đã đăng nhập
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Open</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                Profile
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Billing
                                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Settings
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Keyboard shortcuts
                                <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Email</DropdownMenuItem>
                                        <DropdownMenuItem>Message</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>More...</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem>
                                New Team
                                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>GitHub</DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuItem disabled>API</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} >
                            Log out
                            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                // Nếu chưa đăng nhập
                <>
                    <Button
                        variant="ghost"
                        className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[var(--co-orage-signature-start)] to-[var(--co-orage-signature-end)] text-white rounded-md shadow-sm hover:shadow-md transition-all hover:from-amber-600 hover:to-orange-600"
                    >
                        <Link href="/register">Đăng ký</Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="flex items-center rounded-full transition-all hover:border-2 hover:border-orange-400 px-4 py-2"
                    >
                        <Link href="/login">Đăng nhập</Link>
                    </Button>
                </>
            )}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className="flex items-center rounded-full transition-all hover:border-2 hover:border-orange-400 px-4 py-2"
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
                        disabled={(date) => date < today}
                    />
                </PopoverContent>
            </Popover>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center rounded-full transition-all hover:border-2 hover:border-orange-400 px-4 py-2" variant={"ghost"}>
                        {getTimeLabel()}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="max-h-50">
                    {time.map((num) => {
                        const isDisabled = isTimeDisabled(num);
                        return (
                            <DropdownMenuItem
                                key={num}
                                onSelect={() => {
                                    if (!isDisabled) setTime(num.toString());
                                }}
                                className={
                                    selectTime === num.toString()
                                        ? "bg-accent font-bold"
                                        : isDisabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                }
                                disabled={isDisabled}
                            >
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
                            onSelect={() => setGuests(num.toString())}
                            className={
                                selectNumberPeople === num.toString()
                                    ? "bg-accent font-bold"
                                    : ""
                            }
                        >
                            {num} người
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </nav>
    );
}
