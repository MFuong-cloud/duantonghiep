"use client";

import { Toaster } from "sonner";

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            richColors
            closeButton
            expand
            toastOptions={{
                style: {
                    borderRadius: "10px",
                    padding: "20px 20px",
                    fontWeight: 500,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                },
            }}
        />
    );
}
