export interface Branch {
    id: number;
    name: string;
    address: string;
    phone?: string | null;
    created_at: string;
    updated_at: string;
    category: string;
    price: number;
    image: string;
}
