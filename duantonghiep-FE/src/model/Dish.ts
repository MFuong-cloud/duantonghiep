import { Category } from "./Category";

export interface Dish {
    id: number;
    category_id: number;
    category?: Category;   // ✔ để lấy luôn category object nếu API trả về
    name: string;
    description?: string;
    price?: number;
    image?: string;
    image_url?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}
