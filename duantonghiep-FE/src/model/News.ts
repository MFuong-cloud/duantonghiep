export interface News {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    content: string;
    views: number;
    is_active: boolean;
    category_id?: number;
    category?: {
        id: number;
        name: string;
    };
    comments?: Comment[];
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface Comment {
    id: number;
    news_id: number;
    user_id: number;
    parent_id: number | null;
    content: string;
    is_active: boolean;
    user?: {
        id: number;
        name: string;
        avatar?: string;
    };
    replies?: Comment[];
    created_at: string;
    updated_at: string;
}

export interface NewsPagination {
    data: News[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}
