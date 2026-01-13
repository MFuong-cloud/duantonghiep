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

   

    async createOrderDetail(data: CreateOrderDetailData): Promise<> {
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

    async updateOrderDetail(id: number, data: UpdateOrderDetailData): Promise<> {
        try {
            const res = await api.put(`/order-details/${id}`, data);
            return res.data.data;
        } catch (error: unknown) {
            console.error(`Error updating order detail ${id}:`, error);
            if (axios.isAxiosError(error)) {
              
                throw new Error(message);
            }
            throw error;
        }
    },

    async deleteOrderDetail(id: number): Promise<void> {
        try {
            await api.delete(`/order-details/${id}`);
        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "Không thể xóa món";
                throw new Error(message);
            }
            throw error;
        }
    },
};
