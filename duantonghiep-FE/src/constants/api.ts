export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/login',
        REGISTER: '/api/register',
        LOGOUT: '/api/logout',
        ME: '/api/me',
    },
    DISHES: {
        LIST: '/api/dishes',
        DETAIL: (id: number) => `/api/dishes/${id}`,
        CREATE: '/api/dishes',
        UPDATE: (id: number) => `/api/dishes/${id}`,
        DELETE: (id: number) => `/api/dishes/${id}`,
    },
    CATEGORIES: {
        LIST: '/api/categories',
        DETAIL: (id: number) => `/api/categories/${id}`,
        CREATE: '/api/categories',
        UPDATE: (id: number) => `/api/categories/${id}`,
        DELETE: (id: number) => `/api/categories/${id}`,
    },
    USERS: {
        LIST: '/api/users',
        DETAIL: (id: number) => `/api/users/${id}`,
        CREATE: '/api/users',
        UPDATE: (id: number) => `/api/users/${id}`,
        DELETE: (id: number) => `/api/users/${id}`,
    },
    TABLES: {
        LIST: '/api/tables',
        DETAIL: (id: number) => `/api/tables/${id}`,
        CREATE: '/api/tables',
        UPDATE: (id: number) => `/api/tables/${id}`,
        DELETE: (id: number) => `/api/tables/${id}`,
    },
    INGREDIENTS: {
        LIST: '/api/ingredients',
        DETAIL: (id: string) => `/api/ingredients/${id}`,
        CREATE: '/api/ingredients',
        UPDATE: (id: string) => `/api/ingredients/${id}`,
        DELETE: (id: string) => `/api/ingredients/${id}`,
    },
} as const;

export const STORAGE_URL = `${API_BASE_URL}/storage`;
