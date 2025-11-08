"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Info } from "lucide-react";
import SearchBox from "./SearchBox";
import { ToggleTheme } from "../toggle-theme";

export default function AdminHeader({
  sidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);

  // Đóng menu tài khoản khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧭 Thông tin breadcrumb + title
  const pageInfoMap: Record<string, { breadcrumb: string; title: string }> = {
    "/admin": {
      breadcrumb: "Bảng Điều Khiển",
      title: "Tổng quan hệ thống",
    },
    "/admin/orders": {
      breadcrumb: "Quản lý đơn đặt hàng",
      title: "Danh sách đơn hàng",
    },
    "/admin/orders/detail": {
      breadcrumb: "Chi tiết đơn hàng",
      title: "Thông tin đơn hàng",
    },
  };

  const currentPageInfo =
    pageInfoMap[pathname] || {
      breadcrumb: "Chi tiết",
      title: "Thông tin chi tiết",
    };

  // 📜 Danh sách trang để search
  const pages = [
    { name: "Bảng Điều Khiển", path: "/admin" },
    { name: "Quản lý đơn đặt hàng", path: "/admin/orders" },
    { name: "Chi tiết đơn hàng", path: "/admin/orders/detail" },
  ];

  // 🎨 Màu cam chủ đạo — chỉ cần đổi 1 dòng này để đổi toàn hệ thống
  const accentColor = "#FFA559"; // 👉 đổi tại đây nếu muốn (#FF8C42, #F97316,...)

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-[#0E0E0E] border-b border-gray-200 dark:border-[#2A2A2A] sticky top-0 z-50 shadow-sm">
      {/* Left section */}
      <div className="flex items-center gap-3 w-[25%] min-w-[200px]">
        {/* Nút mở sidebar */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>

        {/* Breadcrumb + Tiêu đề */}
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <Link
              href="/admin"
              className="hover:text-[var(--accent)] transition font-medium"
              style={{ "--accent": accentColor } as React.CSSProperties}
            >
              Trang
            </Link>{" "}
            /{" "}
            <span
              className="font-semibold"
              style={{ color: accentColor }}
            >
              {currentPageInfo.breadcrumb}
            </span>
          </div>
          <h1
            className="text-lg md:text-xl font-semibold mt-1"
            style={{ color: accentColor }}
          >
            {currentPageInfo.title}
          </h1>
        </div>
      </div>

      {/* Middle search */}
      <div className="flex justify-center flex-1 mx-4">
        <div className="w-[min(720px,100%)]">
          <SearchBox pages={pages} placeholder="Tìm chức năng, trang, đơn..." />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 w-[25%] justify-end min-w-[200px]">
        <Bell
          className="w-5 h-5 text-gray-500 dark:text-gray-300 cursor-pointer transition-all duration-200 hover:scale-110"
          style={{ "--accent": accentColor } as React.CSSProperties}
          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "")}
        />
        <Info
          className="w-5 h-5 text-gray-500 dark:text-gray-300 cursor-pointer transition-all duration-200 hover:scale-110"
          style={{ "--accent": accentColor } as React.CSSProperties}
          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "")}
        />
        <ToggleTheme />

        {/* Avatar + menu tài khoản */}
        <div className="relative" ref={accountRef}>
          <button
            onClick={() => setAccountOpen((v) => !v)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition"
          >
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="w-8 h-8 rounded-full"
              style={{ border: `2px solid ${accentColor}` }}
            />
            <span className="hidden md:inline text-sm font-medium text-gray-800 dark:text-gray-100">
              Ông chủ
            </span>
          </button>

          {accountOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2A2A2A] rounded-lg shadow-md overflow-hidden z-50">
              <Link
                href="/"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
              >
                Về trang người dùng
              </Link>
              <Link
                href="/admin/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
              >
                Trang cá nhân
              </Link>
              <button
                onClick={() => console.log("Logout clicked")}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
