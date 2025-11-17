"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddBranchPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [active, setActive] = useState(true);

    const handleSubmit = () => {
        if (!name || !phone || !address) {
            toast.error("Vui lòng nhập đầy đủ thông tin!");
            return;
        }
        // call API ở đây
        toast.success(`Đã thêm chi nhánh "${name}"`);
    };

    return (
        <div className="bg-white dark:bg-[#1f1f1f] p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">Thêm chi nhánh</h2>
            <div className="flex flex-col gap-4">
                <Input placeholder="Tên chi nhánh" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="SĐT" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
                <div className="flex items-center gap-2">
                    <Switch checked={active} onCheckedChange={setActive} />
                    <span className={active ? "text-green-500" : "text-red-500"}>{active ? "Hoạt động" : "Ngưng"}</span>
                </div>
                <Button onClick={handleSubmit}>Thêm chi nhánh</Button>
            </div>
        </div>
    );
}
