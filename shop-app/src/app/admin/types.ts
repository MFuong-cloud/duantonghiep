// --- Định nghĩa kiểu dữ liệu dùng chung ---

export interface Category {
  id: number;
  name: string;
}

export interface Dish {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  status: 'in_stock' | 'out_of_stock';
  quantity: number;
}

export type LogType = 'booking' | 'table_change' | 'quantity_update' | 'status_change';

export interface HistoryLog {
  id: string;
  type: LogType;
  title: string;
  details: string;
  user: string;
  timestamp: string;
  bookingId: string;
}