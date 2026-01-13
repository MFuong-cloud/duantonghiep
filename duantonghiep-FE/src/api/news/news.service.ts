import axios from "axios";
import { News, NewsPagination, Comment } from "@/model/News";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});



export const NewsService = {
    async getNews(page: number = 1): Promise<NewsPagination> {
        try {
            const res = await api.get(`/news?page=${page}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getNewsBySlug(slug: string): Promise<News> {
        try {
            const res = await api.get(`/news/${slug}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

  
export interface CreateNewsData {
    title: string;
    content: string;
    image?: string | null;
    is_active?: boolean;
}

export type UpdateNewsData = Partial<CreateNewsData>;

export const AdminNewsService = {
    async getAll(page: number = 1): Promise<NewsPagination> {
        try {
            const res = await api.get(`/admin/news?page=${page}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getTrash(page: number = 1): Promise<NewsPagination> {
        try {
            const res = await api.get(`/admin/news/trash?page=${page}`);
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    

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

    async update(id: number, data: UpdateNewsData | FormData): Promise<News> {
        try {
            if (data instanceof FormData) {
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

  
   
export const AdminCommentService = {
    async getAll(): Promise<any> {
        const res = await api.get("/admin/comments");
        return res.data;
    },

    async getByNewsId(newsId: number): Promise<any> {
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
