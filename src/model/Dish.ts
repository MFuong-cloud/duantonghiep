import { Category } from "./Category";

export interface Dish {
    id: number;
    category_id: number;
    category?: Category;
    name: string;
    description?: string;
    price?: number;
    image?: string;
    images?: string[];
    image_url?: string;
    image_urls?: string[];
    status?: boolean;
    created_at?: string;
    updated_at?: string;
}
