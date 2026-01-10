/**
 * EXAMPLE: Admin Component - Quản lý Tables với Real-time Updates
 * 
 * Component này demo cách admin có thể update tables và broadcast
 * changes đến tất cả users đang online
 */

'use client';

import { useState, useEffect } from 'react';
import { useAdminBroadcast } from '@/hooks/useRealtimeUpdates';

interface Table {
    id: number;
    name: string;
    capacity: number;
    status: 'available' | 'occupied' | 'reserved';
}

export default function AdminTablesManager() {
    const [tables, setTables] = useState<Table[]>([]);
    const [onlineUsers, setOnlineUsers] = useState(0);

    // Kết nối Socket.IO với quyền admin
    const {
        isConnected,
        updateTable,
        createResource,
        deleteResource,
        notifyAllUsers,
        getOnlineUsers
    } = useAdminBroadcast({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        token: 'your-admin-jwt-token', // Lấy từ auth context
        userId: 'admin-user-id' // Lấy từ auth context
    });

    // Fetch tables từ API
    useEffect(() => {
        fetchTables();
    }, []);

    // Get online users khi connect
    useEffect(() => {
        if (isConnected) {
            getOnlineUsers();
        }
    }, [isConnected, getOnlineUsers]);

    const fetchTables = async () => {
        try {
            // Call your API
            const response = await fetch('/api/tables');
            const data = await response.json();
            setTables(data);
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    // Update table status
    const handleUpdateTableStatus = async (tableId: number, newStatus: string) => {
        try {
            // 1. Update trong database (call API)
            const response = await fetch(`/api/tables/${tableId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to update table');

            const updatedTable = await response.json();

            // 2. Update local state
            setTables(prev =>
                prev.map(t => t.id === tableId ? { ...t, status: newStatus as any } : t)
            );

            // 3. Broadcast đến tất cả users qua Socket.IO
            updateTable({
                tableId,
                status: newStatus,
                name: updatedTable.name,
                capacity: updatedTable.capacity,
                updatedAt: new Date().toISOString()
            });

            console.log(`✅ Table ${tableId} updated and broadcasted to all users`);

            // 4. Optional: Send notification
            notifyAllUsers({
                type: 'info',
                title: 'Cập nhật bàn',
                message: `Bàn ${updatedTable.name} đã được cập nhật trạng thái: ${newStatus}`
            });

        } catch (error) {
            console.error('Error updating table:', error);
        }
    };

    // Create new table
    const handleCreateTable = async (tableData: Omit<Table, 'id'>) => {
        try {
            // 1. Create trong database
            const response = await fetch('/api/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tableData)
            });

            if (!response.ok) throw new Error('Failed to create table');

            const newTable = await response.json();

            // 2. Update local state
            setTables(prev => [...prev, newTable]);

            // 3. Broadcast to all users
            createResource('table', newTable);

            console.log('✅ New table created and broadcasted');

        } catch (error) {
            console.error('Error creating table:', error);
        }
    };

    // Delete table
    const handleDeleteTable = async (tableId: number) => {
        try {
            // 1. Delete from database
            const response = await fetch(`/api/tables/${tableId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete table');

            // 2. Update local state
            setTables(prev => prev.filter(t => t.id !== tableId));

            // 3. Broadcast to all users
            deleteResource('table', tableId);

            console.log('✅ Table deleted and broadcasted');

        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Quản lý Bàn</h1>
                <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-sm">
                            Socket.IO: {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <span className="text-sm text-gray-600">
                        👥 {onlineUsers} users online
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map((table) => (
                    <div
                        key={table.id}
                        className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <h3 className="font-semibold text-lg">{table.name}</h3>
                        <p className="text-sm text-gray-600">Sức chứa: {table.capacity} người</p>

                        <div className="mt-4">
                            <label className="text-sm font-medium">Trạng thái:</label>
                            <select
                                value={table.status}
                                onChange={(e) => handleUpdateTableStatus(table.id, e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                <option value="available">Trống</option>
                                <option value="occupied">Đang sử dụng</option>
                                <option value="reserved">Đã đặt</option>
                            </select>
                        </div>

                        <button
                            onClick={() => handleDeleteTable(table.id)}
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                        >
                            Xóa bàn
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6">
                <button
                    onClick={() => handleCreateTable({
                        name: `Bàn ${tables.length + 1}`,
                        capacity: 4,
                        status: 'available'
                    })}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    + Thêm bàn mới
                </button>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded">
                <h3 className="font-semibold mb-2">Gửi thông báo đến tất cả users:</h3>
                <button
                    onClick={() => notifyAllUsers({
                        type: 'announcement',
                        title: 'Thông báo',
                        message: 'Có cập nhật mới về danh sách bàn!',
                        priority: 'normal'
                    })}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    📢 Gửi thông báo
                </button>
            </div>
        </div>
    );
}
