'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
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
    }, [isAuthenticated]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
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

            // 👉 Điều hướng sau login
            router.push('/dashboard');

        } catch (err: any) {
            try {
                const parsed = JSON.parse(err.message);
                setError(Array.isArray(parsed) ? parsed : [parsed]);
            } catch (_) {
                setError(err.message);
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                placeholder="you@example.com"
                                type="email"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <Input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                placeholder="Mật khẩu"
                                type="password"
                                required
                            />
                        </div>

                        {Array.isArray(error) ? (
                            <ul className="text-red-600 text-sm space-y-1">
                                {error.map((msg, i) => (
                                    <li key={i}>• {msg}</li>
                                ))}
                            </ul>
                        ) : (
                            error && <p className="text-red-600 text-sm">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-10 rounded-md font-semibold bg-primary text-primary-foreground 
                         hover:bg-primary/90 focus-visible:outline-none 
                         focus-visible:ring-2 focus-visible:ring-ring 
                         focus-visible:ring-offset-2 focus-visible:ring-offset-background 
                         transition-colors shadow-sm cursor-pointer"
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
                            className="w-full gap-2 cursor-pointer"
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

                    {/* <CardFooter className="flex justify-center">
                        <Button variant="link" className="text-accent text-sm">
                            Quên mật khẩu?
                        </Button>
                    </CardFooter> */}
                </form>
            </Card>
        </div>
    );
}