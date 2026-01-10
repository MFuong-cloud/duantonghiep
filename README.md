# TableGo Socket.IO Real-time Server

Server Socket.IO độc lập cho hệ thống TableGo, cung cấp khả năng real-time updates từ Admin đến Users.

## 📋 Mục lục

- [Tính năng](#tính-năng)
- [Cài đặt](#cài-đặt)
- [Cấu hình](#cấu-hình)
- [Chạy Server](#chạy-server)
- [Tích hợp Frontend](#tích-hợp-frontend)
- [Tích hợp Backend](#tích-hợp-backend)
- [Events Documentation](#events-documentation)
- [Ví dụ sử dụng](#ví-dụ-sử-dụng)

## ✨ Tính năng

### Cho Admin:
- ✅ Broadcast thay đổi dữ liệu đến tất cả users
- ✅ Update/Create/Delete resources (tables, menu, bookings, orders)
- ✅ Gửi notifications đến user cụ thể hoặc tất cả users
- ✅ Xem danh sách users đang online
- ✅ Real-time updates khi thay đổi bất kỳ dữ liệu nào

### Cho Users:
- ✅ Nhận real-time updates khi admin thay đổi dữ liệu
- ✅ Subscribe/Unsubscribe đến specific resources
- ✅ Nhận notifications từ admin
- ✅ Auto-reconnect khi mất kết nối

## 🚀 Cài đặt

### 1. Cài đặt dependencies

\`\`\`bash
cd SocketIO
npm install
\`\`\`

### 2. Cấu hình môi trường

Tạo file \`.env\` (đã có sẵn template):

\`\`\`env
SOCKET_PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
JWT_SECRET=your-secret-key-here
LOG_LEVEL=info
\`\`\`

## ⚙️ Cấu hình

### Environment Variables

| Variable | Mô tả | Mặc định |
|----------|-------|----------|
| `SOCKET_PORT` | Port cho Socket.IO server | 3001 |
| `NODE_ENV` | Môi trường (development/production) | development |
| `FRONTEND_URL` | URL của frontend (CORS) | http://localhost:3000 |
| `BACKEND_URL` | URL của backend (CORS) | http://localhost:8000 |
| `JWT_SECRET` | Secret key cho JWT | - |
| `LOG_LEVEL` | Mức độ logging | info |

## 🏃 Chạy Server

### Development mode (với nodemon)

\`\`\`bash
npm run dev
\`\`\`

### Production mode

\`\`\`bash
npm start
\`\`\`

Server sẽ chạy tại: `http://localhost:3001`

## 🔌 Tích hợp Frontend (Next.js)

### 1. Cài đặt Socket.IO client

\`\`\`bash
cd FE
npm install socket.io-client
\`\`\`

### 2. Sử dụng hooks đã tạo sẵn

#### Cho Users - Nhận real-time updates:

\`\`\`tsx
'use client';

import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useEffect } from 'react';

export default function TablesPage() {
  const [tables, setTables] = useState([]);

  // Kết nối và nhận updates
  useRealtimeUpdates({
    serverUrl: 'http://localhost:3001',
    token: userToken, // JWT token từ auth
    userId: currentUserId,
    role: 'user',
    
    // Callback khi table được update
    onTableUpdate: (data) => {
      console.log('Table updated:', data);
      // Refresh lại danh sách tables
      fetchTables();
    },
    
    // Callback khi booking được update
    onBookingUpdate: (data) => {
      console.log('Booking updated:', data);
      // Update UI
    },
    
    // Callback khi nhận notification
    onNotification: (notification) => {
      toast.success(notification.message);
    }
  });

  return (
    <div>
      {/* Your UI */}
    </div>
  );
}
\`\`\`

#### Cho Admin - Broadcast updates:

\`\`\`tsx
'use client';

import { useAdminBroadcast } from '@/hooks/useRealtimeUpdates';

export default function AdminDashboard() {
  const {
    isConnected,
    updateTable,
    updateBooking,
    notifyAllUsers,
    getOnlineUsers
  } = useAdminBroadcast({
    serverUrl: 'http://localhost:3001',
    token: adminToken,
    userId: adminId
  });

  const handleUpdateTable = async (tableId, newData) => {
    // Update trong database
    await api.updateTable(tableId, newData);
    
    // Broadcast đến tất cả users
    updateTable({
      tableId,
      ...newData
    });
  };

  const handleApproveBooking = async (bookingId, userId) => {
    // Update trong database
    await api.approveBooking(bookingId);
    
    // Notify user
    updateBooking(bookingId, 'approved', userId, {
      message: 'Đặt bàn của bạn đã được chấp nhận!'
    });
  };

  return (
    <div>
      <p>Socket Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      {/* Your admin UI */}
    </div>
  );
}
\`\`\`

### 3. Hoặc sử dụng hook cơ bản:

\`\`\`tsx
import { useSocket } from '@/hooks/useSocket';

const { socket, isConnected, emit, on, off } = useSocket({
  serverUrl: 'http://localhost:3001',
  token: userToken,
  userId: currentUserId,
  role: 'user'
});

// Listen to events
useEffect(() => {
  on('table:updated', (data) => {
    console.log('Table updated:', data);
  });

  return () => {
    off('table:updated');
  };
}, [on, off]);

// Emit events
const handleAction = () => {
  emit('admin:table:update', { tableId: 1, status: 'available' });
};
\`\`\`

## 🔧 Tích hợp Backend (Laravel)

### Option 1: Sử dụng HTTP request để trigger Socket.IO

Trong Laravel Controller, sau khi update database:

\`\`\`php
use Illuminate\\Support\\Facades\\Http;

class TableController extends Controller
{
    public function update(Request $request, $id)
    {
        // Update database
        $table = Table::findOrFail($id);
        $table->update($request->all());
        
        // Trigger Socket.IO broadcast
        // Bạn có thể tạo một endpoint trong Socket.IO server
        // hoặc sử dụng Redis pub/sub
        
        return response()->json($table);
    }
}
\`\`\`

### Option 2: Sử dụng Redis Pub/Sub (Recommended)

Cài đặt Redis adapter cho Socket.IO:

\`\`\`bash
cd SocketIO
npm install @socket.io/redis-adapter redis
\`\`\`

Update `server.js`:

\`\`\`javascript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
\`\`\`

Trong Laravel:

\`\`\`php
use Illuminate\\Support\\Facades\\Redis;

Redis::publish('table:updated', json_encode([
    'tableId' => $table->id,
    'data' => $table
]));
\`\`\`

## 📡 Events Documentation

### Admin Events (Emit từ Admin)

| Event | Payload | Mô tả |
|-------|---------|-------|
| `admin:broadcast` | `{ type, action, data }` | Broadcast general data change |
| `admin:update` | `{ resourceType, resourceId, action, data }` | Update specific resource |
| `admin:create` | `{ resourceType, data }` | Create new resource |
| `admin:delete` | `{ resourceType, resourceId }` | Delete resource |
| `admin:table:update` | `{ tableId, ...data }` | Update table |
| `admin:menu:update` | `{ menuId, ...data }` | Update menu |
| `admin:booking:update` | `{ bookingId, status, userId, ...data }` | Update booking |
| `admin:order:update` | `{ orderId, status, userId, ...data }` | Update order |
| `admin:notify:user` | `{ targetUserId, notification }` | Notify specific user |
| `admin:notify:all` | `{ notification }` | Notify all users |
| `admin:get:online:users` | - | Get online users list |

### User Events (Receive bởi Users)

| Event | Payload | Mô tả |
|-------|---------|-------|
| `data:updated` | `{ type, action, data, timestamp, adminId }` | General data updated |
| `table:updated` | `{ tableId, data, timestamp }` | Table updated |
| `table:created` | `{ data, timestamp }` | New table created |
| `table:deleted` | `{ tableId, timestamp }` | Table deleted |
| `menu:updated` | `{ menuId, data, timestamp }` | Menu updated |
| `booking:updated` | `{ bookingId, status, data, timestamp }` | Booking updated |
| `booking:status:changed` | `{ bookingId, status, timestamp }` | Booking status changed |
| `order:updated` | `{ orderId, status, data, timestamp }` | Order updated |
| `notification` | `{ message, type, timestamp }` | Notification received |
| `online:users` | `{ count, users }` | Online users list |

### Connection Events

| Event | Mô tả |
|-------|-------|
| `connect` | Connected to server |
| `connected` | Connection confirmed with user data |
| `disconnect` | Disconnected from server |
| `error` | Error occurred |
| `ping` / `pong` | Health check |

## 💡 Ví dụ sử dụng

### Ví dụ 1: Admin update table status

**Admin side:**
\`\`\`typescript
// Sau khi update database
const updateTableStatus = async (tableId: number, status: string) => {
  // 1. Update database
  await api.put(\`/tables/\${tableId}\`, { status });
  
  // 2. Broadcast to all users
  updateTable({
    tableId,
    status,
    updatedAt: new Date()
  });
};
\`\`\`

**User side:**
\`\`\`typescript
// Tự động nhận update
useRealtimeUpdates({
  serverUrl: 'http://localhost:3001',
  token: userToken,
  userId: currentUserId,
  role: 'user',
  onTableUpdate: (data) => {
    // Refresh table list
    queryClient.invalidateQueries(['tables']);
    
    // Show notification
    toast.info(\`Bàn #\${data.tableId} đã được cập nhật\`);
  }
});
\`\`\`

### Ví dụ 2: Admin approve booking

**Admin side:**
\`\`\`typescript
const approveBooking = async (bookingId: number, userId: number) => {
  // 1. Update database
  await api.put(\`/bookings/\${bookingId}\`, { status: 'approved' });
  
  // 2. Notify specific user
  updateBooking(bookingId, 'approved', userId, {
    message: 'Đặt bàn của bạn đã được chấp nhận!',
    bookingId
  });
};
\`\`\`

**User side:**
\`\`\`typescript
useRealtimeUpdates({
  serverUrl: 'http://localhost:3001',
  token: userToken,
  userId: currentUserId,
  role: 'user',
  onBookingUpdate: (data) => {
    if (data.status === 'approved') {
      toast.success('🎉 Đặt bàn của bạn đã được chấp nhận!');
      // Refresh bookings
      refetchBookings();
    }
  }
});
\`\`\`

### Ví dụ 3: Broadcast notification to all users

**Admin side:**
\`\`\`typescript
const sendAnnouncement = () => {
  notifyAllUsers({
    type: 'announcement',
    title: 'Thông báo',
    message: 'Nhà hàng sẽ đóng cửa sớm hôm nay lúc 20:00',
    priority: 'high'
  });
};
\`\`\`

**User side:**
\`\`\`typescript
useRealtimeUpdates({
  serverUrl: 'http://localhost:3001',
  token: userToken,
  userId: currentUserId,
  role: 'user',
  onNotification: (notification) => {
    if (notification.priority === 'high') {
      toast.error(notification.message);
    } else {
      toast.info(notification.message);
    }
  }
});
\`\`\`

## 🔒 Security

- ✅ CORS configuration cho Frontend và Backend
- ✅ Authentication middleware (token-based)
- ✅ Role-based access control (Admin vs User)
- ✅ Event validation
- ⚠️ **TODO**: Implement JWT verification trong middleware

## 📊 Monitoring

Server logs sẽ hiển thị:
- ✅ Connection/Disconnection events
- ✅ Admin actions
- ✅ User subscriptions
- ✅ Errors và warnings

## 🐛 Troubleshooting

### Socket không kết nối được

1. Kiểm tra Socket.IO server đang chạy: `http://localhost:3001`
2. Kiểm tra CORS configuration trong `.env`
3. Kiểm tra token và userId có được truyền đúng không

### User không nhận được updates

1. Kiểm tra user đã connect thành công chưa
2. Kiểm tra event name có đúng không
3. Kiểm tra console logs để debug

### Admin không broadcast được

1. Kiểm tra role có phải 'admin' hoặc 'administrator'
2. Kiểm tra socket connection status
3. Xem server logs để check errors

## 📝 License

MIT

## 👥 Contributors

- Your Team

---

**Lưu ý**: Đây là phiên bản development. Trong production, cần:
- Implement JWT verification
- Add rate limiting
- Setup SSL/TLS
- Use Redis adapter cho horizontal scaling
- Add comprehensive error handling
- Implement logging system (Winston, etc.)
