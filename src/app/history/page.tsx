"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Utensils, Search, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

    const [bookings] = useState([
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
        {
            id: "BKG12347",
            restaurant: "Maison Mận-Đỏ Restaurant",
            address: "15 Lê Quý Đôn, Quận 3, TP. HCM",
            date: "2025-09-15",
            time: "18:30",
            guests: 6,
            status: "Hoàn thành",
            note: "Tiệc sinh nhật",
            dishes: [
                { name: "Combo BBQ", price: "1.200.000₫" },
                { name: "Rượu vang", price: "500.000₫" },
            ],
            total: "1.700.000₫",
        },
    ]);

    // Filter states
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<"all" | "Đang thực hiện" | "Hoàn thành" | "Đã hủy">("all");
    const [filterMonth, setFilterMonth] = useState<string>("all");
    const [filterYear, setFilterYear] = useState<string>("all");

    // Filtered bookings
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const matchSearch =
                booking.restaurant.toLowerCase().includes(search.toLowerCase()) ||
                booking.id.toLowerCase().includes(search.toLowerCase()) ||
                booking.address.toLowerCase().includes(search.toLowerCase());

            const matchStatus = filterStatus === "all" ? true : booking.status === filterStatus;

            const bookingDate = new Date(booking.date);
            const matchMonth = filterMonth === "all" ? true : (bookingDate.getMonth() + 1).toString() === filterMonth;
            const matchYear = filterYear === "all" ? true : bookingDate.getFullYear().toString() === filterYear;

            return matchSearch && matchStatus && matchMonth && matchYear;
        });
    }, [bookings, search, filterStatus, filterMonth, filterYear]);

    // Get unique years from bookings
    const availableYears = useMemo(() => {
        const years = bookings.map(b => new Date(b.date).getFullYear());
        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, [bookings]);

    return (
        <main className="min-h-screen bg-[#fdfdfc] text-[#1a1a1a] dark:bg-[#121212] dark:text-[#e5e5e5] transition-colors">
            {/* 🖼️ Banner đầu trang */}
            <section className="relative h-[600px] w-full overflow-hidden">
                <Image
                    src="/image/banner3.png"
                    alt="Restaurant banner"
                    fill
                    className="object-cover brightness-[0.55]"
                    priority
                />
            </section>

            {/* 📖 Nội dung chính */}
            <section className="container mx-auto px-6 lg:px-10 py-16">
                {/* Bộ lọc */}
                <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm theo nhà hàng, mã đơn..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#b97a57]/20 focus:border-[#b97a57] transition-all"
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* Filter Trạng thái */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="text-xs">Trạng thái</span>
                                    {filterStatus !== 'all' && (
                                        <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-[#b97a57]" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Lọc theo trạng thái</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                                    <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Đang thực hiện">Đang thực hiện</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Hoàn thành">Hoàn thành</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="Đã hủy">Đã hủy</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Filter Tháng */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-xs">Tháng</span>
                                    {filterMonth !== 'all' && (
                                        <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-[#b97a57]" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuLabel>Lọc theo tháng</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filterMonth} onValueChange={setFilterMonth}>
                                    <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <DropdownMenuRadioItem key={i + 1} value={(i + 1).toString()}>
                                            Tháng {i + 1}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Filter Năm */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 h-10 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span className="text-xs">Năm</span>
                                    {filterYear !== 'all' && (
                                        <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-[#b97a57]" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32">
                                <DropdownMenuLabel>Lọc theo năm</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filterYear} onValueChange={setFilterYear}>
                                    <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                    {availableYears.map(year => (
                                        <DropdownMenuRadioItem key={year} value={year.toString()}>
                                            {year}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Kết quả lọc */}
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white/60 dark:bg-[#1e1e1e]/80 text-muted-foreground rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
                        <Image
                            src="/image/empty-state.svg"
                            alt="No bookings"
                            width={220}
                            height={220}
                            className="mx-auto mb-6 opacity-70"
                        />
                        <p className="opacity-80 mb-6 text-lg">
                            {search || filterStatus !== 'all' || filterMonth !== 'all' || filterYear !== 'all'
                                ? "Không tìm thấy lịch sử đặt bàn phù hợp."
                                : "Bạn chưa có lịch sử đặt bàn nào."}
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
                                    <th className="px-6 py-4">Mã đơn</th>
                                    <th className="px-6 py-4">Nhà hàng</th>
                                    <th className="px-6 py-4">Ngày</th>
                                    <th className="px-6 py-4">Giờ</th>
                                    <th className="px-6 py-4">Số người</th>
                                    <th className="px-6 py-4">Tổng tiền</th>
                                    <th className="px-6 py-4 text-center">Trạng thái</th>
                                    <th className="px-6 py-4 text-center">Chi tiết</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredBookings.map((bkg, index) => (
                                    <tr
                                        key={bkg.id}
                                        className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0
                                            ? "bg-white/70 dark:bg-[#161616]"
                                            : "bg-[#f9f9f9] dark:bg-[#181818]"
                                            } group hover:shadow-[0_4px_16px_rgba(185,122,87,0.15)] hover:bg-gradient-to-r hover:from-[#fff9f3] hover:to-[#fff5ed] dark:hover:from-[#1a1a1a] dark:hover:to-[#222] transition-all duration-500`}
                                    >
                                        <td className="px-6 py-4 font-mono text-gray-500 dark:text-gray-400">
                                            {bkg.id}
                                        </td>
                                        <td className="px-6 py-4 font-medium whitespace-nowrap transition-all group-hover:text-[#b97a57]">
                                            {bkg.restaurant}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {formatDate(bkg.date)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{bkg.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{bkg.guests}</td>
                                        <td className="px-6 py-4 font-semibold text-[#b97a57]">{bkg.total}</td>

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
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-[#d3b49f] text-[#b97a57] bg-white hover:bg-gradient-to-r hover:from-[#f5eee8] hover:to-[#e9ded5] dark:hover:from-[#2a2a2a] dark:hover:to-[#333] transition-all duration-300"
                                                    >
                                                        <Utensils className="w-4 h-4 mr-1" />
                                                        Xem
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
