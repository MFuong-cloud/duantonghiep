export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    status?: number; // 1: active, 0: inactive
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
