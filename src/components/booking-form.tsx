"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useBooking } from "@/contexts/BookingContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Clock, MapPin, Users, User, Phone, NotebookPen, CheckCircle2 } from "lucide-react";

export default function BookingForm() {
     const router = useRouter();

     const {
         fullName, setFullName,
         phone, setPhone,
         location, setLocation,
         branches,
         date, setDate,
         time, setTime,
         guests, setGuests,
         notes, setNotes,
         resetBooking,
     } = useBooking();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [openDate, setOpenDate] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
        if (!phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
        if (!date) newErrors.date = "Vui lòng chọn ngày";
        if (!time) newErrors.time = "Vui lòng chọn giờ";
        if (!guests) newErrors.guests = "Vui lòng chọn số người";
        if (!location || location.name === "Chọn chi nhánh")
            newErrors.location = "Vui lòng chọn chi nhánh";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setConfirmOpen(true);
    };

    const handleConfirmBooking = () => {
        const bookingData = {
            fullName,
            phone,
            location,
            date: date?.toISOString() || "",
            time,
            guests,
            notes,
        };
        // console.log('bookingData', bookingData);

        localStorage.setItem("bookingInfo", JSON.stringify(bookingData));
        setConfirmOpen(false);
        router.push("/order");
        resetBooking();
    };

    return (
        <>
            {/* --- FORM --- */}
            <form
                onSubmit={handleSubmit}
                className="max-w-2xl mx-auto mt-12 p-8 rounded-3xl shadow-xl bg-gradient-to-br from-white via-neutral-50 to-amber-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-amber-950/20 border border-amber-100/40 dark:border-amber-900/40 backdrop-blur-xl space-y-6"
            >
                <h2 className="text-3xl font-semibold text-center mb-4 bg-gradient-to-r from-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm">
                    Đặt Bàn Cao Cấp
                </h2>

                {/* Họ tên & SĐT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                        <Input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Họ và tên"
                            className="pl-10 rounded-xl h-12 border-amber-200"
                        />
                        {errors.fullName && (
                            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                        )}
                    </div>
                    <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Số điện thoại"
                            className="pl-10 rounded-xl h-12 border-amber-200"
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                    </div>
                </div>

                {/* Chi nhánh */}
                <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                    <select
                        value={location?.id ?? ""}
                        onChange={(e) => {
                            const selected = branches.find(b => b.id === Number(e.target.value));
                            setLocation(selected || null);
                        }}
                        className="w-full border rounded-xl px-10 py-2 h-12 bg-transparent border-amber-200"
                    >
                        {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                    {errors.location && (
                        <p className="text-xs text-red-500 mt-1">{errors.location}</p>
                    )}
                </div>

                {/* Ngày & giờ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Popover open={openDate} onOpenChange={setOpenDate}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="justify-between rounded-xl h-12 border-amber-200"
                            >
                                <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-200">
                                    <CalendarIcon className="w-5 h-5 text-amber-600 opacity-80" />
                                    {date
                                        ? format(date, "dd/MM/yyyy", { locale: vi })
                                        : "Chọn ngày"}
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
                            />
                        </PopoverContent>
                    </Popover>

                    <div className="relative">
                        <Clock className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full border rounded-xl px-10 py-2 h-12 bg-transparent border-amber-200"
                        >
                            <option value="">Chọn giờ</option>
                            {Array.from({ length: 13 }, (_, i) => 8 + i).map((hour) => (
                                <option key={hour} value={hour.toString()}>
                                    {hour}:00
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Số người */}
                <div className="relative">
                    <Users className="absolute left-3 top-3.5 w-5 h-5 text-amber-600 opacity-70" />
                    <select
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        className="w-full border rounded-xl px-10 py-2 h-12 bg-transparent border-amber-200"
                    >
                        <option value="">Số người</option>
                        {Array.from({ length: 18 }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num.toString()}>
                                {num} người
                            </option>
                        ))}
                    </select>
                    {errors.guests && (
                        <p className="text-xs text-red-500 mt-1">{errors.guests}</p>
                    )}
                </div>

                {/* Ghi chú */}
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

            {/* --- DIALOG XÁC NHẬN --- */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-md rounded-3xl border border-amber-200 bg-gradient-to-b from-white to-amber-50 dark:from-neutral-900 dark:to-amber-900/10 shadow-2xl">
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
                            <p>{location?.name || "Chưa chọn"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-amber-600" />
                            <p>{date ? format(date, "dd/MM/yyyy", { locale: vi }) : "Chưa chọn"}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-amber-600" />
                            <p>{time ? `${time}:00` : "Chưa chọn"}</p>
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
        </>
    );
}
