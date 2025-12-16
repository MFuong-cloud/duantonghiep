import axios from "axios";
import { User } from "@/model/User";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

const apiFormData = axios.create({
    baseURL: API_BASE,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

apiFormData.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export interface CreateUserData {
    name: string;
    email: string;
    password?: string;
    role: string;
    avatar?: File | null;
    phone?: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    avatar?: File | null;
    phone?: string;
}

export const UserService = {
    async getUsers(params?: Record<string, string | number>): Promise<User[]> {
        try {
            const res = await api.get("/auth/admin/users", { params });
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getUser(id: number): Promise<User> {
        try {
            const res = await api.get(`/auth/admin/users/${id}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async createUser(data: CreateUserData): Promise<User> {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("role", data.role);
            if (data.password) formData.append("password", data.password);
            if (data.phone) formData.append("phone", data.phone);
            if (data.avatar) formData.append("avatar", data.avatar);

            const res = await apiFormData.post("/auth/admin/users", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async updateUser(id: number, data: UpdateUserData): Promise<User> {
        try {
            if (data.avatar) {
                const formData = new FormData();

                if (data.name) formData.append("name", data.name);
                if (data.email) formData.append("email", data.email);
                if (data.password) formData.append("password", data.password);
                if (data.role) formData.append("role", data.role);
                if (data.phone) formData.append("phone", data.phone);

                formData.append("avatar", data.avatar);
                formData.append("_method", "PUT");

                const res = await apiFormData.post(`/auth/admin/users/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                return res.data;
            } else {
                const jsonData: Partial<UpdateUserData> = {};

                if (data.name) jsonData.name = data.name;
                if (data.email) jsonData.email = data.email;
                if (data.password) jsonData.password = data.password;
                if (data.role) jsonData.role = data.role;
                if (data.phone) jsonData.phone = data.phone;

                const res = await api.put(`/auth/admin/users/${id}`, jsonData);
                return res.data;
            }
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async deleteUser(id: number): Promise<void> {
        try {
            await api.delete(`/auth/admin/users/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    // Trash functions
    async getTrash(): Promise<User[]> {
        try {
            const res = await api.get("/auth/admin/users/trash");
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async restore(id: number): Promise<void> {
        try {
            await api.post(`/auth/admin/users/${id}/restore`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async forceDelete(id: number): Promise<void> {
        try {
            await api.delete(`/auth/admin/users/${id}/force-delete`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },
};
