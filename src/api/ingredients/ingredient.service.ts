import axios from "axios";
import { Ingredient } from "@/model/Ingredient";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

export interface CreateIngredientData {
    name: string;
    unit: string;
    active: boolean;
}

export interface UpdateIngredientData {
    name?: string;
    unit?: string;
    active?: boolean;
}

export const IngredientService = {
    async getIngredients(params?: Record<string, any>): Promise<Ingredient[]> {
        try {
            const res = await api.get("/ingredients", { params });
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async getIngredient(id: string): Promise<Ingredient> {
        try {
            const res = await api.get(`/ingredients/${id}`);
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async createIngredient(data: CreateIngredientData): Promise<Ingredient> {
        try {
            const res = await api.post("/ingredients", data);
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async updateIngredient(id: string, data: UpdateIngredientData): Promise<Ingredient> {
        try {
            const res = await api.put(`/ingredients/${id}`, data);
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async deleteIngredient(id: string): Promise<void> {
        try {
            await api.delete(`/ingredients/${id}`);
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },
};
