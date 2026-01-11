import { Server } from 'socket.io';
import { createServer } from 'http';
import dotenv from 'dotenv';
import { EventEmitter } from 'events';

// Load environment variables
dotenv.config();

// Increase max listeners to avoid warnings
EventEmitter.defaultMaxListeners = 20;

const PORT = process.env.SOCKET_PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

// Create HTTP server with request handler
const httpServer = createServer((req, res) => {
    // Handle CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Handle /api/broadcast endpoint
    if (req.method === 'POST' && req.url === '/api/broadcast') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { event, data } = JSON.parse(body);

                // Broadcast to all connected clients
                io.emit(event, data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Broadcast sent' }));
            } catch (error) {
                console.error('❌ Broadcast error:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    // Default response
    res.writeHead(404);
    res.end('Not Found');
});

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
    cors: {
        origin: [FRONTEND_URL, BACKEND_URL],
        methods: ['GET', 'POST'],
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// Store connected users
const connectedUsers = new Map();
const adminSockets = new Set();

// Middleware for authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    const userRole = socket.handshake.auth.role;
    const userId = socket.handshake.auth.userId;

    // Store user info in socket
    socket.userId = userId;
    socket.userRole = userRole;
    socket.token = token;

    next();
});

// Connection handler
io.on('connection', (socket) => {
    const { userId, userRole } = socket;

    // Store user connection
    if (userId) {
        connectedUsers.set(userId, {
            socketId: socket.id,
            role: userRole,
            connectedAt: new Date()
        });
    }

    // Add to admin room if user is admin
    if (userRole === 'admin' || userRole === 'administrator') {
        socket.join('admin-room');
        adminSockets.add(socket.id);
    }

    // Join user-specific room
    if (userId) {
        socket.join(`user-${userId}`);
    }

    // Join general users room
    socket.join('users-room');

    // Send connection confirmation
    socket.emit('connected', {
        socketId: socket.id,
        userId,
        role: userRole,
        timestamp: new Date()
    });

    // ==================== TEST EVENTS ====================
    /**
     * Handle test messages for debugging
     */
    socket.on('test:message', (data) => {

        // Broadcast to all other clients
        socket.broadcast.emit('test:message', {
            senderId: socket.id,
            ...data
        });
    });

    // ==================== ADMIN EVENTS ====================

    /**
     * Admin broadcasts data change to all users
     * Event: admin:broadcast
     */
    socket.on('admin:broadcast', (data) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        // Broadcast to all users except sender
        socket.to('users-room').emit('data:updated', {
            type: data.type,
            action: data.action,
            data: data.data,
            timestamp: new Date(),
            adminId: userId
        });
    });

    /**
     * Generic data update broadcast
     * Event: data:update
     */
    socket.on('data:update', (data) => {

        // Broadcast to ALL clients (including sender's other tabs)
        io.emit('data:update', {
            type: data.type,
            timestamp: data.timestamp || Date.now(),
            source: socket.id
        });
    });

    /**
     * Admin updates specific resource
     * Event: admin:update
     */
    socket.on('admin:update', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        const { resourceType, resourceId, action, data } = payload;

        // Broadcast to all users
        io.to('users-room').emit(`${resourceType}:${action}`, {
            resourceId,
            data,
            timestamp: new Date(),
            adminId: userId
        });

        // Send confirmation to admin
        socket.emit('admin:update:success', {
            resourceType,
            resourceId,
            action
        });
    });

    /**
     * Admin creates new resource
     * Event: admin:create
     */
    socket.on('admin:create', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        const { resourceType, data } = payload;

        io.to('users-room').emit(`${resourceType}:created`, {
            data,
            timestamp: new Date(),
            adminId: userId
        });
    });

    /**
     * Admin deletes resource
     * Event: admin:delete
     */
    socket.on('admin:delete', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        const { resourceType, resourceId } = payload;

        io.to('users-room').emit(`${resourceType}:deleted`, {
            resourceId,
            timestamp: new Date(),
            adminId: userId
        });
    });

    // ==================== SPECIFIC RESOURCE EVENTS ====================

    /**
     * Table updates (for restaurant booking system)
     */
    socket.on('admin:table:update', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        console.log(`🪑 Table updated:`, payload);

        io.to('users-room').emit('table:updated', {
            ...payload,
            timestamp: new Date()
        });
    });

    /**
     * Menu updates
     */
    socket.on('admin:menu:update', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        console.log(`🍽️ Menu updated:`, payload);

        io.to('users-room').emit('menu:updated', {
            ...payload,
            timestamp: new Date()
        });
    });

    /**
     * Booking/Reservation updates
     */
    socket.on('admin:booking:update', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        const { bookingId, status, userId: targetUserId, code } = payload;
        console.log(`📅 Booking updated: ${code || bookingId} - ${status}`);

        // Notify specific user if userId provided
        if (targetUserId) {
            io.to(`user-${targetUserId}`).emit('booking:updated', {
                ...payload,
                timestamp: new Date()
            });
        }

        // Also broadcast to all users
        io.to('users-room').emit('booking:status:changed', {
            ...payload,
            timestamp: new Date()
        });
    });

    /**
     * Order updates
     */
    socket.on('admin:order:update', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        const { orderId, status, userId: targetUserId, code } = payload;

        console.log(`🛒 Order updated: ${code || orderId} - ${status}`);

        // Notify specific user
        if (targetUserId) {
            io.to(`user-${targetUserId}`).emit('order:updated', {
                ...payload,
                timestamp: new Date()
            });
        }

        // Broadcast to all
        io.to('users-room').emit('order:status:changed', {
            ...payload,
            timestamp: new Date()
        });
    });

    // ==================== USER EVENTS ====================

    /**
     * User creates a booking
     * Event: user:booking:create
     */
    socket.on('user:booking:create', (bookingData) => {
        console.log(`📅 New booking from User ${socket.id}:`, bookingData);

        // Broadcast to Admin Room
        io.to('admin-room').emit('booking:created', {
            action: 'created',
            data: bookingData,
            timestamp: new Date(),
            source: 'user'
        });

        // Also broadcast to users-room (so other staff/users can see capacity updates if needed)
        // Check if we really want to broadcast strictly to admin or everyone
        // For now, let's notify admin-room specifically as per requirement
    });

    /**
     * User creates an order
     * Event: user:order:create
     */
    socket.on('user:order:create', (orderData) => {
        console.log(`🛒 New order from User ${socket.id}:`, orderData);

        io.to('admin-room').emit('order:created', {
            action: 'created',
            data: orderData,
            timestamp: new Date(),
            source: 'user'
        });
    });



    /**
     * User requests current data
     */
    socket.on('user:request:data', (payload) => {
        const { resourceType } = payload;

        console.log(`📥 User ${userId} requested: ${resourceType}`);

        // Emit event that can be handled by your backend
        socket.emit('data:requested', {
            resourceType,
            userId,
            timestamp: new Date()
        });
    });

    /**
     * User subscribes to specific resource updates
     */
    socket.on('user:subscribe', (payload) => {
        const { resourceType, resourceId } = payload;
        const roomName = `${resourceType}-${resourceId}`;

        socket.join(roomName);
        console.log(`🔔 User ${userId} subscribed to: ${roomName}`);

        socket.emit('subscribed', { resourceType, resourceId });
    });

    /**
     * User unsubscribes from resource updates
     */
    socket.on('user:unsubscribe', (payload) => {
        const { resourceType, resourceId } = payload;
        const roomName = `${resourceType}-${resourceId}`;

        socket.leave(roomName);
        console.log(`🔕 User ${userId} unsubscribed from: ${roomName}`);

        socket.emit('unsubscribed', { resourceType, resourceId });
    });

    // ==================== NOTIFICATION EVENTS ====================

    /**
     * Send notification to specific user
     */
    socket.on('admin:notify:user', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        const { targetUserId, notification } = payload;

        console.log(`🔔 Notification sent to user ${targetUserId}`);

        io.to(`user-${targetUserId}`).emit('notification', {
            ...notification,
            timestamp: new Date()
        });
    });

    /**
     * Broadcast notification to all users
     */
    socket.on('admin:notify:all', (payload) => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        console.log(`📢 Notification broadcast to all users`);

        io.to('users-room').emit('notification', {
            ...payload,
            timestamp: new Date()
        });
    });

    // ==================== SYSTEM EVENTS ====================

    /**
     * Get online users count
     */
    socket.on('admin:get:online:users', () => {
        if (socket.userRole !== 'admin' && socket.userRole !== 'administrator') {
            socket.emit('error', { message: 'Unauthorized: Admin only' });
            return;
        }

        const onlineUsers = Array.from(connectedUsers.entries()).map(([id, info]) => ({
            userId: id,
            ...info
        }));

        socket.emit('online:users', {
            count: connectedUsers.size,
            users: onlineUsers
        });
    });

    /**
     * Ping/Pong for connection health check
     */
    socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date() });
    });

    // ==================== DISCONNECT ====================

    socket.on('disconnect', (reason) => {
        console.log(`❌ Client disconnected: ${socket.id} | Reason: ${reason}`);

        // Remove from connected users
        if (userId) {
            connectedUsers.delete(userId);
        }

        // Remove from admin sockets
        if (adminSockets.has(socket.id)) {
            adminSockets.delete(socket.id);
        }

        // Notify admins about user disconnect
        io.to('admin-room').emit('user:disconnected', {
            userId,
            socketId: socket.id,
            timestamp: new Date()
        });
    });

    socket.on('error', (error) => {
        console.error(`⚠️ Socket error for ${socket.id}:`, error);
    });
});

// Start server
httpServer.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          🚀 TableGo Socket.IO Server Running               ║
║                                                            ║
║          Port: ${PORT}                                    ║
║          Frontend: ${FRONTEND_URL}                        ║
║          Backend: ${BACKEND_URL}                          ║
║                                                            ║
║          Ready for real-time connections! ✨               ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    httpServer.close(() => {
        console.log('HTTP server closed');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    httpServer.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Export for potential testing
export { io, httpServer };
