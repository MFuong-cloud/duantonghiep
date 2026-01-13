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
    avatar?: File | null;
    phone?: string;
}


export const UserService = {
    async getUsers(params?: Record<string, string | number>): Promise<User[]> {
        try {
            const res = await api.get("/admin/users", { params });
            return Array.isArray(res.data) ? res.data : [];
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

                const res = await apiFormData.post(`/admin/users/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                return res.data;
            } else {
                const jsonData: Partial<UpdateUserData> = {};

               
                const res = await api.put(`/admin/users/${id}`, jsonData);
                return res.data;
            }
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async deleteUser(id: number): Promise<void> {
        try {
            await api.delete(`/admin/users/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },


    async restore(id: number): Promise<void> {
        try {
            await api.post(`/admin/users/${id}/restore`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

   
};
