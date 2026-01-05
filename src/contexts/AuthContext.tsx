"use client"
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import { canonicalizeRole, roleHasAdminAccess, UserRole } from "@/lib/auth";
import envConfig from "@/config";

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
            isLogin: !!token && !!role,
            isAdmin,
            role,
            isLoading: false,
        });
    }, []);

    const resetState = useCallback(() => {
        checkAuth();
    }, [checkAuth]);

    const verifyRoleFromServer = useCallback(async () => {
        if (typeof window === "undefined") return;
        const token = localStorage.getItem("authToken");
        if (!token) return;

        try {
            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (res.ok) {
                const user = await res.json();
                const serverRole = canonicalizeRole(user.role);

                // Cập nhật localStorage nếu khác biệt
                const cachedRole = localStorage.getItem("authRole");

                // Nếu role từ server khác với cache, update cache và state
                if (serverRole && cachedRole !== serverRole) {
                    console.log(`Role mismatch. Cache: ${cachedRole}, Server: ${serverRole}. Update to server role.`);
                    localStorage.setItem("authRole", serverRole);
                    // Update state directly here to be sure
                    const isAdmin = roleHasAdminAccess(serverRole);
                    setState(prev => ({
                        ...prev,
                        isLogin: true,
                        isAdmin,
                        role: serverRole,
                    }));
                }
            } else if (res.status === 401) {
                // Token invalid
                console.warn("Token invalid or expired. Clearing session.");
                localStorage.removeItem("authToken");
                localStorage.removeItem("authRole");
                localStorage.removeItem("userInfo");
                setState({
                    isLogin: false,
                    isAdmin: false,
                    role: null,
                    isLoading: false,
                });
            }
        } catch (error) {
            console.error("Failed to verify role from server:", error);
        }
    }, []);

    useEffect(() => {
        checkAuth();
        verifyRoleFromServer();

        const handleAuthChange = () => {
            checkAuth();
            verifyRoleFromServer();
        };
        window.addEventListener("auth-change", handleAuthChange);

        return () => {
            window.removeEventListener("auth-change", handleAuthChange);
        };
    }, [checkAuth, verifyRoleFromServer]);

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
