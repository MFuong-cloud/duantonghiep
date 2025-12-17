import api from "./api";

export interface News {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image: string | null;
  category: string;
  status: "draft" | "published";
  author_id: number | null;
  views: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: number;
    name: string;
  };
}

export interface NewsListResponse {
  success: boolean;
  data: {
    data: News[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface NewsResponse {
  success: boolean;
  data: News;
  message?: string;
}

export interface NewsParams {
  page?: number;
  per_page?: number;
  status?: string;
  category?: string;
  search?: string;
}

export interface CreateNewsData {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category?: string;
  status?: "draft" | "published";
  image?: File;
}

const newsService = {
  // Lấy danh sách tin tức (admin)
  getAll: async (params?: NewsParams): Promise<NewsListResponse> => {
    const response = await api.get("/news", { params });
    return response.data;
  },

  // Lấy tin tức đã xuất bản (frontend)
  getPublished: async (params?: NewsParams): Promise<NewsListResponse> => {
    const response = await api.get("/news/published", { params });
    return response.data;
  },

  // Lấy chi tiết tin tức theo ID
  getById: async (id: number): Promise<NewsResponse> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Lấy tin tức theo slug
  getBySlug: async (slug: string): Promise<NewsResponse> => {
    const response = await api.get(`/news/slug/${slug}`);
    return response.data;
  },

  // Tạo tin tức mới
  create: async (data: CreateNewsData): Promise<NewsResponse> => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("content", data.content);

    // Chỉ append nếu có giá trị thực sự
    if (data.slug && data.slug.trim()) {
      formData.append("slug", data.slug.trim());
    }
    if (data.excerpt && data.excerpt.trim()) {
      formData.append("excerpt", data.excerpt.trim());
    }
    if (data.category) {
      formData.append("category", data.category);
    }
    if (data.status) {
      formData.append("status", data.status);
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post("/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Cập nhật tin tức
  update: async (id: number, data: Partial<CreateNewsData>): Promise<NewsResponse> => {
    const formData = new FormData();

    // Thêm _method để Laravel hiểu là PUT request
    formData.append("_method", "PUT");

    if (data.title) {
      formData.append("title", data.title);
    }
    if (data.content) {
      formData.append("content", data.content);
    }
    if (data.slug && data.slug.trim()) {
      formData.append("slug", data.slug.trim());
    }
    if (data.excerpt !== undefined) {
      formData.append("excerpt", data.excerpt || "");
    }
    if (data.category) {
      formData.append("category", data.category);
    }
    if (data.status) {
      formData.append("status", data.status);
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await api.post(`/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Xóa tin tức
  delete: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },
};

export default newsService;
