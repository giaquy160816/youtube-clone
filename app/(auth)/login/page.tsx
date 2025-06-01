'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { loginEndpoint } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import { supabase } from '@/lib/supabase-client';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';

export default function LoginPage() {
    const isAuthenticated = useIsAuthenticated();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | string[]>('');

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]); // ✅ FIXED

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(loginEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Lỗi đăng nhập'
                );
            }

            // ✅ Lưu token sau khi login thành công
            localStorage.setItem('access_token', data.token.accessToken);
            localStorage.setItem('refresh_token', data.token.refreshToken);
            document.cookie = `access_token=${data.token.accessToken}; path=/`;

            router.push('/dashboard');
        } catch (err: unknown) { // ✅ FIXED
            if (err instanceof Error) {
                try {
                    const parsed = JSON.parse(err.message);
                    setError(Array.isArray(parsed) ? parsed : [parsed]);
                } catch {
                    setError(err.message);
                }
            } else {
                setError('Có lỗi không xác định xảy ra.');
            }
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

                <form onSubmit={handleLogin}>
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

                        {Array.isArray(error) ? (
                            <ul className="text-red-600 text-sm space-y-1">
                                {error.map((msg, i) => (
                                    <li key={i}>• {msg}</li>
                                ))}
                            </ul>
                        ) : error ? (
                            <p className="text-red-600 text-sm">{error}</p>
                        ) : null}

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