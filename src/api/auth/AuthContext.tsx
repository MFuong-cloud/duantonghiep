"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { canonicalizeRole, roleHasAdminAccess, UserRole } from "@/lib/auth";

interface DecodedToken {
    role?: string;
    roles?: string[] | string;
    data?: {
        role?: string;
    };
    user?: {
        role?: string;
    };
    [key: string]: unknown;
}

interface AuthContextType {
    isLogin: boolean;
    isAdmin: boolean;
    role: UserRole | null;
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
        isLoading: boolean;
    }>({
        isLogin: false,
        isAdmin: false,
        role: null,
        isLoading: true,
    });

    const extractRoleFromToken = (token: string): UserRole | null => {
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

    const checkAuth = useCallback(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
        let role: UserRole | null = null;

        if (token) {
            role = extractRoleFromToken(token);
        }

        if (!role) {
            const cachedRole = typeof window !== "undefined" ? localStorage.getItem("authRole") : null;
            role = canonicalizeRole(cachedRole);
        }

        const isAdmin = roleHasAdminAccess(role);

        setState({
            isLogin: !!token,
            isAdmin,
            role,
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
