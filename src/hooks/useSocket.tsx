'use client';

import { io, Socket } from 'socket.io-client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface SocketOptions {
    serverUrl: string;
    token?: string;
    userId?: string;
    role?: string;
    autoConnect?: boolean;
}

interface UseSocketReturn {
    socket: Socket | null;
    isConnected: boolean;
    emit: (event: string, data?: any) => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback?: (...args: any[]) => void) => void;
    connect: () => void;
    disconnect: () => void;
}

/**
 * Custom React Hook for Socket.IO
 * Usage in components:
 * 
 * const { socket, isConnected, emit, on, off } = useSocket({
 *   serverUrl: 'http://localhost:3001',
 *   token: 'your-jwt-token',
 *   userId: 'user-id',
 *   role: 'user'
 * });
 */
export function useSocket(options: SocketOptions): UseSocketReturn {
    const {
        serverUrl,
        token,
        userId,
        role = 'user',
        autoConnect = true
    } = options;

    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    // Initialize socket connection
    useEffect(() => {
        if (!serverUrl || socketRef.current) return;

        const socket = io(serverUrl, {
            auth: {
                token,
                userId,
                role
            },
            autoConnect,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5
        });

        socketRef.current = socket;

        // Connection event listeners
        socket.on('connect', () => {
            // console.log('✅ Connected to Socket.IO server:', socket.id);
            setIsConnected(true);
        });

        socket.on('connected', () => {
            // console.log('🎉 Connection confirmed:', data);
        });

        socket.on('disconnect', () => {
            // console.log('❌ Disconnected from Socket.IO server:', reason);
            setIsConnected(false);
        });

        socket.on('error', (error) => {
            console.error('⚠️ Socket.IO error:', error);
        });

        socket.on('connect_error', () => {
            // console.error('❌ Connection error:', error);
            setIsConnected(false);
        });

        // Cleanup on unmount
        return () => {
            if (socket) {
                socket.disconnect();
                socketRef.current = null;
            }
        };
    }, [serverUrl, token, userId, role, autoConnect]);

    // Emit event
    const emit = useCallback((event: string, data?: any) => {
        if (socketRef.current && isConnected) {
            socketRef.current.emit(event, data);
        } else {
            console.warn('Socket not connected. Cannot emit event:', event);
        }
    }, [isConnected]);

    // Add event listener
    const on = useCallback((event: string, callback: (...args: any[]) => void) => {
        if (socketRef.current) {
            socketRef.current.on(event, callback);
        }
    }, []);

    // Remove event listener
    const off = useCallback((event: string, callback?: (...args: any[]) => void) => {
        if (socketRef.current) {
            if (callback) {
                socketRef.current.off(event, callback);
            } else {
                socketRef.current.off(event);
            }
        }
    }, []);

    // Manual connect
    const connect = useCallback(() => {
        if (socketRef.current && !isConnected) {
            socketRef.current.connect();
        }
    }, [isConnected]);

    // Manual disconnect
    const disconnect = useCallback(() => {
        if (socketRef.current && isConnected) {
            socketRef.current.disconnect();
        }
    }, [isConnected]);

    return {
        socket: socketRef.current,
        isConnected,
        emit,
        on,
        off,
        connect,
        disconnect
    };
}

/**
 * Socket.IO Context Provider
 * Wrap your app with this to provide socket instance globally
 */
import { createContext, useContext, ReactNode } from 'react';

interface SocketContextValue {
    socket: Socket | null;
    isConnected: boolean;
    emit: (event: string, data?: any) => void;
    on: (event: string, callback: (...args: any[]) => void) => void;
    off: (event: string, callback?: (...args: any[]) => void) => void;
}

const SocketContext = createContext<SocketContextValue | null>(null);

interface SocketProviderProps {
    children: ReactNode;
    serverUrl: string;
    token?: string;
    userId?: string;
    role?: string;
}

export function SocketProvider({
    children,
    serverUrl,
    token,
    userId,
    role
}: SocketProviderProps) {
    const socketData = useSocket({ serverUrl, token, userId, role });

    return (
        <SocketContext.Provider value={socketData}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocketContext() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocketContext must be used within SocketProvider');
    }
    return context;
}
