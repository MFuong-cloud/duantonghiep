"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
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
    Loader2,
} from "lucide-react";

import { DishService } from "@/api/menu/menu.service";
import { Dish } from "@/model/Dish";
import { CategoryService } from "@/api/categories/category.service";
import { Category } from "@/model/Category";
import { getValidImageUrl } from "@/lib/utils";
import { OrderService } from "@/api/orders/order.service";
import { useAuth } from "@/api/auth/AuthContext";
import { useSocket } from "@/hooks/useSocket";

interface BookingInfo {
    fullName: string;
    phone: string;
    address: string;
    date: string | Date;
    time: string;
    guests: string;
    notes: string;
}

interface OrderedItem extends Dish {
    qty: number;
}

export default function OrderPage() {
    const router = useRouter();
    const { isLogin, isLoading } = useAuth();

    const [booking, setBooking] = useState<BookingInfo>({
        fullName: "",
        phone: "",
        address: "",
        date: "",
        time: "",
        guests: "",
        notes: "",
    });

    // Bắt buộc đăng nhập để truy cập trang order
    useEffect(() => {
        if (!isLoading && !isLogin) {
            router.push('/login');
        }
    }, [isLogin, isLoading, router]);

    const [menu, setMenu] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
    const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Socket Connection for Notifications
    const { socket } = useSocket({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    });

    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        message: string;
        ordered?: OrderedItem[];
    }>({
        open: false,
        message: "",
        ordered: [],
    });

    const [finalDialog, setFinalDialog] = useState<{
        open: boolean;
        message: string;
        isError?: boolean;
    }>({
        open: false,
        message: "",
        isError: false,
    });

    useEffect(() => {
        const stored = localStorage.getItem("bookingInfo");
        if (stored) {
            const parsed = JSON.parse(stored);
            setBooking({
                fullName: parsed.fullName || "",
                phone: parsed.phone || "",
                address: parsed.address || "B2-R2-13, Khu đô thị Royal City, Hà Nội",
                date: parsed.date ? new Date(parsed.date) : "",
                time: parsed.time || "",
                guests: parsed.guests || "",
                notes: parsed.notes || "",
            });
        }

        const fetchData = async () => {
            try {
                const menuData = await DishService.getDishes();
                setMenu(menuData);

                const categoriesData = await CategoryService.getCategories();
                setCategories(categoriesData);

                // ⭐ Load cart items from localStorage (from detail page "Chọn ngay")
                const cartData = localStorage.getItem("cart");
                if (cartData) {
                    try {
                        const cart = JSON.parse(cartData);
                        const initialQuantities: { [key: number]: number } = {};

                        cart.forEach((item: any) => {
                            if (item.id && item.qty) {
                                initialQuantities[item.id] = item.qty;
                            }
                        });

                        setQuantities(initialQuantities);
                    } catch (error) {
                        console.error("Lỗi khi đọc giỏ hàng:", error);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, []);

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

    const filteredMenu = useMemo(() => {
        return menu.filter((dish) => {
            const matchesSearch =
                !searchTerm ||
                dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (dish.description && dish.description.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory =
                selectedCategoryId === null ||
                dish.category_id === selectedCategoryId;

            return matchesSearch && matchesCategory;
        });
    }, [menu, searchTerm, selectedCategoryId]);

    // Helper function to format time to HH:MM
    const formatTimeToHHMM = (time: string) => {
        // Nếu đã là format HH:MM, trả về luôn
        if (time.includes(':')) {
            return time;
        }

        // Convert từ số thập phân (11.18 -> 11:11)
        const timeFloat = parseFloat(time) || 12;
        const hours = Math.floor(timeFloat);
        const minutes = Math.round((timeFloat - hours) * 60); // Sửa từ 100 -> 60

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const getTotal = (items: OrderedItem[]) =>
        items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);

    const handleConfirm = async () => {
        const ordered = menu
            .filter((m) => (quantities[m.id] || 0) > 0)
            .map((m) => ({ ...m, qty: quantities[m.id] }));

        localStorage.setItem("orderData", JSON.stringify({ booking, ordered }));

        if (ordered.length === 0) {
            // No dishes selected, create booking-only order
            setIsSubmitting(true);

            try {
                // Backend sẽ tự động lấy user_id từ auth token
                const orderData = {
                    ho_ten: booking.fullName,
                    phone: booking.phone,
                    booking_date: booking.date
                        ? format(new Date(booking.date), "yyyy-MM-dd")
                        : format(new Date(), "yyyy-MM-dd"),
                    booking_time: formatTimeToHHMM(booking.time),
                    quantity: parseInt(booking.guests) || 1,
                    note: booking.notes || "",
                    items: []
                };

                const response = await OrderService.createOrder(orderData);

                // Notify Admin via Socket
                if (socket) {
                    socket.emit('user:booking:create', {
                        ...orderData,
                        name: booking.fullName,
                        id: response.id || 'new',
                        type: 'booking_only'
                    });
                }

                localStorage.removeItem('cart');
                localStorage.removeItem('bookingInfo');

                setFinalDialog({
                    open: true,
                    message: "🎉 Đặt bàn thành công! Bạn có thể gọi món sau tại nhà hàng.",
                    isError: false,
                });
                // Chuyển đến trang lịch sử
                setTimeout(() => router.push("/history"), 2000);
            } catch (error: any) {
                console.error("Error creating booking:", error);
                console.error("Error response:", error?.response);
                console.error("Error data:", error?.response?.data);

                let errorMessage = "❌ Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.";

                if (error?.response?.data?.message) {
                    errorMessage = `❌ ${error.response.data.message}`;
                    if (error.response.data.remaining_seconds) {
                        errorMessage += `\n⏳ Vui lòng thử lại sau ${Math.ceil(error.response.data.remaining_seconds)} giây.`;
                    }
                } else if (error?.response?.data?.error) {
                    errorMessage = `❌ ${error.response.data.error}`;
                } else if (error?.message) {
                    errorMessage = `❌ ${error.message}`;
                }

                setFinalDialog({
                    open: true,
                    message: errorMessage,
                    isError: true,
                });
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setConfirmDialog({
                open: true,
                message: "🧾 Danh sách món bạn đã chọn",
                ordered,
            });
        }
    };

    const handleFinalConfirm = async () => {
        setConfirmDialog({ open: false, message: "", ordered: [] });
        setIsSubmitting(true);

        try {
            // Backend sẽ tự động lấy user_id từ auth token

            // Prepare order data
            const orderData = {
                ho_ten: booking.fullName,
                phone: booking.phone,
                booking_date: booking.date
                    ? format(new Date(booking.date), "yyyy-MM-dd")
                    : format(new Date(), "yyyy-MM-dd"),
                booking_time: formatTimeToHHMM(booking.time),
                quantity: parseInt(booking.guests) || 1,
                note: booking.notes || "",
                items: confirmDialog.ordered?.map(item => ({
                    dish_id: item.id,
                    quantity: item.qty
                })) || []
            };



            // Call API to create order
            const response = await OrderService.createOrder(orderData);

            // Notify Admin via Socket
            if (socket) {
                socket.emit('user:order:create', {
                    ...orderData,
                    name: booking.fullName,
                    id: response.id || 'new',
                    code: response.code,
                    total: getTotal(confirmDialog.ordered || []),
                    itemsCount: orderData.items.length
                });
            }

            // Clear cart after successful order
            localStorage.removeItem('cart');
            localStorage.removeItem('bookingInfo');

            setFinalDialog({
                open: true,
                message: orderData.items.length > 0
                    ? "🎉 Đặt bàn & món ăn thành công! Thanh toán sau khi dùng xong bữa."
                    : "🎉 Đặt bàn thành công! Bạn có thể gọi món sau tại nhà hàng.",
                isError: false,
            });

            // Chuyển đến trang lịch sử
            setTimeout(() => router.push("/history"), 2000);
        } catch (error: any) {
            console.error("Error creating order:", error);

            let errorMessage = "❌ Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.";

            if (error?.response?.data?.message) {
                errorMessage = `❌ ${error.response.data.message}`;
                if (error.response.data.remaining_seconds) {
                    errorMessage += `\n⏳ Vui lòng thử lại sau ${Math.ceil(error.response.data.remaining_seconds)} giây.`;
                }
            } else if (error?.message) {
                errorMessage = `❌ ${error.message}`;
            }

            setFinalDialog({
                open: true,
                message: errorMessage,
                isError: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Format time to display with AM/PM
    const formatTime = (timeStr: string) => {
        if (!timeStr) return "";

        // Nếu đã là format HH:MM, parse và hiển thị
        if (timeStr.includes(':')) {
            const [h, m] = timeStr.split(':').map(Number);
            const ampm = h < 12 ? 'AM' : 'PM';
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} (${ampm})`;
        }

        // Convert từ số thập phân (legacy support)
        const timeNum = parseFloat(timeStr);
        const hours = Math.floor(timeNum);
        const minutes = Math.round((timeNum % 1) * 60);
        const ampm = hours < 12 ? 'AM' : 'PM';
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} (${ampm})`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Banner - Giống trang menu */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <Image
                    src="/image/banner4.png"
                    alt="Order Banner"
                    fill
                    className="object-cover brightness-75"
                />
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* LEFT: Booking Info - Sticky */}
                    <div className="md:col-span-5">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <ShoppingBag className="text-orange-500 w-5 h-5" />
                                Thông tin đặt bàn
                            </h2>

                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <User className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Họ và tên</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{booking.fullName}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <Phone className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số điện thoại</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{booking.phone}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <MapPin className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Địa chỉ</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <CalendarDays className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ngày đặt</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {booking.date && !isNaN(new Date(booking.date).getTime())
                                                ? format(new Date(booking.date), "dd/MM/yyyy")
                                                : "Chưa chọn"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <Clock className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Giờ đặt</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {formatTime(booking.time) || "Chưa chọn"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <Users className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Số người</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.guests} người</p>
                                    </div>
                                </div>

                                {booking.notes && (
                                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <StickyNote className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Ghi chú</p>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="mt-6 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Xác nhận đặt bàn"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT: Menu */}
                    <div className="md:col-span-7 space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Bạn có thể chọn món trước để nhà hàng chuẩn bị
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {filteredMenu.length} món ăn {selectedCategoryId || searchTerm ? "được tìm thấy" : "có sẵn"} • Có thể tìm kiếm theo tên hoặc danh mục
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                                <p className="text-sm text-blue-800 dark:text-blue-300">
                                    💡 <span className="font-semibold">Lưu ý:</span> Bạn có thể bỏ qua bước này và gọi món trực tiếp tại nhà hàng.
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative mb-4">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    type="text"
                                    placeholder="Tìm kiếm món ăn..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Button
                                    variant={selectedCategoryId === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategoryId(null)}
                                    className={selectedCategoryId === null
                                        ? "bg-orange-500 hover:bg-orange-600 text-white"
                                        : ""
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
                                            : ""
                                        }
                                    >
                                        {category.name}
                                    </Button>
                                ))}
                            </div>

                            {/* Menu Grid */}
                            <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                {filteredMenu.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p className="text-lg">Không có món ăn nào.</p>
                                    </div>
                                ) : (
                                    filteredMenu.map((dish) => (
                                        <div
                                            key={dish.id}
                                            className="flex gap-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:shadow-md transition-all"
                                        >
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                                <Image
                                                    src={getValidImageUrl(dish)}
                                                    alt={dish.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
                                                    {dish.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                                    {dish.description || "Không có mô tả"}
                                                </p>
                                                <p className="text-orange-500 font-bold">
                                                    {(dish.price || 0).toLocaleString()}đ
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(dish.id, -1)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    -
                                                </Button>
                                                <span className="w-8 text-center font-semibold">
                                                    {quantities[dish.id] || 0}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => updateQuantity(dish.id, 1)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Selected Items Summary - Show if there are items in cart */}
                {Object.keys(quantities).some(id => quantities[parseInt(id)] > 0) && (
                    <div className="mt-8 mb-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg shadow-sm p-6 border border-orange-200 dark:border-orange-800">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <ShoppingBag className="text-orange-500 w-5 h-5" />
                            Món đã chọn từ thực đơn
                        </h2>
                        <div className="grid grid-cols-1 gap-3">
                            {menu
                                .filter(dish => (quantities[dish.id] || 0) > 0)
                                .map(dish => (
                                    <div key={dish.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                            <Image
                                                src={getValidImageUrl(dish)}
                                                alt={dish.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                {dish.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {(dish.price || 0).toLocaleString()}đ
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateQuantity(dish.id, -1)}
                                                className="h-7 w-7 p-0"
                                            >
                                                -
                                            </Button>
                                            <span className="w-8 text-center font-semibold text-sm">
                                                {quantities[dish.id]}
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateQuantity(dish.id, 1)}
                                                className="h-7 w-7 p-0"
                                            >
                                                +
                                            </Button>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <p className="font-bold text-orange-600 text-sm">
                                                {((dish.price || 0) * quantities[dish.id]).toLocaleString()}đ
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-800 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Tạm tính:</span>
                            <span className="text-xl font-bold text-orange-600">
                                {menu
                                    .filter(dish => (quantities[dish.id] || 0) > 0)
                                    .reduce((sum, dish) => sum + (dish.price || 0) * quantities[dish.id], 0)
                                    .toLocaleString()}đ
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Dialog xác nhận món */}
            <Dialog
                open={confirmDialog.open}
                onOpenChange={() =>
                    setConfirmDialog({ open: false, message: "", ordered: [] })
                }
            >
                <DialogContent className="max-w-md bg-white dark:bg-gray-800 rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-orange-600">
                            <ShoppingBag className="w-6 h-6" />
                            {confirmDialog.message}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-3 space-y-3 max-h-[250px] overflow-y-auto">
                        {confirmDialog.ordered?.map((item, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-3 flex justify-between items-center"
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
                        <div className="border-t pt-3 flex justify-between items-center">
                            <span className="font-semibold text-lg flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-orange-500" />
                                Tổng cộng:
                            </span>
                            <span className="font-bold text-lg text-orange-600">
                                {getTotal(confirmDialog.ordered).toLocaleString()}đ
                            </span>
                        </div>
                    )}

                    <Button
                        className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        onClick={handleFinalConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang xử lý...
                            </>
                        ) : (
                            "Xác nhận đặt món & đặt bàn"
                        )}
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Dialog thành công/lỗi */}
            <Dialog
                open={finalDialog.open}
                onOpenChange={() => setFinalDialog({ open: false, message: "", isError: false })}
            >
                <DialogContent className="max-w-sm bg-white dark:bg-gray-800 rounded-2xl text-center">
                    <DialogHeader>
                        <DialogTitle className={`flex items-center justify-center gap-2 text-xl font-semibold ${finalDialog.isError ? "text-red-600" : "text-orange-600"
                            }`}>
                            <CheckCircle2 className={`w-6 h-6 ${finalDialog.isError ? "text-red-500" : "text-green-500"
                                }`} />
                            Thông báo
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line mt-3">
                        {finalDialog.message}
                    </p>
                    <Button
                        className="mt-4 bg-gradient-to-r from-orange-500 to-red-500"
                        onClick={() => setFinalDialog({ open: false, message: "" })}
                    >
                        Đóng
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}
