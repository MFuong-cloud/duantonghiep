import envConfig from "@/config";

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: File;
}

export interface Session {
    id: string;
    ip_address: string;
}

export interface ApiResponse<T = unknown> {
    status?: boolean;
    data?: T;
}

export const ProfileService = {
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

   
    async updateProfile(data: UpdateProfileData): Promise<{ ok: boolean; status: number; payload: ApiResponse<UserProfile> }> {
        try {
            const token = localStorage.getItem("authToken");

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
