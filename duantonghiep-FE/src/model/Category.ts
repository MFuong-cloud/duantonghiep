export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    status?: boolean;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
