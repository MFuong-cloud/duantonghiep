"use client";

import { useState, useEffect, useMemo } from "react";
import { User, Phone, Calendar as CalendarIcon, Clock, Users, FileText, UtensilsCrossed, Plus, Trash2, ShoppingCart, Tag, Minus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { OrderService, CreateOrderData } from "@/api/orders/order.service";
import { OrderDetailService } from "@/api/orders/order-detail.service";
import { DishService } from "@/api/menu/menu.service";
import { CategoryService } from "@/api/categories/category.service";
import { TableService } from "@/api/tables/table.service";
import { Dish } from "@/model/Dish";
import { Category } from "@/model/Category";
import { Table } from "@/model/Table";
import { Order } from "@/model/Order";

interface OrderFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    order?: Order | null;
}

interface FormData {
    ho_ten: string;
    phone: string;
    booking_date: string;
    booking_time: string;
    quantity: number | string;
    note: string;
    table_id?: number | null;
    items: { dish_id: number; quantity: number; price: number }[];
}

const EMPTY_FORM: FormData = {
    ho_ten: "",
    phone: "",
    booking_date: "",
    booking_time: "",
    quantity: 1,
    note: "",
    table_id: null,
    items: [],
};

export default function OrderFormDialog({ open, onOpenChange, onSuccess, order }: OrderFormDialogProps) {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedDish, setSelectedDish] = useState<number | null>(null);
    const [openDate, setOpenDate] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dishesData, categoriesData] = await Promise.all([
                    DishService.getDishes(),
                    CategoryService.getCategories(),
                ]);
                setDishes(dishesData.filter(d => d.status));
                setCategories(categoriesData.filter(c => c.status));
            } catch (error) {
                console.error("Error loading data:", error);
                toast.error("Không thể tải dữ liệu món ăn");
            }
        };

        const fetchTables = async () => {
            try {
                const tablesRes = await TableService.getTables();
                setTables(tablesRes);
            } catch (error) {
                console.error("Error loading tables:", error);
            }
        };

        if (open) {
            fetchData();
            fetchTables();
        }
    }, [open]);

    const filteredDishes = useMemo(() => {
        if (!selectedCategory) return dishes;
        return dishes.filter(d => d.category_id === selectedCategory);
    }, [dishes, selectedCategory]);

    useEffect(() => {
        if (open) {
            if (order) {
                // Edit mode - populate form with order data
                setFormData({
                    ho_ten: order.ho_ten,
                    phone: order.phone,
                    booking_date: order.booking_date,
                    booking_time: order.booking_time.toString(),
                    quantity: order.quantity,
                    note: order.note || "",
                    table_id: order.table_id || null,
                    items: order.details?.map(d => ({
                        dish_id: d.dish_id,
                        quantity: d.quantity,
                        price: d.price
                    })) || [],
                });
                // Set selected date for calendar
                if (order.booking_date) {
                    setSelectedDate(new Date(order.booking_date));
                }
            } else {
                // Create mode - reset form
                setFormData(EMPTY_FORM);
                setSelectedDate(null);
            }
            setSelectedCategory(null);
            setSelectedDish(null);
        }
    }, [open, order]);

    const handleAddDish = () => {
        if (!selectedDish) {
            toast.error("Vui lòng chọn món ăn");
            return;
        }

        const dish = dishes.find(d => d.id === selectedDish);
        if (!dish) return;

        // Check if dish already exists
        const existingIndex = formData.items.findIndex(item => item.dish_id === selectedDish);

        if (existingIndex >= 0) {
            // Update quantity (+1)
            const newItems = [...formData.items];
            newItems[existingIndex].quantity += 1;
            setFormData({ ...formData, items: newItems });
            toast.success("Đã tăng số lượng món");
        } else {
            // Add new item with quantity 1
            setFormData({
                ...formData,
                items: [...formData.items, {
                    dish_id: selectedDish,
                    quantity: 1,
                    price: dish.price || 0
                }]
            });
            toast.success("Đã thêm món vào đơn");
        }

        setSelectedDish(null);
    };

    const handleRemoveDish = (dishId: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter(item => item.dish_id !== dishId)
        });
        toast.success("Đã xóa món khỏi đơn");
    };

    const handleUpdateDishQuantity = (dishId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        const newItems = formData.items.map(item =>
            item.dish_id === dishId ? { ...item, quantity: newQuantity } : item
        );
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation với messages tiếng Việt chuyên nghiệp
        if (!formData.ho_ten.trim()) {
            toast.error("Vui lòng nhập họ tên khách hàng");
            return;
        }
        if (!formData.phone.trim()) {
            toast.error("Vui lòng nhập số điện thoại");
            return;
        }
        if (!/^[0-9]{10,11}$/.test(formData.phone.trim())) {
            toast.error("Số điện thoại không hợp lệ (10-11 chữ số)");
            return;
        }
        if (!formData.booking_date) {
            toast.error("Vui lòng chọn ngày đặt bàn");
            return;
        }
        if (!formData.booking_time) {
            toast.error("Vui lòng chọn giờ đặt bàn");
            return;
        }
        const qty = typeof formData.quantity === 'string' ? parseInt(formData.quantity) : formData.quantity;
        if (!qty || qty < 1) {
            toast.error("Số lượng người phải lớn hơn 0");
            return;
        }

        try {
            setLoading(true);

            const orderData: CreateOrderData = {
                ho_ten: formData.ho_ten,
                phone: formData.phone,
                booking_date: formData.booking_date,
                booking_time: formData.booking_time,
                quantity: typeof formData.quantity === 'string' ? parseInt(formData.quantity) || 1 : formData.quantity,
                note: formData.note || undefined,
                items: formData.items,
            };

            if (order) {
                // Update order - chỉ cập nhật thông tin cơ bản, KHÔNG gửi items
                const updateData = {
                    ho_ten: formData.ho_ten,
                    phone: formData.phone,
                    booking_date: formData.booking_date,
                    booking_time: formData.booking_time,
                    quantity: typeof formData.quantity === 'string' ? parseInt(formData.quantity) || 1 : formData.quantity,
                    note: formData.note || undefined,
                    status: order.status,
                    table_id: formData.table_id || undefined
                };

                await OrderService.updateOrder(order.id, updateData);

                // Xử lý items riêng biệt
                // So sánh items hiện tại với items ban đầu của order
                const existingItems = order.details || [];
                const currentItems = formData.items;

                // Tìm items mới (chưa có trong order)
                const newItems = currentItems.filter(item =>
                    !existingItems.some(existing => existing.dish_id === item.dish_id)
                );

                // Thêm các món mới vào đơn hàng
                for (const item of newItems) {
                    await OrderDetailService.createOrderDetail({
                        order_id: order.id,
                        dish_id: item.dish_id,
                        quantity: item.quantity,
                        price: item.price,
                    });
                }

                // Cập nhật số lượng các món đã tồn tại (nếu thay đổi)
                for (const item of currentItems) {
                    const existingItem = existingItems.find(e => e.dish_id === item.dish_id);
                    if (existingItem && existingItem.quantity !== item.quantity) {
                        await OrderDetailService.updateOrderDetail(existingItem.id, {
                            quantity: item.quantity,
                        });
                    }
                }

                // Xóa các món đã bị loại bỏ
                const removedItems = existingItems.filter(existing =>
                    !currentItems.some(item => item.dish_id === existing.dish_id)
                );
                for (const item of removedItems) {
                    await OrderDetailService.deleteOrderDetail(item.id);
                }

                // Assign table if changed
                if (formData.table_id && formData.table_id !== order.table_id) {
                    await OrderService.assignTable(order.id, { table_id: formData.table_id });
                }

                toast.success("Cập nhật đơn đặt chỗ thành công!");
                onSuccess();
                onOpenChange(false);
            } else {
                // Create new order
                const createdOrder = await OrderService.createOrder(orderData);

                // Assign table if selected
                if (formData.table_id) {
                    await OrderService.assignTable(createdOrder.id, { table_id: formData.table_id });
                }

                toast.success("Tạo đơn đặt chỗ thành công!");
                onSuccess();
                onOpenChange(false);
            }
        } catch (error: unknown) {
            console.error("Error saving order:", error);
            const message = error instanceof Error ? error.message : "Không thể lưu đơn đặt chỗ";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const getDishName = (dishId: number) => {
        return dishes.find(d => d.id === dishId)?.name || `Món #${dishId}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace(',00', '');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full !max-w-[95vw] sm:!max-w-[95vw] p-0 overflow-hidden bg-white dark:bg-[#1f1f1f] rounded-2xl shadow-xl h-[95vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#252525] flex justify-between items-center shrink-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-blue-500" />
                        {order ? "Cập nhật đơn đặt chỗ" : "Thêm đơn đặt chỗ mới"}
                    </DialogTitle>
                </div>

                <form onSubmit={handleSubmit} noValidate className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full">
                            {/* Cột trái - Thông tin khách hàng & đặt chỗ */}
                            <div className="space-y-4">
                                {/* Thông tin khách hàng */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                                            Họ và tên <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        value={formData.ho_ten}
                                        onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-base"
                                        placeholder="Nhập họ tên khách hàng"
                                    />
                                </div>

                                {/* Số điện thoại */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                                            Số điện thoại <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-base"
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                {/* Ngày & Giờ đặt */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                                <CalendarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">
                                                Ngày <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <Popover open={openDate} onOpenChange={setOpenDate}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left font-normal px-4 py-3 h-auto rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] hover:bg-gray-50 dark:hover:bg-[#333]"
                                                >
                                                    {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "Chọn ngày"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate ?? undefined}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setSelectedDate(date);
                                                            setFormData({ ...formData, booking_date: format(date, "yyyy-MM-dd") });
                                                            setOpenDate(false);
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">
                                                Giờ (24h) <span className="text-red-500">*</span>
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                max="23"
                                                value={formData.booking_time.split(':')[0] || ''}
                                                onChange={(e) => {
                                                    const hour = e.target.value;
                                                    const minute = formData.booking_time.split(':')[1] || '00';
                                                    setFormData({ ...formData, booking_time: `${hour}:${minute}` });
                                                }}
                                                onBlur={(e) => {
                                                    const hour = e.target.value.padStart(2, '0');
                                                    const minute = formData.booking_time.split(':')[1] || '00';
                                                    setFormData({ ...formData, booking_time: `${hour}:${minute}` });
                                                }}
                                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-base text-center font-mono"
                                                placeholder="HH"
                                            />
                                            <span className="text-2xl font-bold text-gray-400">:</span>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                max="59"
                                                value={formData.booking_time.split(':')[1] || ''}
                                                onChange={(e) => {
                                                    const hour = formData.booking_time.split(':')[0] || '00';
                                                    const minute = e.target.value;
                                                    setFormData({ ...formData, booking_time: `${hour}:${minute}` });
                                                }}
                                                onBlur={(e) => {
                                                    const hour = formData.booking_time.split(':')[0] || '00';
                                                    const minute = e.target.value.padStart(2, '0');
                                                    setFormData({ ...formData, booking_time: `${hour}:${minute}` });
                                                }}
                                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-base text-center font-mono"
                                                placeholder="MM"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Số người */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                                            Số người <span className="text-red-500">*</span>
                                        </label>
                                    </div>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setFormData({ ...formData, quantity: value === '' ? '' : parseInt(value) || 0 });
                                        }}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-base [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        placeholder="Nhập số lượng người"
                                    />
                                </div>

                                {/* Ghi chú */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Ghi chú</label>
                                    </div>
                                    <textarea
                                        rows={3}
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2a2a2a] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none text-sm"
                                        placeholder="Ghi chú đặc biệt (nếu có)..."
                                    />
                                </div>
                            </div>

                            {/* Cột phải - Chọn món ăn */}
                            <div className="flex flex-col gap-4 h-full">
                                {/* Chọn Bàn - NEW */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 shrink-0">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                            <UtensilsCrossed className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">
                                            Chọn bàn
                                        </label>
                                    </div>
                                    <Combobox
                                        value={formData.table_id?.toString() || ""}
                                        onValueChange={(value) => setFormData({ ...formData, table_id: value ? parseInt(value) : null })}
                                        options={[
                                            { value: "", label: "-- Chọn bàn --" },
                                            ...tables.map(table => ({
                                                value: table.id.toString(),
                                                label: `${table.name} (${table.capacity} người) - ${table.status === 'occupied' ? 'Đang có khách' : table.status === 'reserved' ? 'Đã đặt' : 'Trống'}`
                                            }))
                                        ]}
                                        placeholder="Chọn bàn..."
                                        emptyText="Không tìm thấy bàn"
                                    />
                                </div>

                                {/* Thêm món */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 shrink-0">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                                            <UtensilsCrossed className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                        </div>
                                        <label className="text-sm font-bold text-gray-900 dark:text-white">Thêm món ăn</label>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Chọn danh mục */}
                                        <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1 bg-purple-50 dark:bg-purple-900/20 rounded">
                                                    <Tag className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Lọc theo danh mục</label>
                                            </div>
                                            <Combobox
                                                value={selectedCategory?.toString() || ""}
                                                onValueChange={(value) => setSelectedCategory(value ? parseInt(value) : null)}
                                                options={[
                                                    { value: "", label: "Tất cả danh mục" },
                                                    ...categories.map(cat => ({
                                                        value: cat.id.toString(),
                                                        label: cat.name
                                                    }))
                                                ]}
                                                placeholder="Chọn danh mục..."
                                                emptyText="Không tìm thấy danh mục"
                                            />
                                        </div>

                                        {/* Chọn món ăn */}
                                        <div className="bg-white dark:bg-[#1f1f1f] rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                                                    <UtensilsCrossed className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                    Chọn món ăn {selectedCategory && `(${filteredDishes.length} món)`}
                                                </label>
                                            </div>
                                            <Combobox
                                                value={selectedDish?.toString() || ""}
                                                onValueChange={(value) => setSelectedDish(value ? parseInt(value) : null)}
                                                options={filteredDishes.map(dish => ({
                                                    value: dish.id.toString(),
                                                    label: `${dish.name} - ${formatCurrency(dish.price || 0)}`
                                                }))}
                                                placeholder={filteredDishes.length > 0 ? "Tìm kiếm món ăn..." : "Chọn danh mục trước"}
                                                emptyText="Không tìm thấy món ăn"
                                                disabled={filteredDishes.length === 0}
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            onClick={handleAddDish}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            disabled={!selectedDish}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Thêm món
                                        </Button>
                                    </div>
                                </div>

                                {/* Danh sách món đã chọn */}
                                <div className="bg-white dark:bg-[#1f1f1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex-1 flex flex-col min-h-0">
                                    <div className="flex items-center justify-between mb-3 shrink-0">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                                                <ShoppingCart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <label className="text-sm font-bold text-gray-900 dark:text-white">
                                                Món đã chọn ({formData.items.length})
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                                        {formData.items.length === 0 ? (
                                            <div className="text-center py-8 text-gray-400">
                                                <UtensilsCrossed className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                <p className="text-sm">Chưa có món nào</p>
                                            </div>
                                        ) : (
                                            formData.items.map((item) => (
                                                <div key={item.dish_id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                            {getDishName(item.dish_id)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {formatCurrency(item.price)} x {item.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateDishQuantity(item.dish_id, item.quantity - 1)}
                                                            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-semibold text-gray-900 dark:text-white">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUpdateDishQuantity(item.dish_id, item.quantity + 1)}
                                                            className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveDish(item.dish_id)}
                                                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-1"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 ml-2">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Tổng tiền */}
                                    {formData.items.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-bold text-gray-900 dark:text-white">Tổng cộng:</span>
                                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                    {formatCurrency(calculateTotal())}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1f1f1f] shrink-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="px-6 h-11 text-base" disabled={loading}>
                            Hủy bỏ
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11 text-base font-semibold" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Đang xử lý...
                                </>
                            ) : (
                                order ? "Cập nhật đơn" : "Tạo đơn đặt chỗ"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
