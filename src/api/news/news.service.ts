import axios from "axios";
import { News, NewsPagination, Comment } from "@/model/News";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Add auth token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const NewsService = {
    /**
     * Lấy danh sách tin tức (public)
     */
    async getNews(page: number = 1): Promise<NewsPagination> {
        try {
            const res = await api.get(`/news?page=${page}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Lấy chi tiết tin tức theo slug (public)
     */
    async getNewsBySlug(slug: string): Promise<News> {
        try {
            const res = await api.get(`/news/${slug}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Tạo comment cho tin tức (cần đăng nhập)
     */
    async createComment(data: {
        news_id: number;
        content: string;
        parent_id?: number | null;
    }): Promise<Comment> {
        try {
            const res = await api.post("/auth/comments", data);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },
};
