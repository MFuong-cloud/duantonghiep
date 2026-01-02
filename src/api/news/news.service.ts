import axios from "axios";
import { News, NewsPagination, Comment } from "@/model/News";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Add auth token if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ... existing code ...

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

export const AdminNewsService = {
    async getAll(): Promise<{ data: News[] }> {
        const res = await api.get("/auth/admin/news");
        return res.data;
    },

    async create(data: FormData): Promise<News> {
        const res = await api.post("/auth/admin/news", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    async update(id: number, data: FormData): Promise<News> {
        data.append("_method", "PUT");
        const res = await api.post(`/auth/admin/news/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return res.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/auth/admin/news/${id}`);
    },

    async getById(id: number): Promise<News> {
        const res = await api.get(`/auth/admin/news/${id}`);
        return res.data;
    }
};

export const AdminCommentService = {
    async getAll(): Promise<any> {
        const res = await api.get("/auth/admin/comments");
        return res.data;
    },

    // Nếu BE k hỗ trợ filter, ta sẽ dùng cái này xử lý ở client hoặc hy vọng BE support ?news_id=...
    async getByNewsId(newsId: number): Promise<any> {
        // Thử gọi index với param, nếu k đc thì sẽ filter client side tạm thời
        const res = await api.get(`/auth/admin/comments?news_id=${newsId}`);
        return res.data;
    },

    async approve(id: number): Promise<void> {
        await api.patch(`/auth/admin/comments/${id}/approve`);
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/auth/admin/comments/${id}`);
    }
};
