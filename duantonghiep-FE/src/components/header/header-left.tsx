"use client";

import { Croissant } from "lucide-react";
import Link from "next/link";

export default function HeaderLeft() {

    return (
        <div className="flex items-center gap-3 group">

            {/* Logo */}
            <Link
                href="/"
                className="rounded-full bg-gradient-to-br from-[var(--co-orage-button-start)] to-[var(--co-orage-button-end)] p-2 transition-transform group-hover:scale-110"
            >
                <Croissant className="h-6 w-6 text-white" />
            </Link>

            {/* Tên cửa hàng cố định */}
            <div className="font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Quán Ăn Nhà Hàng
            </div>

        </div>
    );
}
