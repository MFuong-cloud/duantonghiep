import axios from "axios";
import { Category } from "@/model/Category";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

export const CategoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const res = await api.get("/categories");
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getCategory(id: number): Promise<Category> {
        try {
            const res = await api.get(`/categories/${id}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async createCategory(data: Partial<Category>): Promise<Category> {
        try {
            const res = await api.post("/categories", data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
        try {
            const res = await api.put(`/categories/${id}`, data);
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async deleteCategory(id: number): Promise<void> {
        try {
            await api.delete(`/categories/${id}`);
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },
};
