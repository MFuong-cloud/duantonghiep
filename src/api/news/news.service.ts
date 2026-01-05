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

export interface CreateNewsData {
    title: string;
    content: string;
    image?: string | null;
    is_active?: boolean;
}

export type UpdateNewsData = Partial<CreateNewsData>;

export const AdminNewsService = {
    /**
     * Lấy danh sách tin tức (admin)
     */
    async getAll(page: number = 1): Promise<NewsPagination> {
        try {
            const res = await api.get(`/admin/news?page=${page}`);
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
            const res = await api.get(`/admin/news/trash?page=${page}`);
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
            const res = await api.get(`/admin/news/${id}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Tạo tin tức mới
     */
    async create(data: CreateNewsData | FormData): Promise<News> {
        try {
            const headers = data instanceof FormData
                ? { "Content-Type": "multipart/form-data" }
                : { "Content-Type": "application/json" };

            const res = await api.post("/admin/news", data, { headers });
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Cập nhật tin tức
     */
    async update(id: number, data: UpdateNewsData | FormData): Promise<News> {
        try {
            if (data instanceof FormData) {
                // Laravel requires POST with _method=PUT for multipart/form-data updates
                if (!data.has("_method")) {
                    data.append("_method", "PUT");
                }
                const res = await api.post(`/admin/news/${id}`, data, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                return res.data;
            } else {
                const res = await api.put(`/admin/news/${id}`, data);
                return res.data;
            }
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Xóa tin tức (soft delete)
     */
    async delete(id: number): Promise<void> {
        try {
            await api.delete(`/admin/news/${id}`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    /**
     * Khôi phục tin tức đã xóa
     */
    async restore(id: number): Promise<News> {
        try {
            const res = await api.post(`/admin/news/${id}/restore`);
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
            await api.delete(`/admin/news/${id}/force-delete`);
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },
};

export const AdminCommentService = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getAll(): Promise<any> {
        const res = await api.get("/admin/comments");
        return res.data;
    },

    // Nếu BE k hỗ trợ filter, ta sẽ dùng cái này xử lý ở client hoặc hy vọng BE support ?news_id=...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getByNewsId(newsId: number): Promise<any> {
        // Thử gọi index với param, nếu k đc thì sẽ filter client side tạm thời
        const res = await api.get(`/admin/comments?news_id=${newsId}`);
        return res.data;
    },

    async approve(id: number): Promise<void> {
        await api.patch(`/admin/comments/${id}/approve`);
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/admin/comments/${id}`);
    }
};
