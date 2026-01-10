"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ClipboardList, Filter, CreditCard, CalendarIcon, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import AdminPageLayout from "@/components/admin/layout/AdminPageLayout";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminCard } from "@/components/admin/layout/AdminUI";
import { Pagination } from "@/components/admin/pagination/Pagination";
import { toast } from "sonner";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";
import { PaymentService } from "@/api/payment/payment.service";
import { Payment } from "@/model/Payment";
import PaymentDetailDialog from "@/components/admin/dialogs/PaymentDetailDialog";

export default function PaymentHistory() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [dateInput, setDateInput] = useState("");
    const [filterMethod, setFilterMethod] = useState<"all" | "momo" | "cash">("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [openDatePicker, setOpenDatePicker] = useState(false);

    const itemsPerPage = 10;

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const data = await PaymentService.getPayments();
            setPayments(data);
        } catch (error: unknown) {
            console.error("Error fetching payments:", error);
            toast.error("Không thể tải lịch sử thanh toán");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const searchLower = search.toLowerCase();
            const matchSearch =
                payment.id.toString().includes(search) ||
                payment.order_id.toString().includes(search) ||
                (payment.transaction_code && payment.transaction_code.toLowerCase().includes(searchLower)) ||
                (payment.user?.name && payment.user.name.toLowerCase().includes(searchLower)) ||
                (payment.order?.ho_ten && payment.order.ho_ten.toLowerCase().includes(searchLower));

            // Lọc theo ngày
            let matchDate = true;
            if (selectedDate) {
                const paymentDate = new Date(payment.created_at);
                matchDate = paymentDate.getDate() === selectedDate.getDate() &&
                    paymentDate.getMonth() === selectedDate.getMonth() &&
                    paymentDate.getFullYear() === selectedDate.getFullYear();
            }

            const matchMethod = filterMethod === "all" ? true : payment.method === filterMethod;

            return matchSearch && matchDate && matchMethod;
        });
    }, [payments, search, selectedDate, filterMethod]);

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        return d.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <AdminPageLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1f1f1f] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        Lịch sử thanh toán
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm mã đơn, tên khách..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-56"
                            />
                        </div>

                        <div className="flex items-center gap-1">
                            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                <PopoverTrigger asChild>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                        <input
                                            type="text"
                                            placeholder="dd/MM/yyyy"
                                            value={dateInput}
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                value = value.replace(/[^\d/]/g, '');
                                                if (value.length > 10) return;

                                                const parts = value.split('/');
                                                if (value.length > dateInput.length) {
                                                    if (parts.length === 1 && parts[0].length === 2) value = parts[0] + '/';
                                                    else if (parts.length === 2 && parts[1].length === 2) value = parts[0] + '/' + parts[1] + '/';
                                                }
                                                setDateInput(value);
                                            }}
                                            onBlur={() => {
                                                if (dateInput.trim() === "") {
                                                    setSelectedDate(undefined);
                                                    setCurrentPage(1);
                                                    return;
                                                }
                                                const parts = dateInput.split('/');
                                                if (parts.length === 3) {
                                                    const day = parseInt(parts[0]);
                                                    const month = parseInt(parts[1]) - 1;
                                                    const year = parseInt(parts[2]);
                                                    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                                                        const newDate = new Date(year, month, day);
                                                        if (newDate.getDate() === day && newDate.getMonth() === month && newDate.getFullYear() === year) {
                                                            setSelectedDate(newDate);
                                                            setDateInput(format(newDate, "dd/MM/yyyy", { locale: vi }));
                                                            setCurrentPage(1);
                                                        } else setDateInput(selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "");
                                                    } else setDateInput(selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "");
                                                } else setDateInput(selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: vi }) : "");
                                            }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                                            className="pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2a2a2a] text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-32"
                                        />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="p-0 border-amber-100 w-auto">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) => {
                                            setSelectedDate(date);
                                            setDateInput(date ? format(date, "dd/MM/yyyy", { locale: vi }) : "");
                                            setOpenDatePicker(false);
                                            setCurrentPage(1);
                                        }}
                                        locale={vi}
                                    />
                                </PopoverContent>
                            </Popover>
                            {selectedDate && (
                                <button
                                    onClick={() => {
                                        setSelectedDate(undefined);
                                        setDateInput("");
                                        setCurrentPage(1);
                                    }}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    title="Xóa bộ lọc ngày"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 h-8 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
                                    <Filter className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline text-xs">Lọc</span>
                                    {filterMethod !== 'all' && (
                                        <span className="ml-1 flex h-1.5 w-1.5 rounded-full bg-green-600" />
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Phương thức</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={filterMethod} onValueChange={(v) => { setFilterMethod(v as "all" | "momo" | "cash"); setCurrentPage(1); }}>
                                    <DropdownMenuRadioItem value="all">Tất cả</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="cash">Tiền mặt</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="momo">MoMo</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            }
        >
            <div className="md:hidden relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Tìm mã đơn, tên khách..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f1f1f] shadow-sm text-sm"
                />
            </div>

            <AdminCard className="flex flex-col border-none shadow-md p-0 h-full rounded-xl overflow-hidden">
                {loading ? (
                    <AdminLoading message="Đang tải lịch sử thanh toán..." />
                ) : (
                    <>
                        <div className="flex-1 overflow-auto min-h-0">
                            <table className="w-full text-sm text-center">
                                <thead className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600 text-xs uppercase text-gray-900 dark:text-white font-bold tracking-wider shadow-sm">
                                    <tr>
                                        <th className="px-6 py-4">Mã đơn</th>
                                        <th className="px-6 py-4">Khách hàng</th>
                                        <th className="px-6 py-4">Số tiền</th>
                                        <th className="px-6 py-4">Phương thức</th>
                                        <th className="px-6 py-4">Mã giao dịch</th>
                                        <th className="px-6 py-4">Ngày thanh toán</th>
                                        <th className="px-6 py-4">Trạng thái</th>
                                        <th className="px-6 py-4">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1f1f1f]">
                                    {currentPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-400">
                                                    <div className="bg-gray-50 dark:bg-[#2a2a2a] p-4 rounded-full mb-3">
                                                        <ClipboardList className="w-8 h-8 opacity-50" />
                                                    </div>
                                                    <p>Không tìm thấy giao dịch nào</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentPayments.map((payment) => (
                                            <tr
                                                key={payment.id}
                                                className="group hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-colors duration-200"
                                            >
                                                <td className="px-6 py-4 font-mono font-semibold text-blue-600">{payment.order?.code || payment.order_id}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                                                    <div className="font-semibold">{payment.order?.ho_ten || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{payment.order?.phone}</div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-green-600 dark:text-green-400">
                                                    {formatCurrency(payment.amount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${payment.method === 'momo'
                                                        ? 'bg-pink-100 text-pink-700 border border-pink-200'
                                                        : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                                        {payment.method}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                    {payment.transaction_code || '-'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                    {formatDateTime(payment.paid_at || payment.created_at)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium border border-green-200">
                                                        Thành công
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPayment(payment);
                                                            setDetailDialogOpen(true);
                                                        }}
                                                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                                                        title="Xem chi tiết"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex-shrink-0 p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-[#1f1f1f]">
                            <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </div>
                    </>
                )}
            </AdminCard>

            {/* Payment Detail Dialog */}
            <PaymentDetailDialog
                open={detailDialogOpen}
                onOpenChange={setDetailDialogOpen}
                payment={selectedPayment}
            />
        </AdminPageLayout>
    );
}
