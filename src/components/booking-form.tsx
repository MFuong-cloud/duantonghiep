"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useBooking } from "@/contexts/BookingContext";
import { useAuth } from "@/api/auth/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Clock, MapPin, Users, User, Phone, NotebookPen, CheckCircle2 } from "lucide-react";

export default function BookingForm() {
    const router = useRouter();
    const { isLogin } = useAuth();

    const {
        fullName, setFullName,
        phone, setPhone,
        date, setDate,
        time, setTime,
        guests, setGuests,
        notes, setNotes,
        resetBooking,
    } = useBooking();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openDate, setOpenDate] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);

    // Local state cho giờ và phút
    const [hourInput, setHourInput] = useState("");
    const [minuteInput, setMinuteInput] = useState("");

    // ⭐ TỰ ĐỘNG ĐIỀN THÔNG TIN NGƯỜI DÙNG NẾU ĐÃ ĐĂNG NHẬP
    useEffect(() => {
        if (isLogin && typeof window !== 'undefined') {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const user = JSON.parse(userInfo);
                    if (user.name && !fullName) {
                        setFullName(user.name);
                    }
                    if (user.phone && !phone) {
                        setPhone(user.phone);
                    }
                } catch (error) {
                    console.error('Error parsing user info:', error);
                }
            }
        }
    }, [isLogin]);

    // ⭐ ĐỒNG BỘ time từ context vào hourInput và minuteInput
    useEffect(() => {
        if (time && time !== "") {
            // Parse time từ định dạng "HH:MM"
            const parts = time.split(':');
            if (parts.length === 2) {
                const hours = parts[0];
                const minutes = parts[1];

                if (hourInput !== hours || minuteInput !== minutes) {
                    setHourInput(hours);
                    setMinuteInput(minutes);
                }
            }
        } else if (time === "" && (hourInput !== "" || minuteInput !== "")) {
            setHourInput("");
            setMinuteInput("");
        }
    }, [time]);

    // Sync giờ + phút vào time
    useEffect(() => {
        if (hourInput === "" || minuteInput === "") {
            if (time !== "") {
                setTime("");
            }
        } else {
            const h = Number(hourInput);
            const m = Number(minuteInput);
            if (!isNaN(h) && !isNaN(m)) {
                // Lưu dưới dạng "HH:MM" thay vì số thập phân
                const newTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                if (time !== newTime) {
                    setTime(newTime);
                }
            }
        }
    }, [hourInput, minuteInput]);

    const closingHour = 23;
    const openingHour = 9; // Giờ mở cửa 9h sáng
    let timeWarning = "";

    if (hourInput !== "" && minuteInput !== "") {
        const h = Number(hourInput);
        const m = Number(minuteInput);
        const totalMinutes = h * 60 + m;
        const remaining = closingHour * 60 - totalMinutes;

        // Kiểm tra giờ mở cửa
        if (h < openingHour) {
            timeWarning = `Quán chỉ phục vụ từ ${openingHour}:00 sáng`;
        }
        // Kiểm tra nếu chọn ngày hôm nay
        else if (date) {
            const today = new Date();
            const selectedDate = new Date(date);

            // So sánh ngày (bỏ qua giờ)
            const isToday = selectedDate.getDate() === today.getDate() &&
                selectedDate.getMonth() === today.getMonth() &&
                selectedDate.getFullYear() === today.getFullYear();

            if (isToday) {
                const currentHour = today.getHours();
                const currentMinute = today.getMinutes();
                const currentTotalMinutes = currentHour * 60 + currentMinute;

                // Kiểm tra giờ đã qua
                if (totalMinutes <= currentTotalMinutes) {
                    timeWarning = `Giờ này đã qua. Hiện tại là ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
                }
                // Cảnh báo gần giờ đóng cửa
                else if (remaining > 0 && remaining <= 60) {
                    timeWarning = `Còn ${remaining} phút đến giờ đóng cửa`;
                } else if (remaining <= 0) {
                    timeWarning = `Quán đã đóng cửa`;
                }
            }
            // Nếu không phải hôm nay, chỉ kiểm tra giờ đóng cửa
            else {
                if (remaining > 0 && remaining <= 60) {
                    timeWarning = `Còn ${remaining} phút đến giờ đóng cửa`;
                } else if (remaining <= 0) {
                    timeWarning = `Quán đã đóng cửa`;
                }
            }
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
        if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        if (!date) newErrors.date = "Vui lòng chọn ngày";

        if (hourInput === "" || minuteInput === "") {
            newErrors.time = "Vui lòng nhập giờ và phút";
        } else {
            const h = Number(hourInput);
            const m = Number(minuteInput);

            // Kiểm tra giờ hợp lệ
            if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
                newErrors.time = "Giờ không hợp lệ";
            }
            // Kiểm tra giờ mở cửa (từ 9h sáng)
            else if (h < openingHour) {
                newErrors.time = `Quán chỉ phục vụ từ ${openingHour}:00 sáng`;
            }
            // Kiểm tra giờ đóng cửa
            else if (h >= closingHour) {
                newErrors.time = `Quán đóng cửa lúc ${closingHour}:00`;
            }
            // Kiểm tra nếu chọn ngày hôm nay và giờ đã qua
            else if (date) {
                const today = new Date();
                const selectedDate = new Date(date);

                const isToday = selectedDate.getDate() === today.getDate() &&
                    selectedDate.getMonth() === today.getMonth() &&
                    selectedDate.getFullYear() === today.getFullYear();

                if (isToday) {
                    const currentHour = today.getHours();
                    const currentMinute = today.getMinutes();
                    const selectedTotalMinutes = h * 60 + m;
                    const currentTotalMinutes = currentHour * 60 + currentMinute;

                    if (selectedTotalMinutes <= currentTotalMinutes) {
                        newErrors.time = `Giờ này đã qua. Hiện tại là ${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
                    }
                }
            }
        }

        if (!guests.trim()) {
            newErrors.guests = "Vui lòng nhập số lượng người";
        } else {
            const guestsNum = parseInt(guests);
            if (isNaN(guestsNum) || guestsNum < 1) {
                newErrors.guests = "Vui lòng nhập số lượng người yêu cầu ít nhất 1 người";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (Number(guests) > 6) {
            setAlertOpen(true);
            return;
        }

        setConfirmOpen(true);
    };

    const handleConfirmBooking = () => {
        const bookingData = {
            fullName,
            phone,
            address: "B2-R2-13, Khu đô thị Royal City, Hà Nội",
            date: date?.toISOString() || "",
            time,
            guests,
            notes,
        };

        localStorage.setItem("bookingInfo", JSON.stringify(bookingData));
        setConfirmOpen(false);
        router.push("/order");
        resetBooking();
    };

    return (
        <>
            <form
                onSubmit={handleSubmit}
                noValidate
                className="max-w-2xl mx-auto mt-12 p-8 rounded-3xl shadow-xl bg-gradient-to-br from-white via-neutral-50 to-amber-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-amber-950/20 border border-amber-100/40 dark:border-amber-900/40 backdrop-blur-xl space-y-6"
            >
                <h2 className="text-3xl font-semibold text-center mb-4 bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">
                    Đặt Chỗ Ngay
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Họ và tên"
                            className="pl-10 rounded-xl h-12 border-amber-200"
                        />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Số điện thoại"
                            className="pl-10 rounded-xl h-12 border-amber-200"
                        />
                        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>
                </div>

                <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                    <input
                        value="B2-R2-13, Khu đô thị Royal City, Hà Nội"
                        disabled
                        className="w-full border rounded-xl px-10 py-2 h-12 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 cursor-not-allowed border-amber-200"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-between rounded-xl h-12 border-amber-200">
                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
                                    <CalendarIcon className="w-5 h-5 text-amber-600 opacity-80" />
                                    {date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                </div>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 border-amber-100">
                            <Calendar
                                mode="single"
                                selected={date ?? undefined}
                                onSelect={(newDate) => {
                                    if (newDate) {
                                        setDate(newDate);
                                        setOpenDate(false);
                                    }
                                }}
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    return date < today;
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <div className="relative flex-1">
                                <Clock className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                                <Input
                                    type="number"
                                    placeholder="Giờ"
                                    min={openingHour}
                                    max={closingHour - 1}
                                    value={hourInput}
                                    onChange={(e) => setHourInput(e.target.value)}
                                    className="pl-10 rounded-xl h-12 border-amber-200 text-center appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                />
                            </div>
                            <div className="relative flex-1">
                                <Input
                                    type="number"
                                    placeholder="Phút"
                                    min={0}
                                    max={59}
                                    value={minuteInput}
                                    onChange={(e) => setMinuteInput(e.target.value)}
                                    className="rounded-xl h-12 border-amber-200 text-center appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                                />
                            </div>
                            {hourInput && (
                                <span className="text-sm font-medium text-amber-600 min-w-[40px]">
                                    ({Number(hourInput) < 12 ? 'AM' : 'PM'})
                                </span>
                            )}
                        </div>
                        {errors.time ? (
                            <p className="text-xs text-red-500">{errors.time}</p>
                        ) : timeWarning ? (
                            <p className="text-sm text-red-500">{timeWarning}</p>
                        ) : null}
                    </div>
                </div>

                <div className="relative">
                    <Users className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                    <Input
                        type="number"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="Nhập số lượng người (tối thiểu 1 người)"
                        min={1}
                        inputMode="numeric"
                        className="pl-10 rounded-xl h-12 border-amber-200 appearance-none [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                    />
                    {errors.guests && <p className="text-xs text-red-500 mt-1">{errors.guests}</p>}
                </div>

                <div className="relative">
                    <NotebookPen className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Ghi chú thêm (nếu có)"
                        className="w-full border rounded-xl px-10 py-2 min-h-[100px] bg-transparent resize-none border-amber-200"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 text-lg text-white font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 shadow-md"
                >
                    Xác nhận đặt bàn
                </Button>
            </form>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-md rounded-3xl border border-amber-200 bg-white dark:bg-neutral-900 shadow-2xl">
                    <DialogHeader className="text-center">
                        <div className="flex justify-center mb-3">
                            <CheckCircle2 className="w-14 h-14 text-amber-500 drop-shadow-md" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-amber-600">
                            Xác nhận thông tin đặt bàn
                        </DialogTitle>
                        <DialogDescription className="text-neutral-600 dark:text-neutral-300">
                            Kiểm tra kỹ lại thông tin trước khi xác nhận.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-6 space-y-3 text-neutral-800 dark:text-neutral-200">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-600" />
                            <p>{fullName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-5 h-5 text-amber-600" />
                            <p>{phone}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-amber-600" />
                            <p>B2-R2-13, Khu đô thị Royal City, Hà Nội</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-amber-600" />
                            <p>{date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chưa chọn"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <p>
                                {hourInput && minuteInput
                                    ? `${hourInput.padStart(2, '0')}:${minuteInput.padStart(2, '0')} (${Number(hourInput) < 12 ? 'AM' : 'PM'})`
                                    : "Chưa chọn"}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-amber-600" />
                            <p>{guests} người</p>
                        </div>
                        {notes && (
                            <div className="flex items-start gap-2">
                                <NotebookPen className="w-5 h-5 text-amber-600 mt-0.5" />
                                <p>{notes}</p>
                            </div>
                        )}
                    </div>

                    <DialogFooter className="mt-8 flex justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                            className="rounded-xl px-6 border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                            Quay lại
                        </Button>
                        <Button
                            onClick={handleConfirmBooking}
                            className="rounded-xl px-6 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:brightness-110"
                        >
                            Xác nhận đặt bàn
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                            className="w-full bg-amber-500 text-white hover:bg-amber-600"
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
