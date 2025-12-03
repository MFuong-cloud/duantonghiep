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

export interface CreateUserData {
    name: string;
    email: string;
    password?: string;
    role: string;
    status: "active" | "inactive";
    avatar?: File | null;
    phone?: string;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
    status?: "active" | "inactive";
    avatar?: File | null;
    phone?: string;
}

export const UserService = {
    async getUsers(params?: Record<string, any>): Promise<User[]> {
        try {
            const res = await api.get("/users", { params });
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async getUser(id: number): Promise<User> {
        try {
            const res = await api.get(`/users/${id}`);
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async createUser(data: CreateUserData): Promise<User> {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("role", data.role);
            formData.append("status", data.status);

            if (data.password) {
                formData.append("password", data.password);
            }

            if (data.phone) {
                formData.append("phone", data.phone);
            }

            if (data.avatar) {
                formData.append("avatar", data.avatar);
            }

            const res = await apiFormData.post("/users", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
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
                if (data.status) formData.append("status", data.status);
                if (data.phone) formData.append("phone", data.phone);

                formData.append("avatar", data.avatar);
                formData.append("_method", "PUT");

                const res = await apiFormData.post(`/users/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                return res.data;
            } else {
                const jsonData: any = {};

                if (data.name) jsonData.name = data.name;
                if (data.email) jsonData.email = data.email;
                if (data.password) jsonData.password = data.password;
                if (data.role) jsonData.role = data.role;
                if (data.status) jsonData.status = data.status;
                if (data.phone) jsonData.phone = data.phone;

                const res = await api.put(`/users/${id}`, jsonData);
                return res.data;
            }
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async deleteUser(id: number): Promise<void> {
        try {
            await api.delete(`/users/${id}`);
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },
};
