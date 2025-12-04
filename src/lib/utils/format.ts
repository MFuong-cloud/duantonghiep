export const formatPrice = (price?: number): string => {
    if (!price) return "Liên hệ";
    return price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });
};

export const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
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
