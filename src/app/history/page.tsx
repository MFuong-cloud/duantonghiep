"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Utensils, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import AppPromoSection from "@/components/aboutSection/page";

export default function BookingHistoryPage() {
    const router = useRouter();

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const [bookings, setBookings] = useState([
        {
            id: "BKG12345",
            restaurant: "Maison Mận-Đỏ Restaurant",
            address: "15 Lê Quý Đôn, Quận 3, TP. HCM",
            date: "2025-10-28",
            time: "19:00",
            guests: 4,
            status: "Đang thực hiện",
            note: "Bàn gần cửa sổ, view đẹp nhé!",
            dishes: [
                { name: "Bò Wagyu nướng đá", price: "890.000₫" },
                { name: "Súp nấm Truffle", price: "420.000₫" },
            ],
            total: "1.310.000₫",
        },
        {
            id: "BKG12346",
            restaurant: "The Log Restaurant",
            address: "GEM Center, 8 Nguyễn Bỉnh Khiêm, Quận 1, TP. HCM",
            date: "2025-10-25",
            time: "12:30",
            guests: 2,
            status: "Đã hủy",
            note: "Thay đổi lịch công tác.",
            dishes: [{ name: "Set Lunch Executive", price: "980.000₫" }],
            total: "980.000₫",
        },
    ]);

    const handleCancel = (id: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "Đã hủy" } : b))
        );
    };

    const handleComplete = (id: string) => {
        setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: "Hoàn thành" } : b))
        );
    };

    return (
        <main className="min-h-screen bg-[#fdfdfc] text-[#1a1a1a] dark:bg-[#121212] dark:text-[#e5e5e5] transition-colors">
            {/* 🖼️ Banner đầu trang */}
            <section className="relative h-[320px] w-full overflow-hidden">
                <Image
                    src="/image/banner-register.png"
                    alt="Restaurant banner"
                    fill
                    className="object-cover brightness-[0.55]"
                    priority
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                        Lịch sử đặt bàn
                    </h1>
                    <p className="text-lg opacity-90">
                        Nơi lưu giữ những trải nghiệm ẩm thực tuyệt vời của bạn
                    </p>
                </div>
            </section>

            {/* 📖 Nội dung chính */}
            <section className="container mx-auto px-6 lg:px-10 py-16">
                {bookings.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 dark:bg-[#1e1e1e]/80 text-muted-foreground rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <Image
                            src="/image/empty-state.svg"
                            alt="No bookings"
                            width={220}
                            height={220}
                            className="mx-auto mb-6 opacity-70"
                        />
                        <p className="opacity-80 mb-6 text-lg">
                            Bạn chưa có lịch sử đặt bàn nào.
                        </p>
                        <Button
                            className="bg-[#b97a57] hover:bg-[#a56a49] text-white px-6 py-2 rounded-md text-sm font-medium tracking-wide"
                            onClick={() => router.push("/booking")}
                        >
                            Đặt bàn ngay
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-md backdrop-blur-sm">
                        <table className="w-full text-sm text-left align-middle border-collapse">
                            <thead className="bg-[#faf9f6] dark:bg-[#181818] uppercase text-xs font-semibold tracking-wider text-gray-600 dark:text-gray-300">
                                <tr>
                                    <th className="px-6 py-4">Nhà hàng</th>
                                    <th className="px-6 py-4">Ngày</th>
                                    <th className="px-6 py-4">Giờ</th>
                                    <th className="px-6 py-4">Số người</th>
                                    <th className="px-6 py-4 text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-center">Hành động</th>
                                </tr>
                            </thead>

                            <tbody>
                                {bookings.map((bkg, index) => (
                                    <tr
                                        key={bkg.id}
                                        className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0
                                            ? "bg-white/70 dark:bg-[#161616]"
                                            : "bg-[#f9f9f9] dark:bg-[#181818]"
                                            } group hover:shadow-[0_4px_16px_rgba(185,122,87,0.15)] hover:bg-gradient-to-r hover:from-[#fff9f3] hover:to-[#fff5ed] dark:hover:from-[#1a1a1a] dark:hover:to-[#222] transition-all duration-500`}
                                    >
                                        <td className="px-6 py-4 font-medium whitespace-nowrap transition-all group-hover:text-[#b97a57]">
                                            {bkg.restaurant}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatDate(bkg.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{bkg.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{bkg.guests}</td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${bkg.status === "Hoàn thành"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : bkg.status === "Đang thực hiện"
                                                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}
                                            >
                                                {bkg.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <div className="inline-flex items-center justify-center gap-3">
                                                {/* 🔍 Chi tiết */}
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-[#d3b49f] text-[#b97a57] bg-white hover:bg-gradient-to-r hover:from-[#f5eee8] hover:to-[#e9ded5] dark:hover:from-[#2a2a2a] dark:hover:to-[#333] transition-all duration-300"
                                                        >
                                                            <Utensils className="w-4 h-4 mr-1" />
                                                            Chi tiết
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-lg bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-lg font-semibold text-[#b97a57]">
                                                                Chi tiết đặt bàn #{bkg.id}
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-3 text-sm mt-2">
                                                            <p><strong>Nhà hàng:</strong> {bkg.restaurant}</p>
                                                            <p><strong>Địa chỉ:</strong> {bkg.address}</p>
                                                            <p><strong>Ngày:</strong> {formatDate(bkg.date)}</p>
                                                            <p><strong>Giờ:</strong> {bkg.time}</p>
                                                            <p><strong>Số người:</strong> {bkg.guests}</p>
                                                            <p><strong>Ghi chú:</strong> {bkg.note}</p>
                                                            <hr className="my-3 border-gray-200 dark:border-gray-700" />

                                                            <p className="font-semibold">Món đã chọn:</p>
                                                            <ul className="list-disc list-inside space-y-1">
                                                                {bkg.dishes.map((dish, i) => (
                                                                    <li key={i} className="flex justify-between">
                                                                        <span>{dish.name}</span>
                                                                        <span className="text-[#b97a57] font-medium">
                                                                            {dish.price}
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <hr className="my-3 border-gray-200 dark:border-gray-700" />
                                                            <p className="text-right font-semibold text-[#b97a57] text-base">
                                                                Tổng cộng: {bkg.total}
                                                            </p>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* ❌ Hủy bàn */}
                                                {bkg.status === "Đang thực hiện" && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm transition-all duration-300"
                                                            >
                                                                <XCircle className="w-4 h-4 mr-1" />
                                                                Hủy
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-sm bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-lg font-semibold">
                                                                    Xác nhận hủy bàn
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Bạn có chắc muốn hủy đặt bàn này không?
                                                                    <br />Hành động này không thể hoàn tác.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter className="mt-4 flex justify-end gap-3">
                                                                <Button variant="outline">Giữ lại</Button>
                                                                <Button
                                                                    className="bg-red-600 hover:bg-red-700 text-white transition-all"
                                                                    onClick={() => handleCancel(bkg.id)}
                                                                >
                                                                    Xác nhận hủy
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}

                                                {/* ✅ Hoàn thành */}
                                                {bkg.status === "Đang thực hiện" && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm transition-all duration-300"
                                                        onClick={() => handleComplete(bkg.id)}
                                                    >
                                                        Hoàn thành
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {/* 🍷 Phần quảng bá */}
            <AppPromoSection />
        </main>
    );
}
