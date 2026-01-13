import envConfig from "@/config";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    role: string;
    created_at: string;
    updated_at: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: File;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
}

export interface Session {
    id: string;
    ip_address: string;
    user_agent: string;
    last_activity: string;
    is_current: boolean;
}

export interface ApiResponse<T = unknown> {
    status?: boolean;
    message?: string;
    data?: T;
}

export const ProfileService = {
    /**
     * Lấy thông tin profile người dùng hiện tại
     */
    async getProfile(): Promise<{ ok: boolean; status: number; payload: ApiResponse<UserProfile> }> {
        try {
            const token = localStorage.getItem("authToken");

            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const payload = await res.json().catch(() => ({}));

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            console.error("Get profile error:", error);
            return {
                ok: false,
                status: 0,
                payload: { message: "Không thể kết nối đến server" },
            };
        }
    },

    /**
     * Cập nhật thông tin profile
     */
    async updateProfile(data: UpdateProfileData): Promise<{ ok: boolean; status: number; payload: ApiResponse<UserProfile> }> {
        try {
            const token = localStorage.getItem("authToken");
            const formData = new FormData();

            if (data.name) formData.append("name", data.name);
            if (data.email) formData.append("email", data.email);
            if (data.phone) formData.append("phone", data.phone);
            if (data.avatar) formData.append("avatar", data.avatar);

            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/profile/update`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            const payload = await res.json().catch(() => ({}));

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            console.error("Update profile error:", error);
            return {
                ok: false,
                status: 0,
                payload: { message: "Không thể kết nối đến server" },
            };
        }
    },

    /**
     * Đổi mật khẩu
     */
    async changePassword(data: ChangePasswordData): Promise<{ ok: boolean; status: number; payload: ApiResponse }> {
        try {
            const token = localStorage.getItem("authToken");

            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/profile/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const payload = await res.json().catch(() => ({}));

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            console.error("Change password error:", error);
            return {
                ok: false,
                status: 0,
                payload: { message: "Không thể kết nối đến server" },
            };
        }
    },

    /**
     * Lấy danh sách phiên đăng nhập
     */
    async getSessions(): Promise<{ ok: boolean; status: number; payload: ApiResponse<Session[]> }> {
        try {
            const token = localStorage.getItem("authToken");

            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/sessions`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const payload = await res.json().catch(() => ({}));

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            console.error("Get sessions error:", error);
            return {
                ok: false,
                status: 0,
                payload: { message: "Không thể kết nối đến server" },
            };
        }
    },

    /**
     * Đăng xuất một phiên cụ thể
     */
    async logoutSession(sessionId: string): Promise<{ ok: boolean; status: number; payload: ApiResponse }> {
        try {
            const token = localStorage.getItem("authToken");

            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/logout-session/${sessionId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const payload = await res.json().catch(() => ({}));

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            console.error("Logout session error:", error);
            return {
                ok: false,
                status: 0,
                payload: { message: "Không thể kết nối đến server" },
            };
        }
    },
};
