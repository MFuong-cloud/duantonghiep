"use client";

import { useEffect, useState, useMemo } from "react";
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
    Search,
} from "lucide-react";

// 👇 IMPORT SERVICE VÀ MODEL
import { DishService } from "@/api/menu/menu.service"; // ⚠️ Kiểm tra lại đường dẫn này
import { Dish } from "@/model/Dish";
import { CategoryService } from "@/api/categories/category.service";
import { Category } from "@/model/Category";

export default function OrderPage() {
    const router = useRouter();

    // --- State Form Đặt Bàn (GIỮ NGUYÊN) ---
    const [booking, setBooking] = useState<any>({
        fullName: "",
        phone: "",
        location: "",
        date: "",
        time: "",
        guests: "",
        notes: "",
    });

    // --- State Menu & Order (CẬP NHẬT) ---
    const [menu, setMenu] = useState<Dish[]>([]); // 👇 Đổi type thành Dish[]
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null); // 👇 Đổi type thành Dish | null

    // --- State Dialogs (GIỮ NGUYÊN) ---
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

    // 🟢 Load booking info + Load Menu từ API
    useEffect(() => {
        // 1️⃣ Phần xử lý Form (GIỮ NGUYÊN KHÔNG ĐỤNG VÀO)
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

        // 2️⃣ Phần lấy dữ liệu món ăn và danh mục từ API (MỚI)
        const fetchData = async () => {
            try {
                // Load menu items
                const menuData = await DishService.getDishes();
                // Nếu bạn muốn lọc món đang active: 
                // const activeDishes = menuData.filter(d => d.is_active);
                setMenu(menuData);

                // Load categories
                const categoriesData = await CategoryService.getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                // Có thể thêm thông báo lỗi UI ở đây nếu cần
            }
        };

        fetchData();
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

    // Filter menu items dựa trên search và category
    const filteredMenu = useMemo(() => {
        return menu.filter((dish) => {
            // Filter by search term
            const matchesSearch = 
                !searchTerm || 
                dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (dish.description && dish.description.toLowerCase().includes(searchTerm.toLowerCase()));

            // Filter by category
            const matchesCategory = 
                selectedCategoryId === null || 
                dish.category_id === selectedCategoryId;

            return matchesSearch && matchesCategory;
        });
    }, [menu, searchTerm, selectedCategoryId]);

    // Tính tổng (Sửa lại tham số price vì trong Model nó là optional)
    const getTotal = (items: any[]) =>
        items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

    // 🟠 Xác nhận đặt bàn
    const handleConfirm = () => {
        const ordered = filteredMenu
            .filter((m) => (quantities[m.id] || 0) > 0)
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

    // 🧱 Render Dialogs
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
                                    src={selectedDish.image || selectedDish.image_url || "/image/food/default.jpg"} // Fallback ảnh
                                    alt={selectedDish.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* 👇 Sửa desc thành description */}
                            <p className="text-gray-700 dark:text-gray-300">
                                {selectedDish.description}
                            </p>
                            <p className="font-semibold text-orange-600">
                                Giá: {(selectedDish.price || 0).toLocaleString()}đ
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
                                            (selectedDish.price || 0)
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
                                    {((item.price || 0) * item.qty).toLocaleString()}đ
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Header Section */}
            <section className="bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 text-white py-12">
                <div className="container mx-auto px-6 lg:px-16">
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">Đặt món ăn</h1>
                    <p className="text-lg opacity-90">Chọn món ăn yêu thích cho bữa tiệc của bạn</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-6 lg:px-16 py-10 space-y-10">
                {/* GRID chính */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT - Booking Info */}
                    <div className="lg:col-span-4">
                        <div className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 sticky top-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <UtensilsCrossed className="text-orange-500 w-6 h-6" />
                                Thông tin đặt bàn
                            </h2>
                            <div className="space-y-4">

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <User className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <Input value={booking.fullName} placeholder="Họ và tên" readOnly className="border-0 bg-transparent" />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Phone className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <Input value={booking.phone} placeholder="Số điện thoại" readOnly className="border-0 bg-transparent" />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <MapPin className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <Input value={booking.location} placeholder="Chi nhánh" readOnly className="border-0 bg-transparent" />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <CalendarDays className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <Input
                                        type="date"
                                        value={
                                            booking.date &&
                                                !isNaN(new Date(booking.date).getTime())
                                                ? format(new Date(booking.date), "yyyy-MM-dd")
                                                : ""
                                        }
                                        readOnly
                                        className="border-0 bg-transparent"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Clock className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <Input
                                        value={booking.time ? `${booking.time}`.padEnd(5, ":00") : ""}
                                        placeholder="Giờ đặt"
                                        readOnly
                                        className="border-0 bg-transparent"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                        <Users className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <Input value={booking.guests} placeholder="Số người" readOnly className="border-0 bg-transparent" />
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg mt-1">
                                        <StickyNote className="text-orange-500 w-5 h-5" />
                                    </div>
                                    <textarea
                                        placeholder="Ghi chú"
                                        value={booking.notes || ""}
                                        readOnly
                                        className="w-full border-0 bg-transparent rounded-lg resize-none min-h-[100px]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Menu */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Chọn món ăn
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {filteredMenu.length} món ăn {selectedCategoryId || searchTerm ? "được tìm thấy" : "có sẵn"}
                                </p>
                            </div>
                        </div>

                        {/* Search và Filter */}
                        <div className="space-y-4">
                            {/* Search Box */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm món ăn..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={selectedCategoryId === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategoryId(null)}
                                    className={selectedCategoryId === null 
                                        ? "bg-orange-500 hover:bg-orange-600 text-white" 
                                        : "border-gray-300 dark:border-gray-700"
                                    }
                                >
                                    Tất cả
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategoryId === category.id ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedCategoryId(category.id)}
                                        className={selectedCategoryId === category.id 
                                            ? "bg-orange-500 hover:bg-orange-600 text-white" 
                                            : "border-gray-300 dark:border-gray-700"
                                        }
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2 custom-scroll">
                        {filteredMenu.length === 0 ? (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <p className="text-lg">Không có món ăn nào trong thực đơn.</p>
                                <p className="text-sm mt-2">Vui lòng thử lại sau.</p>
                            </div>
                        ) : (
                            filteredMenu.map((dish) => (
                                <div
                                    key={dish.id}
                                    className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
                                    onClick={() => setSelectedDish(dish)}
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={dish.image || dish.image_url || "/image/food/default.jpg"}
                                            alt={dish.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-5 flex flex-col justify-between h-full">
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                                                {dish.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                                {dish.description || "Không có mô tả"}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-orange-500 font-bold text-lg">
                                                {(dish.price || 0).toLocaleString()}đ
                                            </p>
                                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 hover:bg-orange-500 hover:text-white"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        updateQuantity(dish.id, -1);
                                                    }}
                                                >
                                                    -
                                                </Button>
                                                <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">
                                                    {quantities[dish.id] || 0}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 hover:bg-orange-500 hover:text-white"
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
                            ))
                        )}
                    </div>

                        {/* Confirm Button */}
                        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg px-8"
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

                {/* About Section */}
                <section className="pt-10 border-t border-gray-200 dark:border-gray-700">
                    <AboutSection />
                </section>
            </div>

            {/* 🔹 Dialog */}
            {renderDialogs()}
        </div>
    );
}