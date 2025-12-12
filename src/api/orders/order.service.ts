import axios from "axios";
import { Order, OrderItem } from "@/model/Order";
import { api } from "@/lib/axios";

export interface CreateOrderData {
    user_id?: number;
    ho_ten: string;
    phone: string;
    booking_date: string;
    booking_time: string;
    quantity: number;
    note?: string;
    table_id?: number;
    items: OrderItem[];
}

export interface UpdateOrderData {
    ho_ten?: string;
    phone?: string;
    booking_date?: string;
    booking_time?: string;
    quantity?: number;
    status?: number;
    note?: string;
    table_id?: number;
    items?: OrderItem[];
}

export interface AssignTableData {
    table_id: number;
}

export const OrderService = {
    async getOrders(): Promise<Order[]> {
        try {
            const res = await api.get("/orders");
            // Backend trả về { data: [...] }
            return res.data.data || [];
        } catch (error: unknown) {
            console.error("Error fetching orders:", error);
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getOrder(id: number): Promise<Order> {
        try {
            const res = await api.get(`/orders/${id}`);
            // Backend trả về { data: {...} }
            return res.data.data;
        } catch (error: unknown) {
            console.error(`Error fetching order ${id}:`, error);
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async createOrder(data: CreateOrderData): Promise<Order> {
        try {
            const res = await api.post("/orders", data);
            // Backend trả về { message: "...", data: {...} }
            return res.data.data;
        } catch (error: unknown) {
            console.error("Error creating order:", error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể tạo đơn hàng";
                throw new Error(message);
            }
            throw error;
        }
    },

    async updateOrder(id: number, data: UpdateOrderData): Promise<Order> {
        try {
            const res = await api.put(`/orders/${id}`, data);
            // Backend trả về { message: "...", data: {...} }
            return res.data.data;
        } catch (error: unknown) {
            console.error(`Error updating order ${id}:`, error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể cập nhật đơn hàng";
                throw new Error(message);
            }
            throw error;
        }
    },

    async assignTable(id: number, data: AssignTableData): Promise<Order> {
        try {
            const res = await api.post(`/orders/${id}/assign-table`, data);
            // Backend trả về { message: "...", order: {...} }
            return res.data.order;
        } catch (error: unknown) {
            console.error(`Error assigning table to order ${id}:`, error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể gán bàn";
                throw new Error(message);
            }
            throw error;
        }
    },

    async deleteOrder(id: number): Promise<void> {
        try {
            await api.delete(`/orders/${id}`);
        } catch (error: unknown) {
            console.error(`Error deleting order ${id}:`, error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể xóa đơn hàng";
                throw new Error(message);
            }
            throw error;
        }
    },
};
