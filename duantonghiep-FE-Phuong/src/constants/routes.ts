export const ROUTES = {
    HOME: '/',
    MENU: '/menu',
    MENU_DETAIL: (id: number) => `/menu/${id}`,
    BOOKING: '/booking',
    ORDER: '/order',
    HISTORY: '/history',
    RESTAURANTS: '/restaurants',

    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
    },

    ADMIN: {
        DASHBOARD: '/admin',
        MENU_CATEGORIES: '/admin/menu-categories',
        MENU_ITEMS: '/admin/menu-items',
        USERS: '/admin/users',
        TABLES: '/admin/tables',
        INGREDIENTS: '/admin/ingredients',
        ORDERS: '/admin/orders',
    },
} as const;
