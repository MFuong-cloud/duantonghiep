import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const formatPrice = (price?: number): string => {
    if (!price) return "Liên hệ";
    return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
};

export const formatDate = (dateString?: string | null, formatStr: string = "dd/MM/yyyy HH:mm"): string => {
    if (!dateString) return "-";

    try {
        return format(new Date(dateString), formatStr, { locale: vi });
    } catch {
        return dateString;
    }
};

/**
 * Format date for Vietnamese locale (long format)
 */
export const formatDateVN = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    } catch {
        return dateString;
    }
};

/**
 * Format date for news display (long format with time)
 */
export const formatNewsDate = (dateString: string): string => {
    return formatDate(dateString, "dd 'tháng' MM, yyyy - HH:mm");
};

export const formatDateTime = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export const formatNumber = (num?: number): string => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString("vi-VN");
};
