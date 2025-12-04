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
    quantity: number;
    price: number;
}

export interface UpdateIngredientData {
    name?: string;
    unit?: string;
    quantity?: number;
    price?: number;
}

export const IngredientService = {
    async getIngredients(): Promise<Ingredient[]> {
        try {
            const res = await api.get("/ingredients");
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getIngredient(id: number): Promise<Ingredient> {
        try {
            const res = await api.get(`/ingredients/${id}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async createIngredient(data: CreateIngredientData): Promise<Ingredient> {
        try {
            const res = await api.post("/ingredients", data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async updateIngredient(id: number, data: UpdateIngredientData): Promise<Ingredient> {
        try {
            const res = await api.put(`/ingredients/${id}`, data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async deleteIngredient(id: number): Promise<void> {
        try {
            await api.delete(`/ingredients/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },
};
