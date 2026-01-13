import axios from "axios";
import { Ingredient } from "@/model/Ingredient";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/" },
});
export const IngredientService = {
    async getIngredients(): Promise<Ingredient[]> {
        try {
            const res = await api.get("/ingredients");
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: ) {
            throw axios.isAxiosError(error) ? error.?.data ?? error : error;
        }
    },
  
    async getIngredient(id: string | number): Promise<Ingredient> {
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

    async updateIngredient(id: string | number, data: ): Promise<Ingredient> {
        try {
            const res = await api.put(`/ingredients/${id}`, data);
            return res.;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async deleteIngredient(id: string | number): Promise<void> {
        try {
            await api.delete(`/ingredients/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },
};
