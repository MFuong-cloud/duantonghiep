"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AboutSection from "@/components/aboutSection/page";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { format } from "date-fns";
import {
    UtensilsCrossed,
    User,
    Phone,
    MapPin,
    CalendarDays,
    Clock,
    Users,
    StickyNote,
    CheckCircle2,
    ShoppingBag,
    Wallet,
} from "lucide-react";

export default function OrderPage() {
    const router = useRouter();

    const [booking, setBooking] = useState<any>({
        fullName: "",
        phone: "",
        location: "",
        date: "",
        time: "",
        guests: "",
        notes: "",
    });

    const [menu, setMenu] = useState<any[]>([]);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [selectedDish, setSelectedDish] = useState<any>(null);

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        message: string;
        ordered?: any[];
    }>({
        open: false,
        message: "",
        ordered: [],
    });

    const [finalDialog, setFinalDialog] = useState<{
        open: boolean;
        message: string;
    }>({
        open: false,
        message: "",
    });

    // 🟢 Load booking info + menu mẫu
    useEffect(() => {
        const stored = localStorage.getItem("bookingInfo");
        if (stored) {
            const parsed = JSON.parse(stored);
            setBooking({
                fullName: parsed.fullName || "",
                phone: parsed.phone || "",
                location: parsed.location || "",
                date: parsed.date ? new Date(parsed.date) : "",
                time: parsed.time || "",
                guests: parsed.guests || "",
                notes: parsed.notes || "",
            });
        }

        setMenu([
            {
                id: 1,
                name: "Buffet Lẩu 4 Người",
                price: 499000,
                image: "/image/food/buffet.jpg",
                desc: "Combo lẩu 4 người gồm thịt bò, hải sản và rau tươi.",
            },
            {
                id: 2,
                name: "Set Nướng BBQ",
                price: 599000,
                image: "/image/food/bbq.jpg",
                desc: "Combo nướng BBQ đa dạng thịt, hải sản, rau củ.",
            },
            {
                id: 3,
                name: "Salad Trộn Dầu Giấm",
                price: 89000,
                image: "/image/food/salad.jpg",
                desc: "Salad rau củ tươi mát cùng dầu giấm thơm ngon.",
            },
            {
                id: 4,
                name: "Cơm Rang Dưa Bò",
                price: 79000,
                image: "/image/food/comrang.jpg",
                desc: "Cơm rang dưa bò đậm vị Việt Nam.",
            },
            {
                id: 5,
                name: "Lẩu Thái Chua Cay",
                price: 459000,
                image: "/image/food/lau-thai.jpg",
                desc: "Hương vị cay nồng chuẩn Thái Lan.",
            },
            {
                id: 6,
                name: "Bánh Mì Bò Nướng",
                price: 99000,
                image: "/image/food/banhmi.jpg",
                desc: "Thịt bò nướng sốt đặc biệt kèm bánh mì nóng giòn.",
            },
        ]);
    }, []);

    // 🧮 Cập nhật số lượng
    const updateQuantity = (id: number, delta: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta),
        }));
    };

    const setQuantityDirect = (id: number, qty: number) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, qty),
        }));
    };

    const getTotal = (items: any[]) =>
        items.reduce((sum, i) => sum + i.price * i.qty, 0);

    // 🟠 Xác nhận đặt bàn
    const handleConfirm = () => {
        const ordered = menu
            .filter((m) => quantities[m.id] > 0)
            .map((m) => ({ ...m, qty: quantities[m.id] }));

        localStorage.setItem("orderData", JSON.stringify({ booking, ordered }));

        if (ordered.length === 0) {
            setFinalDialog({
                open: true,
                message: "🎉 Đặt bàn thành công! Bạn có thể gọi món sau tại nhà hàng.",
            });
            setTimeout(() => router.push("/history"), 2000);
        } else {
            setConfirmDialog({
                open: true,
                message: "🧾 Danh sách món bạn đã chọn",
                ordered,
            });
        }
    };

    const handleFinalConfirm = () => {
        setConfirmDialog({ open: false, message: "", ordered: [] });
        setFinalDialog({
            open: true,
            message: "🎉 Đặt bàn & món ăn thành công! Thanh toán sau khi dùng xong bữa.",
        });
        setTimeout(() => router.push("/history"), 2000);
    };

    // 🧱 Render Dialogs tách riêng
    const renderDialogs = () => (
        <>
            {/* MODAL Chi tiết món */}
            <Dialog
                open={!!selectedDish}
                onOpenChange={(open) => {
                    if (!open) setSelectedDish(null);
                }}
            >
                <DialogContent className="max-w-md bg-white dark:bg-neutral-800 rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-orange-600">
                            {selectedDish?.name}
                        </DialogTitle>
                    </DialogHeader>

                    {selectedDish && (
                        <div className="space-y-4">
                            <div className="w-full h-48 relative rounded-xl overflow-hidden">
                                <Image
                                    src={selectedDish.image}
                                    alt={selectedDish.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                {selectedDish.desc}
                            </p>
                            <p className="font-semibold text-orange-600">
                                Giá: {selectedDish.price.toLocaleString()}đ
                            </p>

                            <div className="flex items-center gap-3">
                                <Button onClick={() => updateQuantity(selectedDish.id, -1)}>
                                    -
                                </Button>
                                <input
                                    type="number"
                                    min={0}
                                    value={quantities[selectedDish.id] || 0}
                                    onChange={(e) =>
                                        setQuantityDirect(
                                            selectedDish.id,
                                            parseInt(e.target.value || "0")
                                        )
                                    }
                                    className="w-20 text-center rounded-md border px-2 py-1"
                                />
                                <Button onClick={() => updateQuantity(selectedDish.id, 1)}>
                                    +
                                </Button>
                                <div className="ml-auto text-sm text-gray-500">
                                    Thành tiền:{" "}
                                    <span className="font-semibold text-orange-600">
                                        {(
                                            (quantities[selectedDish.id] || 0) *
                                            selectedDish.price
                                        ).toLocaleString()}
                                        đ
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setSelectedDish(null)}>
                                    Đóng
                                </Button>
                                <Button
                                    className="ml-auto bg-gradient-to-r from-amber-500 to-orange-500"
                                    onClick={() => setSelectedDish(null)}
                                >
                                    Lưu & Đóng
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL Xác nhận món */}
            <Dialog
                open={confirmDialog.open}
                onOpenChange={() =>
                    setConfirmDialog({ open: false, message: "", ordered: [] })
                }
            >
                <DialogContent className="max-w-md bg-white dark:bg-neutral-800 rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-center gap-2 text-xl font-semibold text-orange-600">
                            <ShoppingBag className="text-orange-500 w-6 h-6" />
                            {confirmDialog.message}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-3 space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scroll">
                        {confirmDialog.ordered?.map((item, index) => (
                            <div
                                key={index}
                                className="border border-gray-100 dark:border-neutral-700 rounded-xl p-3 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900 shadow-sm"
                            >
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-500">x{item.qty}</p>
                                </div>
                                <p className="font-semibold text-orange-600">
                                    {(item.price * item.qty).toLocaleString()}đ
                                </p>
                            </div>
                        ))}
                    </div>

                    {confirmDialog.ordered && confirmDialog.ordered.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3 flex justify-between items-center">
                            <span className="font-semibold text-lg text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-orange-500" />
                                Tổng cộng:
                            </span>
                            <span className="font-bold text-lg text-orange-600">
                                {getTotal(confirmDialog.ordered).toLocaleString()}đ
                            </span>
                        </div>
                    )}

                    <Button
                        className="mt-5 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                        onClick={handleFinalConfirm}
                    >
                        Xác nhận đặt món & đặt bàn
                    </Button>
                </DialogContent>
            </Dialog>

            {/* MODAL Xác nhận cuối */}
            <Dialog
                open={finalDialog.open}
                onOpenChange={() => setFinalDialog({ open: false, message: "" })}
            >
                <DialogContent className="max-w-sm bg-white dark:bg-neutral-800 rounded-2xl text-center p-6">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-center gap-2 text-xl font-semibold text-orange-600">
                            <CheckCircle2 className="text-green-500 w-6 h-6" />
                            Thông báo
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mt-3">
                        {finalDialog.message}
                    </p>
                    <Button
                        className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                        onClick={() => setFinalDialog({ open: false, message: "" })}
                    >
                        Đóng
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-10 px-6 lg:px-16 space-y-10">
            {/* GRID chính */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT - Booking Info */}
                <div className="lg:col-span-4 bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-md space-y-3">
                    <h2 className="text-2xl font-semibold text-orange-600 mb-3 flex items-center gap-2">
                        <UtensilsCrossed className="text-orange-500" />
                        Thông tin đặt bàn
                    </h2>

                    <div className="flex items-center gap-2">
                        <User className="text-orange-500" />
                        <Input value={booking.fullName} placeholder="Họ và tên" readOnly />
                    </div>

                    <div className="flex items-center gap-2">
                        <Phone className="text-orange-500" />
                        <Input value={booking.phone} placeholder="Số điện thoại" readOnly />
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin className="text-orange-500" />
                        <Input value={booking.location} placeholder="Chi nhánh" readOnly />
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays className="text-orange-500" />
                        <Input
                            type="date"
                            value={
                                booking.date &&
                                    !isNaN(new Date(booking.date).getTime())
                                    ? format(new Date(booking.date), "yyyy-MM-dd")
                                    : ""
                            }
                            readOnly
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Clock className="text-orange-500" />
                        <Input
                            value={booking.time ? `${booking.time}`.padEnd(5, ":00") : ""}
                            placeholder="Giờ đặt"
                            readOnly
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="text-orange-500" />
                        <Input value={booking.guests} placeholder="Số người" readOnly />
                    </div>

                    <div className="flex items-start gap-2">
                        <StickyNote className="text-orange-500 mt-2" />
                        <textarea
                            placeholder="Ghi chú"
                            value={booking.notes || ""}
                            readOnly
                            className="w-full border rounded-xl px-3 py-2 min-h-[100px]"
                        />
                    </div>
                </div>

                {/* RIGHT - Menu */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="text-2xl font-semibold text-orange-600 flex items-center gap-2">
                        🍽️ Chọn món ăn
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scroll">
                        {menu.map((dish) => (
                            <div
                                key={dish.id}
                                className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                                onClick={() => setSelectedDish(dish)}
                            >
                                <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    width={400}
                                    height={250}
                                    className="w-full h-40 object-cover"
                                />
                                <div className="p-4 flex flex-col justify-between h-full">
                                    <div>
                                        <h3 className="font-semibold text-lg">{dish.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {dish.desc}
                                        </p>
                                    </div>
                                    <div className="mt-3 flex justify-between items-center">
                                        <p className="text-orange-600 font-semibold">
                                            {dish.price.toLocaleString()}đ
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(dish.id, -1);
                                                }}
                                            >
                                                -
                                            </Button>
                                            <span className="w-6 text-center">
                                                {quantities[dish.id] || 0}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(dish.id, 1);
                                                }}
                                            >
                                                +
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tooltip cho nút xác nhận */}
                    <div className="flex justify-end">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90"
                                    onClick={handleConfirm}
                                >
                                    Xác nhận đặt bàn
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                                Gửi thông tin đặt bàn và món ăn
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* 🔸 About Section - vùng riêng biệt */}
            <section className="pt-10 border-t border-neutral-300 dark:border-neutral-700">
                <AboutSection />
            </section>

            {/* 🔹 Dialog */}
            {renderDialogs()}
        </div>
    );
}
