import envConfig from "@/config";

export const AuthService = {
    async login(emailOrPhone: string, password: string) {
        try {
            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email_or_phone: emailOrPhone,
                    password: password,
                }),
            });

            const payload = await res.json().catch(() => ({}));

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            return {
                ok: false,
                status: 0,
                payload: {message: "Không thể kết nối đến server"},
            };
        }
    },
};
