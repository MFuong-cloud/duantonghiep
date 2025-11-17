import envConfig from "@/config";
import { RegisterBodyType } from "@/schemaValidations/auth.schema";

export const AuthService = {
    async login(emailOrPhone: string, password: string) {
        try {
            // Đơn giản hóa: chỉ gửi email_or_phone như backend yêu cầu
            const requestBody = {
                email_or_phone: emailOrPhone,
                password: password,
            };
            
            console.log("Login request body:", requestBody);
            
            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestBody),
            });

            const payload = await res.json().catch(() => ({}));
            console.log("Login API response status:", res.status, "payload:", payload);

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            console.error("Login error:", error);
            return {
                ok: false,
                status: 0,
                payload: {message: "Không thể kết nối đến server"},
            };
        }
    },

    async register(data: RegisterBodyType) {
        try {
            // Sử dụng phone (như bạn đã sửa) - format backend yêu cầu
            const requestBody = {
                name: data.name,
                email: data.email,
                phone: data.phoneNumber,
                password: data.password,
            };
            console.log("Register request body:", requestBody);
            
            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/register`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestBody),
            });

            const payload = await res.json().catch(() => ({}));
            console.log("Register API response status:", res.status, "payload:", payload);

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            console.error("Register error:", error);
            return {
                ok: false,
                status: 0,
                payload: {message: "Không thể kết nối đến server"},
            };
        }
    },
};
