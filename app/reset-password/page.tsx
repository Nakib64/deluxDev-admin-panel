"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const resetToken = searchParams.get("token");
        if (resetToken) {
            setToken(resetToken);
        } else {
            toast.error("Invalid token link. Please request a new link.");
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            toast.error("Token is missing");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await api.post("/auth/reset-password", { token, password });
            setSuccess(true);
            toast.success("Password reset successfully!");
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to reset password";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 border p-8 rounded-2xl shadow-xl dark:border-zinc-800">
            {success ? (
                <div className="text-center space-y-4 py-4">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 uppercase">Password Reset!</h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Your password has been successfully reset. Redirecting you to the login screen...
                    </p>
                    <div className="pt-2">
                        <Link href="/login" className="text-sm font-bold text-red-500 hover:underline uppercase">
                            Go to login manually
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                            Reset Password
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Enter your new password below to reset your account credentials
                        </p>
                    </div>
                    
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-zinc-400 block">New Password</label>
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
                                        disabled={loading || !token}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-zinc-400 block">Confirm Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400 pointer-events-none">
                                        <KeyRound className="h-4 w-4" />
                                    </span>
                                    <Input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="pl-10"
                                        disabled={loading || !token}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-sm font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex justify-center items-center"
                                disabled={loading || !token || !password || !confirmPassword}
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    "Save Password"
                                )}
                            </Button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <Suspense fallback={
                <div className="max-w-md w-full p-8 border rounded-2xl bg-white shadow-xl dark:bg-zinc-900 dark:border-zinc-800 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                    <span className="text-sm font-semibold text-zinc-500">Loading form...</span>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
