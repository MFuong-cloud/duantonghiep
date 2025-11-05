"use client";

import { usePathname } from "next/navigation";
import AdminHeader from "../../components/admin/AdminHeader";
import Sidebar from "../../components/admin/Sidebar";
import "@/app/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);

  const formatTitle = (segment: string) => {
    switch (segment) {
      case "admin":
        return "Bảng Điều Khiển Chính";
      case "orders":
        return "Quản Lý Đơn Đặt Hàng";
      case "detail":
        return "Chi Tiết Đơn Hàng";
      default:
        return segment.charAt(0).toUpperCase() + segment.slice(1);
    }
  };

  const currentTitle = formatTitle(
    pathSegments[pathSegments.length - 1] || "admin"
  );
  const breadcrumb = ["Trang", ...pathSegments.map(formatTitle)].join(" / ");

  return (
    <div className="flex bg-white dark:bg-[#121212] min-h-screen text-black dark:text-gray-100 transition-colors duration-300">
      {/*  Sidebar */}
      <Sidebar />

      {/* Khu vực nội dung */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-tl-2xl transition-colors duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
