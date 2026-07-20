"use client";

import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        try {
            setLoading(true);
            await api.post("/auth/forgot-password", { email });
            setSuccess(true);
            toast.success("Password reset email sent!");
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Failed to trigger recovery email";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
            <div className="max-w-md w-full space-y-8 bg-white dark:bg-zinc-900 border p-8 rounded-2xl shadow-xl dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <Link href="/login">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <span className="text-xs font-bold uppercase text-zinc-400">Back to login</span>
                </div>

                {success ? (
                    <div className="text-center space-y-4 py-4">
                        <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 uppercase">Check Your Email</h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            We have sent a password reset link to <strong className="text-zinc-800 dark:text-zinc-200">{email}</strong>. Please check your inbox and click the reset link.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
                                Forgot Password
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Enter your email address below and we will send you a password reset link
                            </p>
                        </div>
                        
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

                            <div>
                                <Button
                                    type="submit"
                                    className="w-full h-12 text-sm font-bold uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex justify-center items-center"
                                    disabled={loading || !email}
                                >
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
