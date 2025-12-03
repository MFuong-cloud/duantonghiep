import axios from "axios";
import { Dish } from "@/model/Dish";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// API instance cho file upload (không set Content-Type để browser tự set với boundary)
const apiFormData = axios.create({
    baseURL: API_BASE,
});

export interface CreateDishData {
    category_id: number;
    name: string;
    description?: string;
    price: number;
    image?: File | null;
    images?: File[];
    status?: boolean;
}

export interface UpdateDishData {
    category_id?: number;
    name?: string;
    description?: string;
    price?: number;
    image?: File | null;
    images?: File[];
    existing_images?: string[];
    status?: boolean;
}

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

    async createDish(data: CreateDishData): Promise<Dish> {
        try {
            const formData = new FormData();
            formData.append("category_id", data.category_id.toString());
            formData.append("name", data.name);
            formData.append("price", data.price.toString());

            if (data.description) {
                formData.append("description", data.description);
            }

            if (data.image) {
                formData.append("image", data.image);
            }

            if (data.images && data.images.length > 0) {
                data.images.forEach((file) => {
                    formData.append("images[]", file);
                });
            }

            if (data.status !== undefined) {
                formData.append("status", data.status ? "1" : "0");
            }

            const res = await apiFormData.post("/dishes", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return res.data;
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async updateDish(id: number, data: UpdateDishData): Promise<Dish> {
        try {
            // Nếu có file ảnh hoặc mảng ảnh, dùng FormData
            if (data.image || (data.images && data.images.length > 0) || (data.existing_images)) {
                const formData = new FormData();

                if (data.category_id !== undefined) {
                    formData.append("category_id", data.category_id.toString());
                }
                if (data.name) {
                    formData.append("name", data.name);
                }
                if (data.price !== undefined) {
                    formData.append("price", data.price.toString());
                }
                if (data.description !== undefined) {
                    formData.append("description", data.description);
                }
                if (data.image) {
                    formData.append("image", data.image);
                }

                if (data.images && data.images.length > 0) {
                    data.images.forEach((file) => {
                        formData.append("images[]", file);
                    });
                }

                if (data.existing_images && data.existing_images.length > 0) {
                    data.existing_images.forEach((url) => {
                        formData.append("existing_images[]", url);
                    });
                }
                if (data.status !== undefined) {
                    formData.append("status", data.status ? "1" : "0");
                }

                // Sử dụng _method=PUT nếu backend Laravel yêu cầu
                formData.append("_method", "PUT");

                const res = await apiFormData.post(`/dishes/${id}`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                return res.data;
            } else {
                // Nếu không có file, dùng JSON (nhanh hơn và đơn giản hơn)
                const jsonData: any = {};

                if (data.category_id !== undefined) {
                    jsonData.category_id = data.category_id;
                }
                if (data.name) {
                    jsonData.name = data.name;
                }
                if (data.price !== undefined) {
                    jsonData.price = data.price;
                }
                if (data.description !== undefined) {
                    jsonData.description = data.description;
                }
                if (data.status !== undefined) {
                    jsonData.status = data.status ? 1 : 0;
                }

                const res = await api.put(`/dishes/${id}`, jsonData);
                return res.data;
            }
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },

    async deleteDish(id: number): Promise<void> {
        try {
            await api.delete(`/dishes/${id}`);
        } catch (error: any) {
            throw error?.response?.data ?? error;
        }
    },
};
