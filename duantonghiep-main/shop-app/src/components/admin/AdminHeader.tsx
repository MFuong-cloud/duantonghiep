"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Info } from "lucide-react";
import SearchBox from "./SearchBox";
import { ToggleTheme } from "../toggle-theme";

export default function AdminHeader() {
  const pathname = usePathname();


  const pageTitleMap: Record<string, string> = {
    "/admin": "Bảng Điều Khiển Chính",
    "/admin/orders": "Quản lý đơn đặt hàng",
    "/admin/orders/detail": "Chi tiết đơn hàng",
  };

  const currentTitle = pageTitleMap[pathname] || "Chi tiết đơn hàng";

  
  const pages = [
    { name: "Bảng Điều Khiển Chính", path: "/admin" },
    { name: "Quản lý đơn đặt hàng", path: "/admin/orders" },
    { name: "Chi tiết đơn hàng", path: "/admin/orders/detail" },
  ];

  return (
    <header
      className="flex items-center justify-between px-6 py-4 
      bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 
      shadow-sm relative border-b border-gray-200 dark:border-gray-700 
      transition-colors duration-300"
    >
     
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <Link
            href="/admin"
            className="hover:text-[#ff6600] transition font-medium"
          >
            Trang
          </Link>{" "}
          /{" "}
          <span className="text-[#ff6600] font-semibold">{currentTitle}</span>
        </div>
        <h1 className="text-2xl font-semibold mt-1 text-[#ff6600]">
          {currentTitle}
        </h1>
      </div>

     
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <SearchBox pages={pages} placeholder="Tìm trang..." />
      </div>

     
      <div className="flex items-center gap-5 relative">
        <div className="flex items-center gap-4">
       
          <Bell className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-[#ff6600] transition-all duration-200 hover:scale-110" />

          
          <Info className="w-5 h-5 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-[#ff6600] transition-all duration-200 hover:scale-110" />

          
          <ToggleTheme />
        </div>

        {/* Avatar người dùng */}
        <img
          src="https://i.pravatar.cc/40"
          alt="User Avatar"
          className="w-9 h-9 rounded-full border-2 border-[#ff6600] shadow-sm cursor-pointer hover:scale-105 transition-all"
        />
      </div>
    </header>
  );
}
