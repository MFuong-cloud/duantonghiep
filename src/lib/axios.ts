import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Axios instance cho JSON requests
export const api = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
});

// Axios instance cho FormData requests (upload files)
export const apiFormData = axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
        "Accept": "application/json"
    },
});

// Request interceptor - Tự động thêm token vào mọi request
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
};

const requestErrorInterceptor = (error: AxiosError) => {
    return Promise.reject(error);
};

// Áp dụng interceptor cho cả 2 instances
api.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
apiFormData.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

// Response interceptor - Xử lý lỗi chung (optional)
const responseInterceptor = (response: AxiosResponse) => response;

const responseErrorInterceptor = (error: AxiosError) => {
    // Có thể xử lý lỗi chung ở đây (ví dụ: redirect khi 401)
    if (error.response?.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        console.warn("Unauthorized - Token may be invalid or expired");
        // Có thể dispatch event để logout user
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-expired'));
        }
    }
    return Promise.reject(error);
};

api.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
apiFormData.interceptors.response.use(responseInterceptor, responseErrorInterceptor);
