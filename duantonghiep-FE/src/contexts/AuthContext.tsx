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


                    }));
                }
            } else if (res.status === 401) {
                // Token invalid
                console.warn("Token invalid or expired. Clearing session.");
               
        } catch (error) {
            console.error("Failed to verify role from server:", error);
        }
    }, []);

    useEffect(() => {
        checkAuth();
        verifyRoleFromServer();

        const handleAuthChange = () => {
            checkAuth();
            moveEventListener("auth-change", handleAuthChange);
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
