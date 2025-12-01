"use client";

import Link from "next/link";
import { Activity, ArrowRight, CalendarCheck2, FileText, Layers3, Users, UtensilsCrossed } from "lucide-react";

import { AdminCard, AdminPageHeader } from "@/components/admin/layout/AdminUI";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Đơn hôm nay", value: "18", delta: "+12% so với hôm qua", icon: <CalendarCheck2 className="w-4 h-4" /> },
  { label: "Bàn đang phục vụ", value: "9/24", delta: "Còn 15 bàn trống", icon: <UtensilsCrossed className="w-4 h-4" /> },
  { label: "Khách chờ xác nhận", value: "5", delta: "Ưu tiên xử lý trong 15'", icon: <Users className="w-4 h-4" /> },
  { label: "Cảnh báo tồn kho", value: "3 mặt hàng", delta: "Kiểm tra ngay", icon: <Layers3 className="w-4 h-4" /> },
];

const upcomingBookings = [
  { name: "Nguyễn Văn An", time: "18:30 • hôm nay", people: 4, table: "Khu cửa kính", status: "Chờ xác nhận" },
  { name: "Leah Ẩm Thực", time: "19:00 • hôm nay", people: 2, table: "Bàn VIP 03", status: "Đã cọc" },
  { name: "Công ty TechX", time: "12:00 • 25/11", people: 12, table: "Phòng riêng", status: "Đang duyệt menu" },
];

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
  return (
    <div className="space-y-6">
      <AdminCard className="space-y-6">
        <AdminPageHeader
          title="Bảng điều khiển"
          description="Tổng quan hoạt động trong ngày. Nắm bắt nhanh các tác vụ quan trọng để giữ vận hành trơn tru."
          icon={<Activity className="w-5 h-5 text-[#ff6600]" />}
          actions={
            <Button asChild className="bg-[#ff6600] hover:bg-[#ff7a1a] text-white">
              <Link href="/admin/orders">Tạo đặt bàn mới</Link>
            </Button>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-[#1f1f1f] dark:to-[#151515] p-4"
            >
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{stat.label}</span>
                {stat.icon}
              </div>
              <p className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stat.delta}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#151515] p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Lịch đặt bàn sắp tới</p>
                <h3 className="text-lg font-semibold">3 đơn cần xử lý</h3>
              </div>
              <Link href="/admin/orders" className="text-sm text-[#ff6600] hover:underline">
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <div
                  key={booking.name}
                  className="rounded-xl border border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col gap-1 bg-gray-50/80 dark:bg-[#1f1f1f]"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{booking.name}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30">
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{booking.time} • {booking.people} khách</p>
                  <p className="text-sm text-gray-500">Khu vực: {booking.table}</p>
                </div>
              ))}
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
  );
}
