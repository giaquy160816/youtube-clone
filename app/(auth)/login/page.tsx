"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { API_ENDPOINTS } from "@/lib/api/end-points";
import { apiPost } from '@/lib/api/fetcher';
import { supabase } from '@/lib/auth/supabase-client';
import type { AuthResponse } from '@/types/auth';

import { useIsAuthenticated } from '@/lib/hooks/useIsAuthenticated';
import { useLoginHandler } from '@/lib/hooks/useLoginHandler';
import { toast } from "sonner";
import { notify } from "@/lib/utils/noti";

export default function LoginPage() {
    const handleLogin = useLoginHandler();
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiPost<AuthResponse, { email: string; password: string }>(
                API_ENDPOINTS.auth.login,
                { email, password }
            );
            if ('error' in response) {
                notify.error(response.error);
                return;
            }
            handleLogin(response as AuthResponse);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
            <Card className="w-full max-w-md rounded-2xl shadow-xl border border-border bg-card text-card-foreground">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-bold text-accent">
                        Đăng nhập
                    </CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="off"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Mật khẩu"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-10 rounded-md font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            disabled={loading}
                        >
                            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-card px-3 text-muted-foreground">HOẶC</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2"
                            onClick={async () => {
                                const { error } = await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        redirectTo: `${location.origin}/auth/callback`,
                                    },
                                });
                                if (error) {
                                    console.error("OAuth login error:", error.message);
                                }
                            }}
                        >
                            <FcGoogle size={20} />
                            Đăng nhập với Google
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}