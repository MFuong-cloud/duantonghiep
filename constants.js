/**
 * Socket.IO Event Constants
 * Centralized event names for consistency across the application
 */

// ==================== CONNECTION EVENTS ====================
export const CONNECTION_EVENTS = {
    CONNECT: 'connect',
    CONNECTED: 'connected',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    PING: 'ping',
    PONG: 'pong'
};

// ==================== ADMIN EVENTS ====================
export const ADMIN_EVENTS = {
    // General admin actions
    BROADCAST: 'admin:broadcast',
    UPDATE: 'admin:update',
    CREATE: 'admin:create',
    DELETE: 'admin:delete',

    // Table management
    TABLE_UPDATE: 'admin:table:update',
    TABLE_CREATE: 'admin:table:create',
    TABLE_DELETE: 'admin:table:delete',

    // Menu management
    MENU_UPDATE: 'admin:menu:update',
    MENU_CREATE: 'admin:menu:create',
    MENU_DELETE: 'admin:menu:delete',

    // Booking management
    BOOKING_UPDATE: 'admin:booking:update',
    BOOKING_CREATE: 'admin:booking:create',
    BOOKING_DELETE: 'admin:booking:delete',
    BOOKING_APPROVE: 'admin:booking:approve',
    BOOKING_REJECT: 'admin:booking:reject',

    // Order management
    ORDER_UPDATE: 'admin:order:update',
    ORDER_CREATE: 'admin:order:create',
    ORDER_DELETE: 'admin:order:delete',
    ORDER_STATUS_CHANGE: 'admin:order:status:change',

    // Notifications
    NOTIFY_USER: 'admin:notify:user',
    NOTIFY_ALL: 'admin:notify:all',

    // System
    GET_ONLINE_USERS: 'admin:get:online:users',
    UPDATE_SUCCESS: 'admin:update:success'
};

// ==================== USER EVENTS ====================
export const USER_EVENTS = {
    // Data requests
    REQUEST_DATA: 'user:request:data',
    DATA_REQUESTED: 'data:requested',

    // Subscriptions
    SUBSCRIBE: 'user:subscribe',
    UNSUBSCRIBE: 'user:unsubscribe',
    SUBSCRIBED: 'subscribed',
    UNSUBSCRIBED: 'unsubscribed',

    // User actions
    USER_DISCONNECTED: 'user:disconnected'
};

// ==================== DATA UPDATE EVENTS ====================
export const DATA_EVENTS = {
    // General data updates
    DATA_UPDATED: 'data:updated',

    // Table updates
    TABLE_UPDATED: 'table:updated',
    TABLE_CREATED: 'table:created',
    TABLE_DELETED: 'table:deleted',

    // Menu updates
    MENU_UPDATED: 'menu:updated',
    MENU_CREATED: 'menu:created',
    MENU_DELETED: 'menu:deleted',

    // Booking updates
    BOOKING_UPDATED: 'booking:updated',
    BOOKING_CREATED: 'booking:created',
    BOOKING_DELETED: 'booking:deleted',
    BOOKING_STATUS_CHANGED: 'booking:status:changed',

    // Order updates
    ORDER_UPDATED: 'order:updated',
    ORDER_CREATED: 'order:created',
    ORDER_DELETED: 'order:deleted',
    ORDER_STATUS_CHANGED: 'order:status:changed'
};

// ==================== NOTIFICATION EVENTS ====================
export const NOTIFICATION_EVENTS = {
    NOTIFICATION: 'notification',
    ONLINE_USERS: 'online:users'
};

// ==================== RESOURCE TYPES ====================
export const RESOURCE_TYPES = {
    TABLE: 'table',
    MENU: 'menu',
    BOOKING: 'booking',
    ORDER: 'order',
    USER: 'user',
    CATEGORY: 'category',
    DISH: 'dish'
};

// ==================== ACTION TYPES ====================
export const ACTION_TYPES = {
    CREATE: 'created',
    UPDATE: 'updated',
    DELETE: 'deleted',
    STATUS_CHANGE: 'status:changed'
};

// ==================== ROOM NAMES ====================
export const ROOMS = {
    ADMIN: 'admin-room',
    USERS: 'users-room',
    USER_PREFIX: 'user-',
    RESOURCE_PREFIX: (type, id) => `${type}-${id}`
};

// ==================== USER ROLES ====================
export const USER_ROLES = {
    ADMIN: 'admin',
    ADMINISTRATOR: 'administrator',
    USER: 'user',
    GUEST: 'guest'
};

// Export all constants
export default {
    CONNECTION_EVENTS,
    ADMIN_EVENTS,
    USER_EVENTS,
    DATA_EVENTS,
    NOTIFICATION_EVENTS,
    RESOURCE_TYPES,
    ACTION_TYPES,
    ROOMS,
    USER_ROLES
};
