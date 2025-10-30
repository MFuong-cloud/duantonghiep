"use client"
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }) {
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

export const useAuth = () => useContext(AuthContext);
