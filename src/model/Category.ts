export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    status?: boolean; // Backend casts to boolean
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
}
