"use client";

import React, { useState, useRef, useEffect } from "react";
import { Menu, Bell, Info, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import SearchBox from "../layout/SearchBox";
import { ToggleTheme } from "@/components/toggle-theme";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DialogStatus = "processing" | "success";

export default function AdminHeader({
  sidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [logoutDialogState, setLogoutDialogState] = useState<{
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
  const [shouldRedirectAfterDialog, setShouldRedirectAfterDialog] = useState(false);

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

  useEffect(() => {
    if (!logoutDialogState.open && shouldRedirectAfterDialog) {
      setShouldRedirectAfterDialog(false);
      router.push("/");
    }
  }, [logoutDialogState.open, shouldRedirectAfterDialog, router]);

  useEffect(() => {
    if (logoutDialogState.open && logoutDialogState.status === "success") {
      const timer = setTimeout(() => {
        setLogoutDialogState((prev) => ({ ...prev, open: false }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [logoutDialogState.open, logoutDialogState.status]);

  const handleDialogChange = (open: boolean) => {
    if (!open && logoutDialogState.status === "processing") {
      return;
    }
    setLogoutDialogState((prev) => ({ ...prev, open }));
  };

  const handleLogout = () => {
    setLogoutDialogState({
      open: true,
      status: "processing",
      title: "Đang đăng xuất",
      description: "Vui lòng chờ trong giây lát...",
    });

    setTimeout(() => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authRole");
      window.dispatchEvent(new Event("auth-change"));
      setLogoutDialogState({
        open: true,
        status: "success",
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi khu vực quản trị.",
      });
      setShouldRedirectAfterDialog(true);
    }, 600);
  };

  return (
    <>
      <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white dark:bg-[#0E0E0E] border-b border-gray-200 dark:border-[#2A2A2A] sticky top-0 z-50 shadow-sm">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>

          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Bảng điều khiển
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý hoạt động của hệ thống
            </p>
          </div>
        </div>

        {/* Middle search */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[min(720px,90%)]">
          <SearchBox
            pages={[
              { name: "Bảng Điều Khiển", path: "/admin" },
              { name: "Đơn hàng", path: "/admin/orders" },
              { name: "Món ăn", path: "/admin/menu-items" },
            ]}
            placeholder="Tìm chức năng, trang, đơn..."
          />
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-300 cursor-pointer hover:text-blue-500" />
          <Info className="w-5 h-5 text-gray-500 dark:text-gray-300 cursor-pointer hover:text-blue-500" />
          <ToggleTheme />

          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen((v) => !v)}
              className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-700"
              />
              <span className="hidden md:inline text-sm font-medium">
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
                  onClick={() => {
                    setAccountOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Dialog open={logoutDialogState.open} onOpenChange={handleDialogChange}>
        <DialogContent showCloseButton={logoutDialogState.status === "success"}>
          <DialogHeader>
            <div className="flex flex-col items-center gap-4 text-center">
              {logoutDialogState.status === "processing" ? (
                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
              ) : (
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              )}
              <DialogTitle>{logoutDialogState.title}</DialogTitle>
              <DialogDescription>
                {logoutDialogState.description}
              </DialogDescription>
            </div>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full"
              disabled={logoutDialogState.status === "processing"}
              onClick={() => {
                if (logoutDialogState.status === "success") {
                  setLogoutDialogState((prev) => ({ ...prev, open: false }));
                }
              }}
            >
              {logoutDialogState.status === "success" ? "Hoàn tất" : "Đang xử lý..."}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
