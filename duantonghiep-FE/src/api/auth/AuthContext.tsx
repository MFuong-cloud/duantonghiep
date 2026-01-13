"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { canonicalizeRole, roleHasAdminAccess, UserRole } from "@/lib/auth";

interface DecodedToken {
    sub?: string | number;
    id?: string | number;
    user_id?: string | number;
    userId?: string | number;
    role?: string;
    roles?: string[] | string;
    data?: {
        role?: string;
        id?: string | number;
    };
    user?: {
        role?: string;
        id?: string | number;
    };
    [key: string]: unknown;
}

interface AuthContextType {
    isLogin: boolean;
    isAdmin: boolean;
    role: UserRole | null;
    userId: string | null;
    isLoading: boolean;
    resetState: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, setState] = useState<{
        isLogin: boolean;
        isAdmin: boolean;
        role: UserRole | null;
        userId: string | null;
        isLoading: boolean;
    }>({
        isLogin: false,
        isAdmin: false,
        role: null,
        userId: null,
        isLoading: true,
    });

    const extractRoleFromToken = (token: string): UserRole | null => {
        if (!token || typeof token !== "string" || token.split('.').length !== 3) {
            return null;
        }
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const roleFromToken =
                decoded?.role ||
                (Array.isArray(decoded?.roles) ? decoded?.roles[0] : decoded?.roles) ||
                decoded?.data?.role ||
                decoded?.user?.role ||
                null;
            return canonicalizeRole(roleFromToken);
        } catch (error) {
            console.warn("Không thể decode token:", error);
        }
        return null;
    };

    const extractUserIdFromToken = (token: string): string | null => {
        if (!token || typeof token !== "string" || token.split('.').length !== 3) {
            return null;
        }
        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const userId =
                decoded?.sub ||
                decoded?.id ||
                decoded?.user_id ||
                decoded?.userId ||
                decoded?.data?.id ||
                decoded?.user?.id ||
                null;
            return userId ? String(userId) : null;
        } catch (error) {
            console.warn("Không thể decode userId từ token:", error);
        }
        return null;
    };

    const checkAuth = useCallback(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        let role: UserRole | null = null;
        let userId: string | null = null;

        if (token) {
            role = extractRoleFromToken(token);
            userId = extractUserIdFromToken(token);
        }

        if (!role) {
            const cachedRole = typeof window !== "undefined" ? localStorage.getItem("authRole") : null;
            role = canonicalizeRole(cachedRole);
        }

        const isAdmin = roleHasAdminAccess(role);

        setState({
            isLogin: !!token && !!role,
            isAdmin,
            role,
            userId,
            isLoading: false,
        });
    }, []);

    const resetState = useCallback(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        checkAuth();

        const handleAuthChange = () => {
            checkAuth();
        };
        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [checkAuth]);

    return (
        <AuthContext.Provider value={{ ...state, resetState }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
