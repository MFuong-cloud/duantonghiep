"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
    isLogin: boolean;
    resetState: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isLogin, setIsLogin] = useState(false);

    const checkAuth = () => {
        const token = localStorage.getItem("authToken");
        setIsLogin(!!token);
    };

    const resetState = () => {
        checkAuth(); // hoặc xóa thêm các state khác nếu cần
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isLogin, resetState }}>
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
