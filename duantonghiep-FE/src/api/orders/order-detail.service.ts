import axios from "axios";
import { api } from "@/lib/axios";

export interface CreateOrderDetailData {
    order_id: number;
    dish_id: number;
    quantity: number;
    price?: number;
    note?: string;
    status?: number;
}

export interface UpdateOrderDetailData {
    quantity?: number;
    price?: number;
    note?: string;
    status?: number;
}

export interface OrderDetail {
    id: number;
    order_id: number;
    dish_id: number;
    quantity: number;
    price: number;
    note?: string;
    status: number;
    created_by?: number;
    updated_by?: number;
    created_at: string;
    updated_at: string;
    dish?: {
        id: number;
        name: string;
        price: number;
        image?: string;
    };
}

export const OrderDetailService = {
    async getOrderDetails(): Promise<OrderDetail[]> {
        try {
            const res = await api.get("/order-details");
            return res.data.data || [];
        } catch (error: unknown) {
            console.error("Error fetching order details:", error);
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getOrderDetail(id: number): Promise<OrderDetail> {
        try {
            const res = await api.get(`/order-details/${id}`);
            return res.data.data;
        } catch (error: unknown) {
            console.error(`Error fetching order detail ${id}:`, error);
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async createOrderDetail(data: CreateOrderDetailData): Promise<OrderDetail> {
        try {
            const res = await api.post("/order-details", data);
            return res.data.data;
        } catch (error: unknown) {
            console.error("Error creating order detail:", error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể thêm món vào đơn hàng";
                throw new Error(message);
            }
            throw error;
        }
    },

    async updateOrderDetail(id: number, data: UpdateOrderDetailData): Promise<OrderDetail> {
        try {
            const res = await api.put(`/order-details/${id}`, data);
            return res.data.data;
        } catch (error: unknown) {
            console.error(`Error updating order detail ${id}:`, error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể cập nhật món";
                throw new Error(message);
            }
            throw error;
        }
    },

    async deleteOrderDetail(id: number): Promise<void> {
        try {
            await api.delete(`/order-details/${id}`);
        } catch (error: unknown) {
            console.error(`Error deleting order detail ${id}:`, error);
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể xóa món";
                throw new Error(message);
            }
            throw error;
        }
    },
};
