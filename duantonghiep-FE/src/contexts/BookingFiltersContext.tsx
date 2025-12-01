// src/contexts/BookingFiltersContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';

// Kiểu dữ liệu cho bộ lọc
interface BookingFilters {
    location: string | null;
    date: Date | null;
    time: string | null; // Có thể là "Cả ngày" hoặc "HH:MM"
    guests: string | null;
}

// Kiểu dữ liệu cho Context
interface BookingFiltersContextType {
    filters: BookingFilters;
    updateFilter: (key: keyof BookingFilters, value: string | Date | null) => void;
}

// Tạo Context
const BookingFiltersContext = createContext<BookingFiltersContextType | undefined>(undefined);

// Tạo Provider
export const BookingFiltersProvider = ({ children }: { children: ReactNode }) => {
    const [filters, setFilters] = useState<BookingFilters>({
        location: null, // Bắt đầu là null để kích hoạt Flow 2
        date: null,     // Bắt đầu là null
        time: "Cả ngày",// Mặc định "Cả ngày"
        guests: '1',    // Mặc định 1 khách
    });

    // Hàm cập nhật bộ lọc
    const updateFilter = (key: keyof BookingFilters, value: string | Date | null) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value,
        }));
    };

    // Dùng useMemo để tránh tạo lại value object không cần thiết
    const contextValue = useMemo(() => ({ filters, updateFilter }), [filters]);

    return (
        <BookingFiltersContext.Provider value={contextValue}>
            {children}
        </BookingFiltersContext.Provider>
    );
};

// Custom hook để sử dụng Context
export const useBookingFilters = () => {
    const context = useContext(BookingFiltersContext);
    if (context === undefined) {
        throw new Error('useBookingFilters must be used within a BookingFiltersProvider');
    }
    return context;
};