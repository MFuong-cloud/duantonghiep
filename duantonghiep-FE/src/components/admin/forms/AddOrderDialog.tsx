"use client";

import { useMemo, useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminFormField, adminInputClass } from "@/components/admin/layout/AdminUI";
import { cn } from "@/lib/utils";

interface AddOrderDialogProps {
  onAdd: (newOrder: AdminOrderPayload) => void;
}

const statusOptions = ["Chờ xử lý", "Hoàn thành", "Đã hủy"] as const;
type OrderStatus = (typeof statusOptions)[number];

export type AdminOrderPayload = {
  id: string;
  name: string;
  phone: string;
  total: string;
  status: OrderStatus;
  date: string;
  time: string;
  people: number;
  note?: string;
  table?: string; 
};

type OrderFormState = Omit<AdminOrderPayload, "people"> & { people: string };

const emptyOrder: OrderFormState = {
  id: "",
  name: "",
  phone: "",
  total: "",
  status: "Chờ xử lý",
  date: "",
  time: "",
  people: "",
  note: "",
};

export default function AddOrderDialog({ onAdd }: AddOrderDialogProps) {
  const [newOrder, setNewOrder] = useState<OrderFormState>(emptyOrder);
  const [open, setOpen] = useState(false);

  const isValid = useMemo(
    () => Boolean(newOrder.id.trim() && newOrder.name.trim() && newOrder.phone.trim()),
    [newOrder]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Vui lòng nhập tối thiểu mã đơn, tên khách và số điện thoại.");
      return;
    }

    const payload: AdminOrderPayload = {
      ...newOrder,
      people: newOrder.people ? Math.max(1, parseInt(newOrder.people, 10)) : 1,
    };

    onAdd(payload);
    toast.success("Đã thêm đơn đặt bàn mới");
    setNewOrder(emptyOrder);
    setOpen(false);
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      setNewOrder(emptyOrder);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
          <PlusCircle className="w-4 h-4" />
          Thêm đơn mới
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-3xl bg-white dark:bg-[#1f1f1f]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-blue-600">
            Thêm đơn đặt bàn mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminFormField label="Mã đơn" required description="Ví dụ: DH010">
              <input
                type="text"
                value={newOrder.id}
                onChange={(e) => setNewOrder({ ...newOrder, id: e.target.value.toUpperCase() })}
                className={cn(adminInputClass, "focus:ring-blue-600")}
                placeholder="DH010"
              />
            </AdminFormField>

            <AdminFormField label="Số điện thoại" required>
              <input
                type="tel"
                value={newOrder.phone}
                onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                className={cn(adminInputClass, "focus:ring-blue-600")}
                placeholder="0987 654 321"
              />
            </AdminFormField>

            <AdminFormField label="Tên khách hàng" required className="md:col-span-2">
              <input
                type="text"
                value={newOrder.name}
                onChange={(e) => setNewOrder({ ...newOrder, name: e.target.value })}
                className={cn(adminInputClass, "focus:ring-blue-600")}
                placeholder="Nguyễn Văn A"
              />
            </AdminFormField>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdminFormField label="Số người">
              <input
                type="number"
                min={1}
                value={newOrder.people}
                onChange={(e) => setNewOrder({ ...newOrder, people: e.target.value })}
                className={cn(adminInputClass, "focus:ring-blue-600")}
                placeholder="4"
              />
            </AdminFormField>

            <AdminFormField label="Ngày đặt">
              <input
                type="date"
                value={newOrder.date}
                onChange={(e) => setNewOrder({ ...newOrder, date: e.target.value })}
                className={cn(adminInputClass, "focus:ring-blue-600")}
              />
            </AdminFormField>

            <AdminFormField label="Giờ đến dự kiến">
              <input
                type="time"
                value={newOrder.time}
                onChange={(e) => setNewOrder({ ...newOrder, time: e.target.value })}
                className={cn(adminInputClass, "focus:ring-blue-600")}
              />
            </AdminFormField>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AdminFormField label="Tổng tiền (VNĐ)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₫</span>
                <input
                  type="text"
                  value={newOrder.total}
                  onChange={(e) => setNewOrder({ ...newOrder, total: e.target.value.replace(/[^\d]/g, "") })}
                  className={cn(adminInputClass, "pl-8 focus:ring-blue-600")}
                  placeholder="1.500.000"
                />
              </div>
            </AdminFormField>

            <AdminFormField label="Trạng thái đơn">
              <select
                value={newOrder.status}
                onChange={(e) => setNewOrder({ ...newOrder, status: e.target.value as OrderStatus })}
                className={cn(adminInputClass, "appearance-none bg-gray-50 dark:bg-[#111111] focus:ring-blue-600")}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </AdminFormField>
          </div>

          <AdminFormField label="Ghi chú bổ sung" description="Thông tin về yêu cầu món, ghế trẻ em, dị ứng...">
            <textarea
              value={newOrder.note}
              onChange={(e) => setNewOrder({ ...newOrder, note: e.target.value })}
              rows={3}
              className={cn(adminInputClass, "min-h-[110px] focus:ring-blue-600")}
              placeholder="Khách muốn bố trí gần cửa kính..."
            />
          </AdminFormField>

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white transition-colors" disabled={!isValid}>
              Lưu đơn
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}