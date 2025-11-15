"use client";

import React, { createContext, useContext, useState } from "react";
import {Branch} from "@/model/Branch";
import {BookingContextType} from "@/model/BookingContextType";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [location, setLocation] = useState<Branch | null>(null);

    const [branches, setBranches] = useState<Branch[]>([]);

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
        setLocation(null);
        setBranches([])
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
                location, setLocation,
                branches, setBranches,
                date, setDate,
                time, setTime,
                guests, setGuests,
                notes, setNotes,
                fullName, setFullName,
                phone, setPhone,
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
