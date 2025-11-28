"use client";

import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/60 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
        </div>
    );
}
