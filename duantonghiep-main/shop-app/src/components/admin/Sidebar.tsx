"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaListAlt, FaFileInvoice } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

export default function Sidebar() {
  const pathname = usePathname();
  const [openOrders, setOpenOrders] = useState(false); // 

  return (
    <aside
      className="w-64 bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 
                 min-h-screen p-4 border-r border-gray-200 dark:border-gray-700 
                 shadow-sm transition-colors duration-300"
    >
      {/* Logo / Tiêu đề */}
      <h2 className="text-xl font-bold mb-6 text-[#ff6600]">Admin TableGo</h2>

      <nav className="space-y-2">
        {/*  Quản lý đơn đặt hàng */}
        <div>
          <button
            onClick={() => setOpenOrders(!openOrders)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 ${
              openOrders
                ? "bg-orange-50 dark:bg-[#2a2a2a] text-[#ff6600]"
                : "hover:bg-orange-50 dark:hover:bg-[#2a2a2a]"
            }`}
          >
            <div className="flex items-center gap-2">
              <FaListAlt className="text-[#ff6600]" />
              <span className="font-medium">Quản lý đơn đặt hàng</span>
            </div>
            {openOrders ? (
              <IoIosArrowDown className="text-gray-500 dark:text-gray-400" />
            ) : (
              <IoIosArrowForward className="text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {/* Submenu */}
          <div
            className={`ml-6 overflow-hidden transition-all duration-300 ${
              openOrders ? "max-h-40 mt-1" : "max-h-0"
            }`}
          >
            <Link
              href="/admin/orders"
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === "/admin/orders"
                  ? "text-[#ff6600] bg-orange-50 dark:bg-[#2a2a2a] scale-[1.02]"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#ff6600] hover:translate-x-1"
              }`}
            >
              • Danh sách đơn hàng
            </Link>

            <Link
              href="/admin/orders/ORD-1001"
              className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === "/admin/orders/ORD-1001"
                  ? "text-[#ff6600] bg-orange-50 dark:bg-[#2a2a2a] scale-[1.02]"
                  : "text-gray-700 dark:text-gray-300 hover:text-[#ff6600] hover:translate-x-1"
              }`}
            >
              • Chi tiết đơn hàng
            </Link>
          </div>
        </div>

        {/*  Quản lý danh mục món */}
        <Link
          href="/admin/invoices"
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
            pathname === "/admin/invoices"
              ? "bg-orange-50 dark:bg-[#2a2a2a] text-[#ff6600] scale-[1.02]"
              : "hover:bg-orange-50 dark:hover:bg-[#2a2a2a] hover:text-[#ff6600]"
          }`}
        >
          <FaFileInvoice className="text-[#ff6600]" />
          <span className="font-medium">Quản lý danh mục món</span>
        </Link>
      </nav>
    </aside>
  );
}
