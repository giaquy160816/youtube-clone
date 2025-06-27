"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { supabase } from '@/lib/auth/supabase-client';

import { useIsAuthenticated } from '@/lib/hooks/useIsAuthenticated';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
    const isAuthenticated = useIsAuthenticated();
    const { getStoredMessage, getReturnUrl } = useAuthRedirect();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            // Kiểm tra xem có return URL không
            const returnUrl = getReturnUrl();
            if (returnUrl) {
                router.replace(returnUrl);
            } else {
                router.replace('/');
            }
        }
    }, [isAuthenticated, router, getReturnUrl]);

    useEffect(() => {
        // Hiển thị thông báo từ sessionStorage nếu có
        const storedMessage = getStoredMessage();
        if (storedMessage) {
            toast.warning(storedMessage);
        }
    }, [getStoredMessage]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
            <Card className="w-full max-w-md rounded-2xl shadow-xl border border-border bg-card text-card-foreground">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-bold text-accent">
                        Đăng nhập
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
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
                    <Link href={process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}>
                        <Button variant="outline" className="w-full gap-2 bg-[#000] text-white">
                            Trang Chủ
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}