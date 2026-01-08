"use client";

import Link from "next/link";
import { Activity, ArrowRight, CalendarCheck2, FileText, Users, UtensilsCrossed, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminCard, AdminPageHeader } from "@/components/admin/layout/AdminUI";
import { Button } from "@/components/ui/button";
import { AnalyticsService, DailyStats, MonthlyStats, YearlyStats } from "@/api/analytics/analytics.service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminLoading } from "@/components/admin/layout/AdminLoading";

import { cn } from "@/lib/utils";

const quickLinks = [
  { href: "/admin/orders", title: "Đơn đặt bàn", description: "Kiểm tra & xác nhận đơn mới" },
  { href: "/admin/menu-items", title: "Quản lý món ăn", description: "Cập nhật giá & trạng thái hiển thị" },
  { href: "/admin/ingredients", title: "Tồn kho nguyên liệu", description: "Chủ động nhập hàng" },
  { href: "/admin/users", title: "Phân quyền nhân sự", description: "Thêm quyền truy cập mới" },
];

const todoList = [
  { title: "Xác nhận đơn DH010", detail: "Khách cần bàn 6 người, gửi menu gợi ý.", tag: "Ưu tiên", color: "text-orange-500" },
  { title: "Kiểm tra tồn kho hải sản", detail: "Chỉ còn 8kg tôm sú, đặt bổ sung.", tag: "Kho", color: "text-blue-500" },
  { title: "Đào tạo nhân viên mới", detail: "Nhắc Minh cập nhật quy trình POS.", tag: "Nhân sự", color: "text-purple-500" },
];

export default function AdminPage() {
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [yearlyStats, setYearlyStats] = useState<YearlyStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [daily, monthly, yearly, upcoming] = await Promise.all([
          AnalyticsService.getDailyStats(),
          AnalyticsService.getMonthlyStats(),
          AnalyticsService.getYearlyStats(),
          AnalyticsService.getUpcomingBookings()
        ]);
        setDailyStats(daily.stats);
        setMonthlyStats(monthly.stats);
        setYearlyStats(yearly.stats);
        setUpcomingBookings(upcoming);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const renderStatsCard = (label: string, value: string | number, subtext: string, icon: React.ReactNode, colorClass: string) => (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-[#1f1f1f] dark:to-[#151515] p-4">
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{label}</span>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtext}</p>
    </div>
  );

  return (
    <div className="h-full overflow-auto">
      <div className="space-y-6">
        <AdminCard className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <AdminPageHeader
              title="Bảng điều khiển"
              description="Tổng quan hoạt động kinh doanh và vận hành."
              icon={<Activity className="w-5 h-5 text-[#ff6600]" />}
            />
            <Button asChild className="bg-[#ff6600] hover:bg-[#ff7a1a] text-white">
              <Link href="/admin/orders">Tạo đặt bàn mới</Link>
            </Button>
          </div>

          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Hôm nay</TabsTrigger>
              <TabsTrigger value="monthly">Tháng này</TabsTrigger>
              <TabsTrigger value="yearly">Năm nay</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="mt-0">
              {loading ? <AdminLoading message="Đang tải dữ liệu..." /> : dailyStats && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {renderStatsCard("Tổng đơn hàng", dailyStats.total_orders, `${dailyStats.completed_orders} hoàn thành`, <CalendarCheck2 className="w-5 h-5 text-blue-500" />, "bg-blue-50")}
                  {renderStatsCard("Doanh thu", formatCurrency(dailyStats.total_revenue), "Trong ngày hôm nay", <DollarSign className="w-5 h-5 text-green-500" />, "bg-green-50")}
                  {renderStatsCard("Đang xử lý", dailyStats.pending_orders, "Đơn chờ xác nhận", <UtensilsCrossed className="w-5 h-5 text-orange-500" />, "bg-orange-50")}
                  {renderStatsCard("Đã hủy", dailyStats.cancelled_orders, "Đơn bị hủy", <Users className="w-5 h-5 text-red-500" />, "bg-red-50")}
                </div>
              )}
            </TabsContent>

            <TabsContent value="monthly" className="mt-0">
              {loading ? <AdminLoading message="Đang tải dữ liệu..." /> : monthlyStats && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {renderStatsCard("Tổng đơn tháng", monthlyStats.total_orders, `${monthlyStats.completed_orders} hoàn thành`, <Calendar className="w-5 h-5 text-blue-500" />, "bg-blue-50")}
                  {renderStatsCard("Doanh thu tháng", formatCurrency(monthlyStats.total_revenue), "Trong tháng này", <DollarSign className="w-5 h-5 text-green-500" />, "bg-green-50")}
                  {renderStatsCard("Trung bình/Đơn", formatCurrency(monthlyStats.total_revenue / (monthlyStats.total_orders || 1)), "Giá trị trung bình", <TrendingUp className="w-5 h-5 text-purple-500" />, "bg-purple-50")}
                  {renderStatsCard("Tỷ lệ hủy", `${monthlyStats.total_orders ? Math.round((monthlyStats.cancelled_orders / monthlyStats.total_orders) * 100) : 0}%`, `${monthlyStats.cancelled_orders} đơn hủy`, <Activity className="w-5 h-5 text-red-500" />, "bg-red-50")}
                </div>
              )}
            </TabsContent>

            <TabsContent value="yearly" className="mt-0">
              {loading ? <AdminLoading message="Đang tải dữ liệu..." /> : yearlyStats && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {renderStatsCard("Tổng đơn năm", yearlyStats.total_orders, `${yearlyStats.completed_orders} hoàn thành`, <Calendar className="w-5 h-5 text-blue-500" />, "bg-blue-50")}
                  {renderStatsCard("Doanh thu năm", formatCurrency(yearlyStats.total_revenue), "Trong năm nay", <DollarSign className="w-5 h-5 text-green-500" />, "bg-green-50")}
                  {renderStatsCard("Trung bình/Tháng", formatCurrency(yearlyStats.total_revenue / 12), "Doanh thu TB tháng", <TrendingUp className="w-5 h-5 text-purple-500" />, "bg-purple-50")}
                  {renderStatsCard("Hiệu suất", "Tốt", "Tăng trưởng ổn định", <Activity className="w-5 h-5 text-green-500" />, "bg-green-50")}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#151515] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Lịch đặt bàn sắp tới</p>
                  <h3 className="text-lg font-semibold">{upcomingBookings.length} đơn cần xử lý</h3>
                </div>
                <Link href="/admin/orders" className="text-sm text-[#ff6600] hover:underline">
                  Xem tất cả
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingBookings.length > 0 ? upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col gap-1 bg-gray-50/80 dark:bg-[#1f1f1f]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{booking.ho_ten}</p>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        booking.status === 0 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                      )}>
                        {booking.status === 0 ? "Chờ xác nhận" : "Đã xác nhận"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {booking.booking_time ? booking.booking_time.substring(0, 5) : "--:--"} • {booking.booking_date ? new Date(booking.booking_date).toLocaleDateString('vi-VN') : "--/--/----"} • {booking.quantity} khách
                    </p>
                    <p className="text-sm text-gray-500">Khu vực: {booking.table ? booking.table.name : "Chưa chọn bàn"}</p>
                  </div>
                )) : (
                  <div className="text-center py-4 text-gray-500 text-sm">Hiện không có lịch đặt bàn nào sắp tới</div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#151515] p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Công việc cần làm</p>
                  <h3 className="text-lg font-semibold">Danh sách ưu tiên</h3>
                </div>
              </div>
              <div className="space-y-3">
                {todoList.map((task) => (
                  <div key={task.title} className="rounded-xl border border-gray-100 dark:border-gray-800 p-3 bg-gray-50/70 dark:bg-[#1f1f1f]">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{task.title}</p>
                      <span className={`text-xs font-semibold ${task.color}`}>{task.tag}</span>
                    </div>
                    <p className="text-sm text-gray-500">{task.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AdminCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <AdminCard className="space-y-4">
            <AdminPageHeader
              title="Lối tắt quản trị"
              description="Đi tới những khu vực thường xuyên thao tác chỉ với một cú nhấp."
              icon={<FileText className="w-5 h-5 text-[#3b82f6]" />}
            />
            <div className="grid gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 hover:border-[#3b82f6] hover:bg-blue-50/50 dark:hover:bg-[#1b2537] transition"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{link.title}</p>
                    <p className="text-sm text-gray-500">{link.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </AdminCard>

          <AdminCard className="space-y-4">
            <AdminPageHeader
              title="Nhật ký vận hành"
              description="Theo dõi nhanh những cập nhật gần nhất của đội ngũ."
              icon={<Activity className="w-5 h-5 text-[#3b82f6]" />}
            />
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                <div>
                  <p className="font-medium">Minh đã hoàn tất đơn DH008</p>
                  <p className="text-sm text-gray-500">10 phút trước • Đơn trị giá 2.3 triệu</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                <div>
                  <p className="font-medium">Tồn kho cảnh báo</p>
                  <p className="text-sm text-gray-500">Hải sản đông lạnh dưới ngưỡng an toàn</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div>
                  <p className="font-medium">Đã thêm nhân viên mới</p>
                  <p className="text-sm text-gray-500">Tài khoản MaiLinh • quyền quản lý bàn</p>
                </div>
              </li>
            </ul>
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
