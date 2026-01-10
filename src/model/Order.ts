import { User } from "./User";
import { Dish } from "./Dish";
import { Table } from "./Table";

export interface OrderDetail {
    id: number;
    order_id: number;
    dish_id: number;
    quantity: number;
    price: number;
    note?: string;
    status: number;
    created_by?: number;
    dish?: Dish;
}

export interface OrderHistory {
    id: number;
    order_id: number;
    action_status: number;
    old_value?: string | number;
    new_value?: string | number;
    changed_by?: number;
    created_at: string;
    user?: User;
}

export interface Order {
    id: number;
    code?: string;
    user_id?: number;
    ho_ten: string;
    phone: string;
    booking_date: string;
    booking_time: string | number; // HH:MM string or hour number
    quantity: number;
    note?: string;
    total_price: number;
    status: number; 
    table_id?: number;
    created_by?: number;
    updated_by?: number;
    created_at?: string;
    updated_at?: string;

    // Relations
    user?: User;
    table?: Table;
    details?: OrderDetail[];
    history?: OrderHistory[];
}

export interface OrderItem {
    dish_id: number;
    quantity: number;
    note?: string;
}
