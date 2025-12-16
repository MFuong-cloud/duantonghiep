import axios from "axios";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export interface DailyStats {
    total_orders: number;
    total_revenue: number;
    completed_orders: number;
    cancelled_orders: number;
    pending_orders: number;
}

export interface MonthlyStats {
    total_orders: number;
    total_revenue: number;
    completed_orders: number;
    cancelled_orders: number;
}

export interface YearlyStats {
    total_orders: number;
    total_revenue: number;
    completed_orders: number;
}

export const AnalyticsService = {
    async getDailyStats(date?: string): Promise<{ period: string, date: string, stats: DailyStats }> {
        try {
            const res = await api.get("/auth/admin/analytics/daily", { params: { date } });
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getMonthlyStats(month?: number, year?: number): Promise<{ period: string, month: number, year: number, stats: MonthlyStats, breakdown: any[] }> {
        try {
            const res = await api.get("/auth/admin/analytics/monthly", { params: { month, year } });
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getYearlyStats(year?: number): Promise<{ period: string, year: number, stats: YearlyStats, breakdown: any[] }> {
        try {
            const res = await api.get("/auth/admin/analytics/yearly", { params: { year } });
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    },

    async getUpcomingBookings(): Promise<any[]> {
        try {
            const res = await api.get("/auth/admin/analytics/upcoming");
            return res.data;
        } catch (error: unknown) {
            throw axios.isAxiosError(error) ? error.response?.data ?? error : error;
        }
    }
};
