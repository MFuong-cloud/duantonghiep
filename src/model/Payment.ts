export interface Payment {
    id: number;
    user_id: number;
    order_id: number;
    amount: number;
    method: 'momo' | 'cash';
    status: string;
    transaction_code?: string;
    paid_at?: string;
    created_at: string;
    updated_at: string;
    user?: {
        id: number;
        name: string;
        email: string;
    };
    order?: {
        id: number;
        code?: string;
        ho_ten: string;
        phone: string;
        total_price: number;
        status: number;
        booking_date?: string;
        booking_time?: string;
        quantity?: number;
        note?: string;
        table?: {
            id: number;
            name: string;
        };
        details?: Array<{
            id: number;
            dish_id: number;
            quantity: number;
            price: number;
            dish?: {
                id: number;
                name: string;
            };
        }>;
    };
}
