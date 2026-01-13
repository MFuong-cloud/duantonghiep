import axios from "axios";
import { Table } from "@/model/Table";
import { api } from "@/lib/axios";

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
            const res = await api.get("/restaurant-tables", { params });
            return res.data.data || [];
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getTable(id: number): Promise<Table> {
        try {
            const res = await api.get(`/restaurant-tables/${id}`);
            return res.data.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getTableDetail(id: number): Promise<{ table: Table; ordersToday: number; allOrdersToday: any[]; activeOrders: any[] }> {
        try {
            const res = await api.get(`/restaurant-tables/${id}`);
            return {
                table: res.data.data,
                ordersToday: res.data.orders_today,
                allOrdersToday: res.data.all_orders_today || [],
                activeOrders: res.data.active_orders || []
            };
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async createTable(data: CreateTableData): Promise<Table> {
        try {
            const res = await api.post("/restaurant-tables", data);
            return res.data.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async updateTable(id: number, data: UpdateTableData): Promise<Table> {
        try {
            const res = await api.put(`/restaurant-tables/${id}`, data);
            return res.data.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async deleteTable(id: number): Promise<void> {
        try {
            await api.delete(`/restaurant-tables/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getTrash(): Promise<Table[]> {
        const res = await api.get("/restaurant-tables/trash");
        return res.data.data || [];
    },

    async restoreTable(id: number): Promise<void> {
        await api.post(`/restaurant-tables/${id}/restore`);
    },

    async forceDeleteTable(id: number): Promise<void> {
        await api.delete(`/restaurant-tables/${id}/force-delete`);
    },
};
