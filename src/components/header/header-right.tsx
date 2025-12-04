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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
    const today = React.useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t;
    }, []);

    const [openDate, setOpenDate] = React.useState(false);
    const [month, setMonth] = React.useState<Date>(new Date());
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [openTime, setOpenTime] = React.useState(false);
    const [openGuests, setOpenGuests] = React.useState(false);

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
    const { date, setDate, time: selectTime, setTime, guests, setGuests } = useBooking();

    // Local state input giờ/phút dạng string
    const [hourInput, setHourInput] = React.useState(selectTime ? Math.floor(Number(selectTime)).toString() : "");
    const [minuteInput, setMinuteInput] = React.useState(
        selectTime ? Math.round((Number(selectTime) % 1) * 60).toString() : ""
    );

    // Sync input -> selectTime
    useEffect(() => {
        if (hourInput === "" || minuteInput === "") {
            setTime("");
        } else {
            const h = Number(hourInput);
            const m = Number(minuteInput);
            if (!isNaN(h) && !isNaN(m)) setTime((h + m / 60).toFixed(2));
        }
    }, [hourInput, minuteInput, setTime]);

    const handleDialogChange = (open: boolean) => {
        if (!open && logoutDialogState.status === "processing") return;
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
            window.dispatchEvent(new Event("auth-change"));
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

    const closingHour = 23; // giờ đóng cửa
    let timeWarning = "";
    if (hourInput !== "" && minuteInput !== "") {
        const totalMinutes = Number(hourInput) * 60 + Number(minuteInput);
        const remaining = closingHour * 60 - totalMinutes;
        if (remaining > 0 && remaining <= 60) timeWarning = `Còn ${remaining} phút đến giờ đóng cửa`;
        else if (remaining <= 0) timeWarning = `Quán đã đóng cửa`;
    }

    const formatTime = (h: number, m: number) => {
        const period = h < 12 ? "AM" : "PM";
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} (${period})`;
    };

    return (
        <>
            <nav className="flex flex-row-reverse items-center gap-3">
                {/* Theme */}
                <div className="mr-2 pr-2 border-r">
                    <ToggleTheme />
                </div>

                {/* User */}
                {isLogin ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="mr-2">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="start">
                            <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => router.push('/profile')}>Quản lý tài khoản</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/history')}>Lịch sử đặt bàn</DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-md shadow hover:shadow-md transition-all"
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

                {/* Chọn ngày */}
                <Popover open={openDate} onOpenChange={setOpenDate}>
                    <PopoverTrigger asChild>
                        <Button className="flex items-center rounded-full px-4 py-2 hover:border-2 hover:border-orange-400">
                            {formatDateDisplay(date, today)}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 overflow-hidden" align="end">
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
                                    setOpenDate(false);
                                }
                            }}
                            disabled={(d) => d < today}
                        />
                    </PopoverContent>
                </Popover>

                {/* Giờ đến */}
                <Popover open={openTime} onOpenChange={setOpenTime}>
                    <PopoverTrigger asChild>
                        <Button className="flex items-center rounded-full px-4 py-2 hover:border-2 hover:border-orange-400">
                            {hourInput !== "" && minuteInput !== "" ? formatTime(Number(hourInput), Number(minuteInput)) : "Chọn giờ đến"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-52 p-4 flex flex-col gap-2">
                        <label className="text-sm font-medium">Chọn giờ đến</label>
                        <div className="flex gap-2">
                            <Input
                                type="number"
                                placeholder="Giờ"
                                min={0}
                                max={23}
                                value={hourInput}
                                onChange={(e) => setHourInput(e.target.value)}
                                className="w-16 text-center appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                            />
                            <Input
                                type="number"
                                placeholder="Phút"
                                min={0}
                                max={59}
                                value={minuteInput}
                                onChange={(e) => setMinuteInput(e.target.value)}
                                className="w-16 text-center appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                            />
                        </div>
                        {timeWarning && <p className="text-sm text-red-500">{timeWarning}</p>}
                        <Button
                            className="w-full mt-2 bg-orange-500 text-white hover:bg-orange-600"
                            onClick={() => setOpenTime(false)}
                        >
                            Xác nhận
                        </Button>
                    </PopoverContent>
                </Popover>

                {/* Số người */}
                <Popover open={openGuests} onOpenChange={setOpenGuests}>
                    <PopoverTrigger asChild>
                        <Button className="flex items-center rounded-full px-4 py-2 hover:border-2 hover:border-orange-400">
                            {guests || "Số người"} <UserRoundIcon className="ml-2 w-4 h-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-4 space-y-3" align="end">
                        <p className="text-sm font-medium">Nhập số lượng người</p>
                        <Input
                            type="number"
                            min={1}
                            max={20}
                            placeholder="Nhập số người..."
                            inputMode="numeric"
                            className="appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                            value={guests ?? ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "") {
                                    setGuests("");
                                    return;
                                }
                                const num = Number(value);
                                if (!isNaN(num) && num >= 1) setGuests(value);
                            }}
                        />
                        <Button
                            className="w-full bg-orange-500 text-white hover:bg-orange-600"
                            onClick={() => {
                                if (Number(guests) > 6) setAlertOpen(true);
                                setOpenGuests(false);
                            }}
                        >
                            Xác nhận
                        </Button>
                    </PopoverContent>
                </Popover>
            </nav>

            {/* Dialog Logout */}
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
                            <DialogDescription>{logoutDialogState.description}</DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            className="w-full"
                            disabled={logoutDialogState.status === "processing"}
                            onClick={() => {
                                if (logoutDialogState.status === "success")
                                    setLogoutDialogState((prev) => ({ ...prev, open: false }));
                            }}
                        >
                            {logoutDialogState.status === "success" ? "Hoàn tất" : "Đang xử lý..."}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog cảnh báo >6 người */}
            <Dialog open={alertOpen} onOpenChange={setAlertOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-500">Nhóm trên 6 người</DialogTitle>
                        <DialogDescription>
                            Vui lòng liên hệ trực tiếp quán để được sắp xếp bàn phù hợp cho nhóm đông.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            className="w-full bg-orange-500 text-white hover:bg-orange-600"
                            onClick={() => setAlertOpen(false)}
                        >
                            Tôi đã hiểu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}