"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddOrderDialogProps {
  onAdd: (newOrder: any) => void;
}

export default function AddOrderDialog({ onAdd }: AddOrderDialogProps) {
  const [open, setOpen] = useState(false); // đóng mở
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

  const accentColor = "#FFA559"; // thay đổi màu

  const handleAdd = () => {
    if (!newOrder.id || !newOrder.name || !newOrder.phone) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    onAdd(newOrder);

    // Reset lại form
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

    // 👇 Đóng dialog sau khi thêm
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition"
          style={{
            backgroundColor: accentColor,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
          onClick={() => setOpen(true)}
        >
          <PlusCircle className="w-5 h-5" />
          Thêm đơn mới
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle style={{ color: accentColor }}>Thêm đơn mới</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-3">
          {["id", "name", "phone", "total", "date", "time", "people"].map(
            (field) => (
              <input
                key={field}
                type={
                  field === "date"
                    ? "date"
                    : field === "time"
                    ? "time"
                    : "text"
                }
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
                onChange={(e) =>
                  setNewOrder({ ...newOrder, [field]: e.target.value })
                }
               className={`p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[${accentColor}] transition duration-200`}

              />
            )
          )}

          {/* Trạng thái */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="border border-gray-300 rounded-md p-2 text-left">
                {newOrder.status}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {["Chờ xử lý", "Hoàn thành", "Đã hủy"].map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => setNewOrder({ ...newOrder, status })}
                >
                  {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={handleAdd}
            className="mt-3 text-white py-2 rounded-md transition"
            style={{
              backgroundColor: accentColor,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFBD73")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = accentColor)
            }
          >
            Thêm đơn
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
