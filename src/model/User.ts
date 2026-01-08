export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "active" | "inactive";
    avatar?: string;
    avatar_url?: string;
    phone?: string;
    lastLogin?: string;
}
