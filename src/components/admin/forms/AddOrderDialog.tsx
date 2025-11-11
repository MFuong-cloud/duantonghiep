"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AddOrderDialogProps {
  onAdd: (newOrder: any) => void;
}

export default function AddOrderDialog({ onAdd }: AddOrderDialogProps) {
  const [newOrder, setNewOrder] = useState({
    id: "",
    name: "",
    phone: "",
    total: "",
    status: "Chờ xử lý",
    date: "",
    time: "",
    people: "",
  });

  const handleAdd = () => {
    if (!newOrder.id || !newOrder.name || !newOrder.phone) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    onAdd(newOrder);
    setNewOrder({
      id: "",
      name: "",
      phone: "",
      total: "",
      status: "Chờ xử lý",
      date: "",
      time: "",
      people: "",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-[#ff6600] text-white px-4 py-2 rounded-lg hover:bg-[#ff751a] transition">
          <PlusCircle className="w-5 h-5" />
          Thêm đơn mới
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#ff6600]">Thêm đơn mới</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-3">
          {["id", "name", "phone", "total", "date", "time", "people"].map((field) => (
            <input
              key={field}
              type={field === "date" ? "date" : field === "time" ? "time" : "text"}
              placeholder={
                field === "id"
                  ? "Mã đơn (VD: DH006)"
                  : field === "name"
                  ? "Họ và tên"
                  : field === "phone"
                  ? "Số điện thoại"
                  : field === "total"
                  ? "Tổng tiền"
                  : field === "people"
                  ? "Số người"
                  : ""
              }
              value={(newOrder as any)[field]}
              onChange={(e) => setNewOrder({ ...newOrder, [field]: e.target.value })}
              className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#ff6600]"
            />
          ))}

          {/* trạng thái */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="border border-gray-300 rounded-md p-2 text-left">
                {newOrder.status}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["Chờ xử lý", "Hoàn thành", "Đã hủy"].map((status) => (
                <DropdownMenuItem key={status} onClick={() => setNewOrder({ ...newOrder, status })}>
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={handleAdd}
            className="mt-3 bg-[#ff6600] text-white py-2 rounded-md hover:bg-[#ff751a] transition"
          >
            Thêm đơn
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
