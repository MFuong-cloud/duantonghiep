'use client';

import { useState, useEffect } from 'react';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { toast } from 'react-toastify';

interface Table {
    id: number;
    name: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
}

export default function UserTablesView() {
    const [tables, setTables] = useState<Table[]>([]);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    // Fetch tables từ API
    const fetchTables = async () => {
        try {
            const response = await fetch('/api/tables');
            const data = await response.json();
            setTables(data);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    // Kết nối Socket.IO và nhận real-time updates
    const { isConnected } = useRealtimeUpdates({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        token: 'user-jwt-token', // Lấy từ auth context
        userId: 'user-id', // Lấy từ auth context
        role: 'user',

        // Callback khi table được update
        onTableUpdate: (data) => {
            console.log('📥 Received table update:', data);

            // Update local state
            if (data.tableId) {
                setTables(prev =>
                    prev.map(t =>
                        t.id === data.tableId
                            ? { ...t, ...data }
                            : t
                    )
                );
            } else {
                // If full refresh needed
                fetchTables();
            }

            setLastUpdate(new Date());

            // Show notification
            toast.info(`Bàn ${data.name || data.tableId} đã được cập nhật`, {
                position: 'top-right',
                autoClose: 3000
            });
        },

        // Callback khi booking được update
        onBookingUpdate: (data) => {
            console.log('📥 Received booking update:', data);

            toast.success('Trạng thái đặt bàn của bạn đã được cập nhật!', {
                position: 'top-right',
                autoClose: 5000
            });
        },

        // Callback khi menu được update
        onMenuUpdate: (data) => {
            console.log('📥 Received menu update:', data);

            toast.info('Thực đơn đã được cập nhật!', {
                position: 'top-right',
                autoClose: 3000
            });
        },

        // Callback khi nhận notification từ admin
        onNotification: (notification) => {
            console.log('🔔 Received notification:', notification);

            const toastType = notification.type === 'error' ? toast.error
                : notification.type === 'warning' ? toast.warning
                    : notification.type === 'success' ? toast.success
                        : toast.info;

            toastType(notification.message || notification.title, {
                position: 'top-center',
                autoClose: notification.priority === 'high' ? false : 5000
            });
        },

        // Callback cho general data updates
        onDataUpdate: (data) => {
            console.log('📊 General data update:', data);

            // Handle based on type
            switch (data.type) {
                case 'table':
                    fetchTables();
                    break;
                case 'menu':
                    // Refresh menu
                    break;
                case 'booking':
                    // Refresh bookings
                    break;
                default:
                    console.log('Unknown data type:', data.type);
            }
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-800';
            case 'occupied':
                return 'bg-red-100 text-red-800';
            case 'reserved':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Trống';
            case 'occupied':
                return 'Đang sử dụng';
            case 'reserved':
                return 'Đã đặt';
            default:
                return status;
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Danh sách Bàn</h1>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-sm">
                            {isConnected ? '🟢 Real-time updates active' : '🔴 Offline'}
                        </span>
                    </div>
                    {lastUpdate && (
                        <span className="text-sm text-gray-600">
                            Cập nhật lần cuối: {lastUpdate.toLocaleTimeString('vi-VN')}
                        </span>
                    )}
                </div>
            </div>

            {!isConnected && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        ⚠️ Bạn đang offline. Dữ liệu có thể không được cập nhật real-time.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-lg">{table.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(table.status)}`}>
                                {getStatusText(table.status)}
                            </span>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p>👥 Sức chứa: {table.capacity} người</p>
                        </div>

                        {table.status === 'available' && (
                            <button
                                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                                onClick={() => {
                                    // Handle booking
                                    toast.info('Chức năng đặt bàn đang được phát triển...');
                                }}
                            >
                                Đặt bàn
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {tables.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Chưa có bàn nào</p>
                </div>
            )}

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">💡 Tính năng Real-time:</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                    <li>✅ Tự động cập nhật khi admin thay đổi trạng thái bàn</li>
                    <li>✅ Nhận thông báo khi có cập nhật mới</li>
                    <li>✅ Không cần refresh trang</li>
                    <li>✅ Cập nhật ngay lập tức cho tất cả users</li>
                </ul>
            </div>
        </div>
    );
}
