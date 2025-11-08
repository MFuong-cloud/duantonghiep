"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaListAlt,
  FaFileInvoice,
  FaUtensils,
  FaWarehouse,
  FaUsers,
  FaStore,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Croissant } from "lucide-react"; // logo

interface Props {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: Props) {
  const pathname = usePathname();
  const [openOrders, setOpenOrders] = useState(false);


  const activeClass =
    "bg-orange-100 dark:bg-[#3b2a18] text-orange-600 dark:text-orange-300 shadow-sm";
  const hoverClass =
    "hover:bg-orange-50 dark:hover:bg-[#2a1a0c]/60 hover:text-orange-500 dark:hover:text-orange-200";

  const linkBase =
    "group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-[15px] font-medium";

  const menuItems = [
    { href: "/admin/menu-categories", icon: <FaFileInvoice />, text: "Danh mục món" },
    { href: "/admin/menu-items", icon: <FaUtensils />, text: "Món ăn / combo" },
    { href: "/admin/ingredients", icon: <FaWarehouse />, text: "Nguyên liệu & kho" },
    { href: "/admin/branches", icon: <FaStore />, text: "Chi nhánh" },
    { href: "/admin/users", icon: <FaUsers />, text: "Người dùng" },
  ];

  return (
    <div className="h-full flex flex-col justify-start p-4 bg-white dark:bg-[#0B0B0B] border-r border-gray-200 dark:border-[#1F2937] shadow-lg">
      {/* Logo */}
      <div className={`flex items-center gap-3 mb-6 ${collapsed ? "justify-center" : ""}`}>
        <motion.div
          whileHover={{
            scale: 1.15,
            rotate: 8,
            boxShadow: "0px 0px 20px 4px rgba(255, 180, 120, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-300 text-white cursor-pointer"
        >
          <Croissant className="w-6 h-6 text-white" />
        </motion.div>

        {!collapsed && (
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-100 tracking-tight">
            Admin TableGo
          </h2>
        )}
      </div>

      {/* Avatar */}
      <div className={`mb-6 ${collapsed ? "flex justify-center" : ""}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`flex items-center gap-3 ${collapsed ? "flex-col" : ""}`}
        >
          <img
            src="https://i.pravatar.cc/80?img=7"
            alt="Admin Avatar"
            className={`rounded-full border border-gray-300 dark:border-gray-700 shadow-md ${
              collapsed ? "w-10 h-10" : "w-14 h-14"
            }`}
          />
          {!collapsed && (
            <div>
              <div className="font-semibold text-gray-800 dark:text-gray-100">Ông chủ</div>
              <div className="text-xs text-gray-400">Admin • TableGo</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1">
        <button
          onClick={() => setOpenOrders(!openOrders)}
          className={`${linkBase} w-full justify-between ${
            pathname.startsWith("/admin/orders") ? activeClass : hoverClass
          }`}
        >
          <div className="flex items-center gap-2">
            <FaListAlt size={16} />
            {!collapsed && <span>Quản lý đơn hàng</span>}
          </div>
          {!collapsed &&
            (openOrders ? <IoIosArrowDown /> : <IoIosArrowForward />)}
        </button>

        <motion.div
          initial={false}
          animate={{
            height: openOrders && !collapsed ? "auto" : 0,
            opacity: openOrders && !collapsed ? 1 : 0,
          }}
          transition={{ duration: 0.25 }}
          className="ml-6 overflow-hidden"
        >
          <Link
            href="/admin/orders"
            className={`block px-3 py-2 rounded-md text-[14px] ${
              pathname === "/admin/orders" ? activeClass : hoverClass
            }`}
          >
            • Danh sách đơn hàng
          </Link>
          <Link
            href="/admin/orders/ORD-1001"
            className={`block px-3 py-2 rounded-md text-[14px] ${
              pathname === "/admin/orders/ORD-1001" ? activeClass : hoverClass
            }`}
          >
            • Chi tiết đơn hàng
          </Link>
        </motion.div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${linkBase} ${isActive ? activeClass : hoverClass}`}
            >
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                {item.icon}
              </motion.div>
              {!collapsed && <span>{item.text}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-6 pt-3 border-t border-gray-200 dark:border-[#1F2937] text-xs text-gray-400">
          <span>Phiên bản: 1.0.0</span>
        </div>
      )}
    </div>
  );
}
