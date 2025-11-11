"use client";

import { useState } from "react";
import AdminHeader from "../../components/admin/layout/AdminHeader";
import Sidebar from "../../components/admin/layout/Sidebar";
import ToastProvider from "./notifications/ToastProvider";
import "@/app/globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      {/* Toast Provider - dùng toàn cục */}
      <ToastProvider />

      <div className="flex min-h-screen bg-[#f9fafb] dark:bg-[#0c0c0c] text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-16"
            } bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-gray-800 shadow-sm`}
        >
          <Sidebar collapsed={!sidebarOpen} />
        </aside>

        {/* Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <AdminHeader
            sidebarOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen((v) => !v)}
          />

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 dark:bg-[#1a1a1a] rounded-tl-2xl transition-all duration-300">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
