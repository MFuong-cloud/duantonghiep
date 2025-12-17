import { useState } from "react";

/**
 * Dịch vụ và hook cho màn hình đăng ký
 * File: src/app/(auth)/register/_services/services.tsx
 */

/* Types */
export type RegisterPayload = {
    phoneNumber: any;
    name: string;
    email: string;
    password: string;
    passwordConfirm?: string;
};

export type RegisterResponse = {
    success: boolean;
    message?: string;
    data?: {
        id?: string;
        name?: string;
        email?: string;
        [k: string]: any;
    };
};

/* Cấu hình API (điểm gọi có thể điều chỉnh) */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api";

/* Hàm gọi API đăng ký */
export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
    try {
        console.log(123123);
        
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: payload.name,
                email: payload.email,
                phone: payload.phoneNumber,
                password: payload.password,
            }),
        });

        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
            return { success: false, message: json?.message || res.statusText || "Lỗi server" };
        }

        return { success: true, data: json?.data || json, message: json?.message };
    } catch (error: any) {
        return { success: false, message: error?.message || "Lỗi kết nối" };
    }
}

/* Hàm validate đơn giản cho form đăng ký */
export function validateRegisterPayload(payload: RegisterPayload) {
    const errors: Partial<Record<keyof RegisterPayload, string>> = {};

    if (!payload.name || !payload.name.trim()) errors.name = "Họ và tên là bắt buộc.";
    if (!payload.email || !payload.email.trim()) {
        errors.email = "Email là bắt buộc.";
    } else {
        // simple email regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(payload.email)) errors.email = "Email không hợp lệ.";
    }

    if (!payload.password) errors.password = "Mật khẩu là bắt buộc.";
    else if (payload.password.length < 6) errors.password = "Mật khẩu tối thiểu 6 ký tự.";

    if (payload.passwordConfirm !== undefined) {
        if (payload.password !== payload.passwordConfirm) errors.passwordConfirm = "Mật khẩu xác nhận không khớp.";
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

/* Custom hook sử dụng trong component đăng ký */
export function useRegister() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<RegisterResponse["data"] | null>(null);

    async function doRegister(payload: RegisterPayload) {
        setLoading(true);
        setError(null);
        setData(null);

        const { valid, errors } = validateRegisterPayload(payload);
        if (!valid) {
            setLoading(false);
            setError(Object.values(errors)[0] || "Dữ liệu không hợp lệ.");
            return { success: false, errors };
        }

        const res = await registerUser(payload);
        setLoading(false);

        if (!res.success) {
            setError(res.message || "Đăng ký thất bại.");
            return res;
        }

        setData(res.data || null);
        return res;
    }

    return { loading, error, data, register: doRegister };
}