"use client";

import React, { useState } from "react";

// Dữ liệu giả cho các lựa chọn (giữ nguyên)
const timeSlots = ["10:00", "11:00", "12:00", "13:00", "17:00", "18:00", "19:00", "20:00"];
const guestOptions = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

export function BookingForm() {
    // 1. Dùng useState của React để quản lý từng ô nhập liệu
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState("1"); // Giá trị mặc định là 1
    const [notes, setNotes] = useState("");

    // State để lưu trữ các thông báo lỗi
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // 2. Tự viết hàm kiểm tra lỗi (validation)
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Kiểm tra tên
        if (fullName.length < 2) {
            newErrors.fullName = "Tên phải có ít nhất 2 ký tự.";
        }
        // Kiểm tra SĐT (dùng regex)
        if (!/^[0-9]{10}$/.test(phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ (cần 10 số).";
        }
        // Kiểm tra ngày
        if (!date) {
            newErrors.date = "Vui lòng chọn ngày.";
        } else {
            // Kiểm tra ngày không được là quá khứ
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Đặt giờ về 0h sáng

            // Xử lý Timezone: Chuyển ngày được chọn về đúng múi giờ
            const selectedDate = new Date(date);
            selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());

            if (selectedDate < today) {
                newErrors.date = "Không thể chọn ngày trong quá khứ.";
            }
        }
        // Kiểm tra giờ
        if (!time) {
            newErrors.time = "Vui lòng chọn giờ.";
        }
        // Kiểm tra khách
        if (parseInt(guests) < 1) {
            newErrors.guests = "Số lượng khách phải ít nhất là 1.";
        }

        setErrors(newErrors);
        // Trả về true (hợp lệ) nếu không có lỗi nào
        return Object.keys(newErrors).length === 0;
    };

    // 3. Hàm xử lý khi bấm nút "Submit"
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Ngăn trang tải lại

        // Chạy kiểm tra lỗi
        const isValid = validateForm();

        if (isValid) {
            // Nếu không có lỗi -> Gửi dữ liệu đi
            const formData = { fullName, phone, date, time, guests, notes };
            console.log("Dữ liệu form hợp lệ:", formData);
            alert("Đặt bàn thành công! (Xem console log để biết chi tiết)");

            // Reset form
            setFullName("");
            setPhone("");
            setDate("");
            setTime("");
            setGuests("1");
            setNotes("");
            setErrors({});
        } else {
            // Nếu có lỗi, hàm validateForm đã setErrors
            console.log("Dữ liệu form có lỗi.");
        }
    };

    // Lấy ngày hôm nay dưới dạng YYYY-MM-DD để đặt giá trị "min" cho input date
    const todayString = new Date().toISOString().split("T")[0];

    // 4. Dùng các thẻ HTML mặc định: <form>, <input>, <select>, <button>
    // (Tôi vẫn dùng class Tailwind để giữ bố cục, vì dự án của bạn đã có Tailwind)
    return (
        <div className="w-full max-w-2xl mx-auto p-6 md:p-8 border rounded-xl shadow-xl bg-card text-card-foreground">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-center text-orange-600">
                    Đặt Bàn Ngay
                </h2>
                <p className="text-center text-muted-foreground mt-1">
                    Vui lòng điền thông tin để giữ chỗ cho bạn.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tên đầy đủ */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                            Họ và Tên
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Nguyễn Văn A"
                            className="w-full p-3 border rounded-md bg-background"
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                            Số điện thoại
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="09xxxxxxxx"
                            className="w-full p-3 border rounded-md bg-background"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Chọn Ngày (dùng input date HTML5) */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-2">
                            Chọn Ngày
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={todayString} // Ngăn chọn ngày quá khứ
                            className="w-full p-3 border rounded-md bg-background"
                        />
                        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    {/* Chọn Giờ (dùng select HTML5) */}
                    <div>
                        <label htmlFor="time" className="block text-sm font-medium mb-2">
                            Chọn Giờ
                        </label>
                        <select
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-3 border rounded-md bg-background"
                        >
                            <option value="">Chọn giờ</option>
                            {timeSlots.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>

                    {/* Số lượng khách (dùng select HTML5) */}
                    <div>
                        <label htmlFor="guests" className="block text-sm font-medium mb-2">
                            Số khách
                        </label>
                        <select
                            id="guests"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="w-full p-3 border rounded-md bg-background"
                        >
                            {guestOptions.map(num => (
                                <option key={num} value={num}>{num} người</option>
                            ))}
                        </select>
                        {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
                    </div>
                </div>

                {/* Ghi chú */}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium mb-2">
                        Ghi chú (Tùy chọn)
                    </label>
                    <input
                        id="notes"
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Hôm nay tôi buồn"
                        className="w-full p-3 border rounded-md bg-background"
                    />
                </div>

                {/* Nút Submit (dùng button HTML5) */}
                <button
                    type="submit"
                    className="w-full text-lg font-bold p-3 rounded-md text-white bg-gradient-to-r from-[var(--co-orage-signature-start)] to-[var(--co-orage-signature-end)] hover:opacity-90 transition-opacity"
                >
                    Xác Nhận Đặt Bàn
                </button>
            </form>
        </div>
    );
}