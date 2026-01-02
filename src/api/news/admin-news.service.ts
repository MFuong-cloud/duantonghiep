import axios from "axios";
import { News, NewsPagination } from "@/model/News";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface CreateNewsData {
    title: string;
    content: string;
    image?: string | null;
    is_active?: boolean;
}

export interface UpdateNewsData extends Partial<CreateNewsData> { }

export const AdminNewsService = {
    /**
     * Lấy danh sách tin tức (admin)
     */
    async getAll(page: number = 1): Promise<NewsPagination> {
        try {
            const res = await api.get(`/auth/admin/news?page=${page}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Lấy tin tức đã xóa (trash)
     */
    async getTrash(page: number = 1): Promise<NewsPagination> {
        try {
            const res = await api.get(`/auth/admin/news/trash?page=${page}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Lấy chi tiết tin tức
     */
    async getById(id: number): Promise<News> {
        try {
            const res = await api.get(`/auth/admin/news/${id}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Tạo tin tức mới
     */
    async create(data: CreateNewsData): Promise<News> {
        try {
            const res = await api.post("/auth/admin/news", data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Cập nhật tin tức
     */
    async update(id: number, data: UpdateNewsData): Promise<News> {
        try {
            const res = await api.put(`/auth/admin/news/${id}`, data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Xóa tin tức (soft delete)
     */
    async delete(id: number): Promise<void> {
        try {
            await api.delete(`/auth/admin/news/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Khôi phục tin tức đã xóa
     */
    async restore(id: number): Promise<News> {
        try {
            const res = await api.post(`/auth/admin/news/${id}/restore`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Xóa vĩnh viễn
     */
    async forceDelete(id: number): Promise<void> {
        try {
            await api.delete(`/auth/admin/news/${id}/force-delete`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },
};
