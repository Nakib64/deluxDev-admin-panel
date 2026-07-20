"use client";

import { useState } from "react";
import { useAuth } from "@/app/components/AuthProvider";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { KeyRound, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) return;

        try {
            setLoading(true);
            await login(email, password);
        } catch (error) {
            // Toast notifications are already triggered inside AuthProvider login
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 border p-8 rounded-2xl shadow-xl dark:border-zinc-800">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                        Admin Login
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Sign in to access your saasfactry administration panel
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase text-zinc-400 block">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                                    <Mail className="h-4 w-4" />
                                </span>
                                <Input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@saasfactry.com"
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold uppercase text-zinc-400 block">Password</label>
                                <Link 
                                    href="/forgot-password" 
                                    className="text-xs text-red-500 hover:text-red-600 font-bold transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                                    <KeyRound className="h-4 w-4" />
                                </span>
                                <Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pl-10"
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full h-12 text-sm font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex justify-center items-center"
                            disabled={loading || !email || !password}
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
