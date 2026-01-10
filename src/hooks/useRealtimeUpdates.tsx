'use client';

import { useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';

interface UseRealtimeUpdatesOptions {
    serverUrl: string;
    token?: string;
    userId?: string;
    role?: string;
    onTableUpdate?: (data: any) => void;
    onMenuUpdate?: (data: any) => void;
    onBookingUpdate?: (data: any, type?: string) => void;
    onOrderUpdate?: (data: any, type?: string) => void;
    onNotification?: (data: any) => void;
    onDataUpdate?: (data: any) => void;
}

/**
 * Custom hook for handling real-time updates from admin
 * Automatically subscribes to relevant events and handles updates
 * 
 * Usage:
 * 
 * useRealtimeUpdates({
 *   serverUrl: 'http://localhost:3001',
 *   token: userToken,
 *   userId: currentUserId,
 *   role: 'user',
 *   onTableUpdate: (data) => {
 *     console.log('Table updated:', data);
 *     // Refresh table data
 *   },
 *   onBookingUpdate: (data) => {
 *     console.log('Booking updated:', data);
 *     // Update booking status
 *   }
 * });
 */
export function useRealtimeUpdates(options: UseRealtimeUpdatesOptions) {
    const {
        serverUrl,
        token,
        userId,
        role = 'user',
        onTableUpdate,
        onMenuUpdate,
        onBookingUpdate,
        onOrderUpdate,
        onNotification,
        onDataUpdate
    } = options;

    const { socket, isConnected, on, off } = useSocket({
        serverUrl,
        token,
        userId,
        role
    });

    // Subscribe to table updates
    useEffect(() => {
        if (!isConnected || !onTableUpdate) return;

        const handleTableUpdate = (data: any) => {
            // console.log('🪑 Table updated:', data);
            onTableUpdate(data);
        };

        on('table:updated', handleTableUpdate);
        on('table:created', handleTableUpdate);
        on('table:deleted', handleTableUpdate);

        return () => {
            off('table:updated', handleTableUpdate);
            off('table:created', handleTableUpdate);
            off('table:deleted', handleTableUpdate);
        };
    }, [isConnected, onTableUpdate, on, off]);

    // Subscribe to menu updates
    useEffect(() => {
        if (!isConnected || !onMenuUpdate) return;

        const handleMenuUpdate = (data: any) => {
            // console.log('🍽️ Menu updated:', data);
            onMenuUpdate(data);
        };

        on('menu:updated', handleMenuUpdate);
        on('menu:created', handleMenuUpdate);
        on('menu:deleted', handleMenuUpdate);

        return () => {
            off('menu:updated', handleMenuUpdate);
            off('menu:created', handleMenuUpdate);
            off('menu:deleted', handleMenuUpdate);
        };
    }, [isConnected, onMenuUpdate, on, off]);

    // Subscribe to booking updates
    useEffect(() => {
        if (!isConnected || !onBookingUpdate) return;


        on('booking:updated', (data) => onBookingUpdate(data, 'updated'));
        on('booking:created', (data) => onBookingUpdate(data, 'created'));
        on('booking:deleted', (data) => onBookingUpdate(data, 'deleted'));
        on('booking:status:changed', (data) => onBookingUpdate(data, 'status_changed'));

        return () => {
            off('booking:updated');
            off('booking:created');
            off('booking:deleted');
            off('booking:status:changed');
        };
    }, [isConnected, onBookingUpdate, on, off]);

    // Subscribe to order updates
    useEffect(() => {
        if (!isConnected || !onOrderUpdate) return;


        on('order:updated', (data) => onOrderUpdate(data, 'updated'));
        on('order:created', (data) => onOrderUpdate(data, 'created'));
        on('order:deleted', (data) => onOrderUpdate(data, 'deleted'));
        on('order:status:changed', (data) => onOrderUpdate(data, 'status_changed'));

        return () => {
            off('order:updated');
            off('order:created');
            off('order:deleted');
            off('order:status:changed');
        };
    }, [isConnected, onOrderUpdate, on, off]);

    // Subscribe to notifications
    useEffect(() => {
        if (!isConnected || !onNotification) return;

        const handleNotification = (data: any) => {
            // console.log('🔔 Notification received:', data);
            onNotification(data);
        };

        on('notification', handleNotification);

        return () => {
            off('notification', handleNotification);
        };
    }, [isConnected, onNotification, on, off]);

    // Subscribe to general data updates
    useEffect(() => {
        if (!isConnected || !onDataUpdate) return;

        const handleDataUpdate = (data: any) => {
            // console.log('📊 Data updated:', data);
            onDataUpdate(data);
        };

        on('data:updated', handleDataUpdate);

        return () => {
            off('data:updated', handleDataUpdate);
        };
    }, [isConnected, onDataUpdate, on, off]);

    return {
        socket,
        isConnected
    };
}

/**
 * Hook for admin to broadcast updates
 */
export function useAdminBroadcast(options: {
    serverUrl: string;
    token?: string;
    userId?: string;
}) {
    const { serverUrl, token, userId } = options;

    const { socket, isConnected, emit } = useSocket({
        serverUrl,
        token,
        userId,
        role: 'admin'
    });

    // Broadcast general data change
    const broadcastDataChange = useCallback((type: string, action: string, data: any) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:broadcast', { type, action, data });
        return true;
    }, [isConnected, emit]);

    // Update specific resource
    const updateResource = useCallback((
        resourceType: string,
        resourceId: string | number,
        action: string,
        data: any
    ) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:update', { resourceType, resourceId, action, data });
        return true;
    }, [isConnected, emit]);

    // Create resource
    const createResource = useCallback((resourceType: string, data: any) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:create', { resourceType, data });
        return true;
    }, [isConnected, emit]);

    // Delete resource
    const deleteResource = useCallback((resourceType: string, resourceId: string | number) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:delete', { resourceType, resourceId });
        return true;
    }, [isConnected, emit]);

    // Update table
    const updateTable = useCallback((tableData: any) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:table:update', tableData);
        return true;
    }, [isConnected, emit]);

    // Update menu
    const updateMenu = useCallback((menuData: any) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:menu:update', menuData);
        return true;
    }, [isConnected, emit]);

    // Update booking
    const updateBooking = useCallback((
        bookingId: string | number,
        status: string,
        targetUserId?: string | number,
        additionalData?: any
    ) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:booking:update', {
            bookingId,
            status,
            userId: targetUserId,
            ...additionalData
        });
        return true;
    }, [isConnected, emit]);

    // Update order
    const updateOrder = useCallback((
        orderId: string | number,
        status: string,
        targetUserId?: string | number,
        additionalData?: any
    ) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:order:update', {
            orderId,
            status,
            userId: targetUserId,
            ...additionalData
        });
        return true;
    }, [isConnected, emit]);

    // Send notification to specific user
    const notifyUser = useCallback((targetUserId: string | number, notification: any) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:notify:user', { targetUserId, notification });
        return true;
    }, [isConnected, emit]);

    // Broadcast notification to all users
    const notifyAllUsers = useCallback((notification: any) => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:notify:all', notification);
        return true;
    }, [isConnected, emit]);

    // Get online users
    const getOnlineUsers = useCallback(() => {
        if (!isConnected) {
            console.warn('Not connected to Socket.IO server');
            return false;
        }

        emit('admin:get:online:users');
        return true;
    }, [isConnected, emit]);

    return {
        socket,
        isConnected,
        broadcastDataChange,
        updateResource,
        createResource,
        deleteResource,
        updateTable,
        updateMenu,
        updateBooking,
        updateOrder,
        notifyUser,
        notifyAllUsers,
        getOnlineUsers
    };
}
