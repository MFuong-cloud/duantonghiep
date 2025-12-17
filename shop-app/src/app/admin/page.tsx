"use client";

import {
  Users,
  ShoppingCart,
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Total Orders",
    value: "856",
    change: "+8%",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-green-500",
  },
  {
    title: "Reservations",
    value: "142",
    change: "-3%",
    trend: "down",
    icon: CalendarDays,
    color: "bg-purple-500",
  },
  {
    title: "Revenue",
    value: "45.2M",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "bg-orange-500",
  },
];

const recentOrders = [
  { id: "#1234", customer: "Nguyen Van A", total: "450,000 VND", status: "Completed", time: "5 min ago" },
  { id: "#1233", customer: "Tran Thi B", total: "320,000 VND", status: "Processing", time: "15 min ago" },
  { id: "#1232", customer: "Le Van C", total: "680,000 VND", status: "Completed", time: "30 min ago" },
  { id: "#1231", customer: "Pham Thi D", total: "290,000 VND", status: "Pending", time: "1 hour ago" },
  { id: "#1230", customer: "Hoang Van E", total: "520,000 VND", status: "Completed", time: "2 hours ago" },
];

const recentReservations = [
  { id: "#R001", customer: "Nguyen Van A", table: "Table 5", guests: 4, time: "Today, 7:00 PM", status: "Confirmed" },
  { id: "#R002", customer: "Tran Thi B", table: "Table 3", guests: 2, time: "Today, 8:00 PM", status: "Pending" },
  { id: "#R003", customer: "Le Van C", table: "Table 8", guests: 6, time: "Tomorrow, 6:30 PM", status: "Confirmed" },
  { id: "#R004", customer: "Pham Thi D", table: "Table 1", guests: 3, time: "Tomorrow, 7:30 PM", status: "Pending" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tables section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <a
              href="/admin/orders"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">Order ID</th>
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.total}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reservations</h2>
            <a
              href="/admin/reservations"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Table</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{reservation.customer}</p>
                      <p className="text-xs text-gray-500">{reservation.guests} guests</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reservation.table}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{reservation.time}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          reservation.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
