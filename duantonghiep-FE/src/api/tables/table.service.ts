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



  
    async getTableDetail(id: number): Promise<{ table: Table; ordersToday: number; allOrdersToday: any[]; activeOrders: any[] }> {
        try {
            const res = await api.get(`/restaurant-tables/${id}`);
            return {
                table: res.data.data,

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
