"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRoundIcon, CheckCircle2, Loader2 } from "lucide-react";

import { ToggleTheme } from "@/components/toggle-theme";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/api/auth/AuthContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";

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

type DialogStatus = "processing" | "success";

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
    const [logoutDialogState, setLogoutDialogState] = React.useState<{
        open: boolean;
        status: DialogStatus;
        title: string;
        description: string;
    }>({
        open: false,
        status: "processing",
        title: "",
        description: "",
    });
    const [shouldRedirectAfterDialog, setShouldRedirectAfterDialog] = React.useState(false);
    const { isLogin } = useAuth();
    const router = useRouter();

    const { date, setDate, time: selectTime, setTime, guests: selectNumberPeople, setGuests } = useBooking();

    const getTimeLabel = () => {
        if (selectTime === "Cả ngày") return selectTime;
        return `Lúc ${selectTime} giờ`;
    };

    const isTimeDisabled = (num: string | number) => num === 22 || num === 23;

    const handleDialogChange = (open: boolean) => {
        if (!open && logoutDialogState.status === "processing") {
            return;
        }
        setLogoutDialogState((prev) => ({ ...prev, open }));
    };

    const handleLogout = () => {
        setLogoutDialogState({
            open: true,
            status: "processing",
            title: "Đang đăng xuất",
            description: "Vui lòng chờ trong giây lát...",
        });

        setTimeout(() => {
            localStorage.removeItem("authToken");
            localStorage.removeItem("authRole");
            window.dispatchEvent(new Event('auth-change'));
            setLogoutDialogState({
                open: true,
                status: "success",
                title: "Đăng xuất thành công",
                description: "Bạn đã đăng xuất khỏi hệ thống. Chúc bạn một ngày tốt lành!",
            });
            setShouldRedirectAfterDialog(true);
        }, 600);
    };

    useEffect(() => {
        if (!logoutDialogState.open && shouldRedirectAfterDialog) {
            setShouldRedirectAfterDialog(false);
            router.push("/");
        }
    }, [logoutDialogState.open, shouldRedirectAfterDialog, router]);

    useEffect(() => {
        if (logoutDialogState.open && logoutDialogState.status === "success") {
            const timer = setTimeout(() => {
                setLogoutDialogState((prev) => ({ ...prev, open: false }));
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [logoutDialogState.open, logoutDialogState.status]);

    return (
        <>
            <nav className="flex flex-row-reverse items-center gap-2">
                <div className="mr-2 pr-2 border-r">
                    <ToggleTheme />
                </div>

                {isLogin ? (
                    // Nếu đã đăng nhập
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className="mr-2">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>Quản lý tài khoản</DropdownMenuItem>
                                <DropdownMenuItem>Lịch sử đặt bàn</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} > Đăng xuất </DropdownMenuItem>
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

            <Dialog open={logoutDialogState.open} onOpenChange={handleDialogChange}>
                <DialogContent showCloseButton={logoutDialogState.status === "success"}>
                    <DialogHeader>
                        <div className="flex flex-col items-center gap-4 text-center">
                            {logoutDialogState.status === "processing" ? (
                                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                            ) : (
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            )}
                            <DialogTitle>{logoutDialogState.title}</DialogTitle>
                            <DialogDescription>
                                {logoutDialogState.description}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            className="w-full"
                            disabled={logoutDialogState.status === "processing"}
                            onClick={() => {
                                if (logoutDialogState.status === "success") {
                                    setLogoutDialogState((prev) => ({ ...prev, open: false }));
                                }
                            }}
                        >
                            {logoutDialogState.status === "success" ? "Hoàn tất" : "Đang xử lý..."}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
