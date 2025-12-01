"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

import AdminHeader from "../../components/admin/layout/AdminHeader";
import Sidebar from "../../components/admin/layout/Sidebar";
import ToastProvider from "./notifications/ToastProvider";
import "@/app/globals.css";
import { useAuth } from "@/api/auth/AuthContext";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { isLogin, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f9fafb] dark:bg-[#0c0c0c]">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (!isLogin) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f9fafb] dark:bg-[#0c0c0c] px-6 text-center">
        <ShieldAlert className="h-12 w-12 text-orange-500" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Yêu cầu đăng nhập quyền Admin</h2>
          <p className="text-muted-foreground max-w-xl">
            Bạn cần đăng nhập bằng tài khoản có quyền quản trị để tiếp tục truy cập trang Admin
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/login?redirect=/admin&admin=1")}>
            Đăng nhập quyền Admin
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Quay lại trang chủ
          </Button>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f9fafb] dark:bg-[#0c0c0c] px-6 text-center">
        <ShieldAlert className="h-12 w-12 text-red-500" />
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Không đủ quyền hạn</h2>
          <p className="text-muted-foreground max-w-xl">
            Tài khoản của bạn không có quyền quản trị. Vui lòng liên hệ quản trị viên hoặc đăng nhập bằng tài khoản khác.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => router.push("/")}>Quay lại trang chủ</Button>
          <Button variant="outline" onClick={() => router.push("/login")}>Đăng nhập tài khoản khác</Button>
        </div>
      </section>
    );
  }

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
