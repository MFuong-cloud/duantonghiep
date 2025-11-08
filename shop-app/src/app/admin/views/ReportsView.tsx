"use client";

import { useState } from "react";
import { BarChart } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Dữ liệu mẫu (Giữ nội bộ trong component này)
const monthlyData = [
  { name: "Thg 1", doanhthu: 4000000 },
  { name: "Thg 2", doanhthu: 3000000 },
  { name: "Thg 3", doanhthu: 5000000 },
  { name: "Thg 4", doanhthu: 4500000 },
  { name: "Thg 5", doanhthu: 6000000 },
  { name: "Thg 6", doanhthu: 5500000 },
  { name: "Thg 7", doanhthu: 7000000 },
  { name: "Thg 8", doanhthu: 6500000 },
  { name: "Thg 9", doanhthu: 7500000 },
  { name: "Thg 10", doanhthu: 8000000 },
  { name: "Thg 11", doanhthu: 9000000 },
  { name: "Thg 12", doanhthu: 8500000 },
];
const quarterlyData = [
  { name: "Quý 1", doanhthu: 12000000 },
  { name: "Quý 2", doanhthu: 16000000 },
  { name: "Quý 3", doanhthu: 21000000 },
  { name: "Quý 4", doanhthu: 25500000 },
];
const yearlyData = [
  { name: "2022", doanhthu: 50000000 },
  { name: "2023", doanhthu: 74500000 },
  { name: "2024", doanhthu: 90000000 },
];

export const ReportsView = () => {
  const [reportPeriod, setReportPeriod] = useState<
    "month" | "quarter" | "year"
  >("month");

  // Logic chọn dữ liệu báo cáo
  let currentReportData = monthlyData;
  let totalRevenue = 0;
  let periodName = "Theo Tháng";
  switch (reportPeriod) {
    case "month":
      currentReportData = monthlyData;
      totalRevenue = monthlyData.reduce((acc, item) => acc + item.doanhthu, 0);
      periodName = "Trong 12 Tháng";
      break;
    case "quarter":
      currentReportData = quarterlyData;
      totalRevenue = quarterlyData.reduce(
        (acc, item) => acc + item.doanhthu,
        0
      );
      periodName = "Trong 4 Quý";
      break;
    case "year":
      currentReportData = yearlyData;
      totalRevenue = yearlyData.reduce((acc, item) => acc + item.doanhthu, 0);
      periodName = "Trong 3 Năm";
      break;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
          <BarChart className="w-8 h-8 text-amber-600" />
          Báo cáo Doanh thu
        </h1>
        <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <button
            onClick={() => setReportPeriod("month")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              reportPeriod === "month"
                ? "bg-white dark:bg-gray-800 text-amber-600 shadow"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Theo Tháng
          </button>
          <button
            onClick={() => setReportPeriod("quarter")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              reportPeriod === "quarter"
                ? "bg-white dark:bg-gray-800 text-amber-600 shadow"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Theo Quý
          </button>
          <button
            onClick={() => setReportPeriod("year")}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              reportPeriod === "year"
                ? "bg-white dark:bg-gray-800 text-amber-600 shadow"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Theo Năm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tổng Doanh Thu ({periodName})
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {totalRevenue.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Tổng Đơn Hàng
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            1,204
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Trung Bình/Đơn
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            {(totalRevenue / 1204).toLocaleString("vi-VN", {
              maximumFractionDigits: 0,
            })}{" "}
            VNĐ
          </p>
        </div>
      </div>

      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        style={{ height: "450px" }}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Biểu đồ doanh thu{" "}
          {reportPeriod === "month"
            ? "theo tháng"
            : reportPeriod === "quarter"
            ? "theo quý"
            : "theo năm"}
        </h3>
        <ResponsiveContainer width="100%" height="90%">
          <RechartsBarChart
            data={currentReportData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              strokeOpacity={0.2}
              stroke="#888"
            />
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `${(value / 1000000).toLocaleString()} Tr`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#27272a",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) =>
                `${value.toLocaleString("vi-VN")} VNĐ`
              }
            />
            <Legend />
            <Bar
              dataKey="doanhthu"
              fill="#f59e0b"
              name="Doanh thu"
              radius={[4, 4, 0, 0]}
            />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
