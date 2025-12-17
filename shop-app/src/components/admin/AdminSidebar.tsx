"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  UtensilsCrossed,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true, // Chỉ highlight khi đúng path /admin
  },
  {
    title: "Tin tức",
    href: "/admin/news",
    icon: Newspaper,
    exact: false, // Highlight khi path bắt đầu bằng /admin/news
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-gray-900 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
            <UtensilsCrossed className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">TableGo</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? "text-white" : ""}`} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
          Về trang chủ
        </Link>
      </div>
    </aside>
  );
}
