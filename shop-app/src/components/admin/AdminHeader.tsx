"use client";

import { Bell, Search, Menu, User, ChevronDown } from "lucide-react";
import { useState } from "react";

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search */}
        <div className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-64 rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">New reservation</p>
                  <p className="text-xs text-gray-500">Table #5 - 2 guests - 7:00 PM</p>
                  <p className="mt-1 text-xs text-gray-400">5 minutes ago</p>
                </div>
                <div className="border-b border-gray-100 px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">Order completed</p>
                  <p className="text-xs text-gray-500">Order #1234 - 450,000 VND</p>
                  <p className="mt-1 text-xs text-gray-400">15 minutes ago</p>
                </div>
                <div className="px-4 py-3 hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">New user registered</p>
                  <p className="text-xs text-gray-500">customer@example.com</p>
                  <p className="mt-1 text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="border-t border-gray-200 px-4 py-3 text-center">
                <a href="/admin/notifications" className="text-sm font-medium text-orange-500 hover:text-orange-600">
                  View all notifications
                </a>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
              <User className="h-5 w-5" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Owner</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <p className="text-sm font-medium text-gray-900">Admin</p>
                <p className="text-xs text-gray-500">owner@example.com</p>
              </div>
              <div className="py-1">
                <a
                  href="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </a>
                <a
                  href="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
              </div>
              <div className="border-t border-gray-200 py-1">
                <a
                  href="/login"
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
