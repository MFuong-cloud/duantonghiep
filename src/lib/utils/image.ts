import { STORAGE_URL } from '@/constants';

export const getImageUrl = (imagePath?: string | null, placeholder?: string): string => {
    const defaultImage = placeholder || "/image/food/food.jpg";

    if (!imagePath || imagePath.trim() === '') {
        return defaultImage;
    }

    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    // Handle Laravel storage paths
    if (imagePath.startsWith("storage/")) {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        return `${baseUrl}/${imagePath}`;
    }

    return `${STORAGE_URL}/${imagePath}`;
};

/**
 * Get news placeholder image
 */
export const getNewsPlaceholder = (): string => {
    return "/images/news-placeholder.jpg";
};

interface ImageItem {
    image_url?: string;
    image?: string | string[];
}

export const getValidImageUrl = (item: ImageItem): string => {
    const defaultImage = "/image/food/food.jpg";

    if (item.image_url && typeof item.image_url === 'string' && item.image_url.trim() !== '') {
        return item.image_url;
    }

    if (item.image && typeof item.image === 'string' && item.image.trim() !== '') {
        let imagePath = item.image;

        try {
            if (imagePath.startsWith("[") && imagePath.endsWith("]")) {
                const parsed = JSON.parse(imagePath);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    imagePath = parsed[0];
                }
            }
        } catch {
            // Ignore parse errors
        }

        return getImageUrl(imagePath);
    }

    return defaultImage;
};

export const parseImageArray = (imageString?: string | string[]): string[] => {
    if (!imageString) return [];

    if (Array.isArray(imageString)) {
        return imageString;
    }

    try {
        if (imageString.startsWith("[") && imageString.endsWith("]")) {
            const parsed = JSON.parse(imageString);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch {
        // Ignore parse errors
    }

    return [imageString];
};

interface DishWithImages {
    image_urls?: string[];
    images?: string[];
    image?: string | string[];
    image_url?: string;
}

export const getDishImages = (dish: DishWithImages | null | undefined): string[] => {
    if (!dish) return ["/image/food/food.jpg"];

    if (dish.image_urls && Array.isArray(dish.image_urls) && dish.image_urls.length > 0) {
        return dish.image_urls;
    }

    if (dish.images && Array.isArray(dish.images) && dish.images.length > 0) {
        return dish.images.map(img => getImageUrl(img));
    }

    if (dish.image) {
        const parsed = parseImageArray(dish.image);
        return parsed.map(img => getImageUrl(img));
    }

    if (dish.image_url) {
        return [dish.image_url];
    }

    return ["/image/food/food.jpg"];
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)'
        };
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Kích thước ảnh không được vượt quá 2MB'
        };
    }

    return { valid: true };
};
