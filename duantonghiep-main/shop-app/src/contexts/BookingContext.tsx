"use client";

import React, { createContext, useContext, useState } from "react";

interface BookingContextType {
    location: string;
    setLocation: (v: string) => void;
    date: Date | null;
    setDate: (v: Date | null) => void;
    time: string;
    setTime: (v: string) => void;
    guests: string;
    setGuests: (v: string) => void;
    notes: string;
    setNotes: (v: string) => void;
    fullName: string;
    setFullName: (v: string) => void;
    phone: string;
    setPhone: (v: string) => void;
    resetBooking: () => void; // tiện dùng sau khi xác nhận hoặc hủy
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // 🏠 Chi nhánh mặc định
    const [location, setLocation] = useState<string>("Chọn chi nhánh");

    // 📅 Ngày - set mặc định là null, tránh lệch múi giờ
    const [date, setDate] = useState<Date | null>(null);

    // 🕒 Giờ
    const [time, setTime] = useState<string>("");

    // 👥 Số người
    const [guests, setGuests] = useState<string>("");

    // 📝 Ghi chú
    const [notes, setNotes] = useState<string>("");

    // 🧍‍♂️ Thông tin người đặt
    const [fullName, setFullName] = useState<string>("");
    const [phone, setPhone] = useState<string>("");

    // 🔁 Hàm reset toàn bộ dữ liệu đặt bàn (nếu muốn clear sau khi đặt xong)
    const resetBooking = () => {
        setLocation("Chọn chi nhánh");
        setDate(null);
        setTime("");
        setGuests("");
        setNotes("");
        setFullName("");
        setPhone("");
    };

    return (
        <BookingContext.Provider
            value={{
                location,
                setLocation,
                date,
                setDate,
                time,
                setTime,
                guests,
                setGuests,
                notes,
                setNotes,
                fullName,
                setFullName,
                phone,
                setPhone,
                resetBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const ctx = useContext(BookingContext);
    if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
    return ctx;
};
