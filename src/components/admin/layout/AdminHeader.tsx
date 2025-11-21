"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Icons
import {
  Menu,
  Bell,
  Info,
  CheckCircle2,
  Loader2,
  LogOut,
  User,
  Home,
  Search
} from "lucide-react";

// Components
import SearchBox from "../layout/SearchBox";
import { ToggleTheme } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogStatus = "processing" | "success";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function AdminHeader({ sidebarOpen, toggleSidebar }: AdminHeaderProps) {
  const router = useRouter();

  // --- STATE ---
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [logoutDialog, setLogoutDialog] = useState<{
    open: boolean;
    status: DialogStatus;
    title: string;
    description: string;
  }>({
    open: false,
    status: "processing",
    title: "",
    description: "",
  });

  // --- EFFECTS ---

  // 1. Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 2. Redirect after logout
  useEffect(() => {
    if (!logoutDialog.open && shouldRedirect) {
      setShouldRedirect(false);
      router.push("/");
    }
  }, [logoutDialog.open, shouldRedirect, router]);

  // 3. Auto close success dialog
  useEffect(() => {
    if (logoutDialog.open && logoutDialog.status === "success") {
      const timer = setTimeout(() => {
        setLogoutDialog((prev) => ({ ...prev, open: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [logoutDialog.open, logoutDialog.status]);

  // --- HANDLERS ---

  const handleDialogChange = (open: boolean) => {
    if (!open && logoutDialog.status === "processing") return;
    setLogoutDialog((prev) => ({ ...prev, open }));
  };

  const handleLogout = () => {
    setAccountOpen(false);
    setLogoutDialog({
      open: true,
      status: "processing",
      title: "Đang đăng xuất",
      description: "Vui lòng chờ trong giây lát...",
    });

    setTimeout(() => {
      // Xử lý logout thật ở đây (clear token, etc.)
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRole");
      window.dispatchEvent(new Event("auth-change"));

      setLogoutDialog({
        open: true,
        status: "success",
        title: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn!",
      });
      setShouldRedirect(true);
    }, 800);
  };

  // --- RENDER ---

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm dark:bg-[#0E0E0E] dark:border-[#2A2A2A]">
        {/* Container chính dùng relative để làm mốc toạ độ cho search box */}
        <div className="relative flex h-16 items-center justify-between px-4 md:px-6">

          {/* --- 1. LEFT SECTION (Menu & Title) --- */}
          {/* z-20 để nổi lên trên layer search box */}
          <div className="relative z-20 flex shrink-0 items-center gap-3 bg-white/80 pr-2 backdrop-blur-sm dark:bg-[#0E0E0E]/80">
            <button
              onClick={toggleSidebar}
              className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
              aria-label="Toggle Sidebar"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>

            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                Bảng điều khiển
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Quản lý hệ thống
              </p>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 z-10 hidden w-full max-w-[350px] -translate-x-1/2 -translate-y-1/2 md:block lg:max-w-[500px]">
            <SearchBox
              pages={[
                { name: "Bảng Điều Khiển", path: "/admin" },
                { name: "Đơn hàng", path: "/admin/orders" },
                { name: "Món ăn", path: "/admin/menu-items" },
              ]}
              placeholder="Tìm nhanh (Ctrl+K)..."
            />
          </div>

          {/* --- 3. RIGHT SECTION (Actions & Profile) --- */}
          {/* z-20 để nổi lên trên layer search box */}
          <div className="relative z-20 flex shrink-0 items-center gap-2 pl-2 bg-white/80 backdrop-blur-sm dark:bg-[#0E0E0E]/80 md:gap-4">

            {/* Icon Group */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Mobile Search Icon (Chỉ hiện khi search box ở giữa bị ẩn) */}
              <button className="block md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]">
                <Search className="h-5 w-5 text-gray-500 dark:text-gray-300" />
              </button>

              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]">
                <Bell className="h-5 w-5 text-gray-500 hover:text-blue-500 dark:text-gray-300 transition-colors" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]">
                <Info className="h-5 w-5 text-gray-500 hover:text-blue-500 dark:text-gray-300 transition-colors" />
              </button>
              <div className="hidden sm:block">
                <ToggleTheme />
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 w-[1px] bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

            {/* User Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={`flex items-center gap-2 rounded-full border border-transparent p-1 pr-3 transition-all
                  ${accountOpen ? "bg-gray-100 dark:bg-[#1a1a1a]" : "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"}
                `}
              >
                <img
                  src="https://i.pravatar.cc/40"
                  alt="avatar"
                  className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                />
                <div className="hidden text-left md:block">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Ông chủ</p>
                </div>
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#121212] dark:border-[#2A2A2A] z-50">
                  <div className="p-1">
                    <Link href="/" className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#1a1a1a]">
                      <Home className="mr-2 h-4 w-4" /> Về trang chủ
                    </Link>
                    <Link href="/admin/profile" className="flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-[#1a1a1a]">
                      <User className="mr-2 h-4 w-4" /> Trang cá nhân
                    </Link>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-[#2A2A2A] my-1" />
                  <div className="p-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-[#1a1a1a]"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- LOGOUT DIALOG --- */}
      <Dialog open={logoutDialog.open} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 pt-4">
              {logoutDialog.status === "processing" ? (
                <div className="p-3 bg-orange-50 rounded-full dark:bg-orange-900/20">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                </div>
              ) : (
                <div className="p-3 bg-green-50 rounded-full dark:bg-green-900/20">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              )}
              <div className="text-center space-y-1">
                <DialogTitle className="text-xl">{logoutDialog.title}</DialogTitle>
                <DialogDescription className="text-center">
                  {logoutDialog.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {/* Nút đóng chỉ hiện khi thành công (hoặc tuỳ chọn) */}
          {logoutDialog.status === "success" && (
            <DialogFooter className="sm:justify-center">
              <Button className="min-w-[100px]" onClick={() => setLogoutDialog(prev => ({ ...prev, open: false }))}>
                Đóng
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}