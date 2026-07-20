"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import api, { setAccessToken } from "@/lib/api";
import { toast } from "sonner";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login", "/forgot-password", "/reset-password"];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Check if the current route is public
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    useEffect(() => {
        const initializeAuth = async () => {
            const storedRefreshToken = localStorage.getItem("refreshToken");
            const storedUser = localStorage.getItem("user");

            if (!storedRefreshToken || !storedUser) {
                setLoading(false);
                if (!isPublicRoute) {
                    router.push("/login");
                }
                return;
            }

            try {
                // Parse user first
                setUser(JSON.parse(storedUser));

                // Get new access token using refresh token
                const response = await api.post("/auth/refresh", {
                    refreshToken: storedRefreshToken,
                });

                setAccessToken(response.data.accessToken);

                // Fetch fresh profile
                const profileRes = await api.get("/auth/me");
                setUser(profileRes.data.data);
                localStorage.setItem("user", JSON.stringify(profileRes.data.data));
            } catch (error) {
                console.error("Auth initialization failed:", error);
                // Clear state on invalid token
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                setUser(null);
                setAccessToken("");
                if (!isPublicRoute) {
                    router.push("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, [pathname, isPublicRoute, router]);

    // Handle Login
    const login = async (email: string, password: string) => {
        try {
            setLoading(true);
            const response = await api.post("/auth/login", { email, password });
            const { user: loggedInUser, accessToken, refreshToken } = response.data;

            // Set state
            setUser(loggedInUser);
            setAccessToken(accessToken);

            // Store persistently
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(loggedInUser));

            toast.success("Successfully logged in");
            router.push("/");
        } catch (error: any) {
            console.error("Login failed:", error);
            const msg = error.response?.data?.message || "Login failed, please check your credentials";
            toast.error(msg);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Handle Logout
    const logout = () => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        setUser(null);
        setAccessToken("");
        toast.info("Logged out successfully");
        router.push("/login");
    };

    // Route Protection
    if (loading && !isPublicRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 rounded-full border-4 border-zinc-200 border-t-[#EF4444] animate-spin" />
                    <span className="text-sm font-semibold text-zinc-500 uppercase tracking-widest animate-pulse">Initializing Admin...</span>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
