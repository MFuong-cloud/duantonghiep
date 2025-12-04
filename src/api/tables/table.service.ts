import axios from "axios";
import { Table } from "@/model/Table";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

export interface CreateTableData {
    name: string;
    capacity: number;
    status: "available" | "occupied" | "reserved";
}

export interface UpdateTableData {
    name?: string;
    capacity?: number;
    status?: "available" | "occupied" | "reserved";
}

export const TableService = {
    async getTables(params?: Record<string, string | number>): Promise<Table[]> {
        try {
            const res = await api.get("/tables", { params });
            return Array.isArray(res.data) ? res.data : [];
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getTable(id: number): Promise<Table> {
        try {
            const res = await api.get(`/tables/${id}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async createTable(data: CreateTableData): Promise<Table> {
        try {
            const res = await api.post("/tables", data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async updateTable(id: number, data: UpdateTableData): Promise<Table> {
        try {
            const res = await api.put(`/tables/${id}`, data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async deleteTable(id: number): Promise<void> {
        try {
            await api.delete(`/tables/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },
};
