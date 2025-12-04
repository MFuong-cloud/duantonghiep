"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";
import { toast } from "sonner";

interface CustomToastProps {
    t: string | number;
    title: string;
    description?: string;
    type?: "success" | "error" | "info";
    duration?: number;
}

export function CustomToast({ t, title, description, type = "info", duration = 4000 }: CustomToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => toast.dismiss(t), 300);
    };

    const bgColors = {
        success: "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800",
        error: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
        info: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    };

    const textColors = {
        success: "text-green-800 dark:text-green-300",
        error: "text-red-800 dark:text-red-300",
        info: "text-blue-800 dark:text-blue-300",
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    };

    return (
        <div
            className={`
        flex items-start gap-3 p-4 rounded-xl shadow-lg border w-[356px] pointer-events-auto
        transition-all duration-300 ease-out transform mt-14 backdrop-blur-sm
        ${bgColors[type]}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
            style={{ marginRight: isVisible ? 0 : -400 }}
        >
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            <div className="flex-1">
                <h3 className={`font-semibold text-sm ${textColors[type]}`}>{title}</h3>
                {description && (
                    <p className={`mt-1 text-sm ${textColors[type]} opacity-90 leading-relaxed`}>{description}</p>
                )}
            </div>
            <button
                onClick={handleDismiss}
                className={`flex-shrink-0 p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors ${textColors[type]}`}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
