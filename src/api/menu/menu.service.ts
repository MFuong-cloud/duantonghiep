import axios from "axios";
import { Dish } from "@/model/Dish";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

export const DishService = {
    async getDishes(params?: Record<string, any>): Promise<Dish[]> {
        try {
            const res = await api.get("/dishes", { params });
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async getDish(id: number): Promise<Dish> {
        try {
            const res = await api.get(`/dishes/${id}`);
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },
};
