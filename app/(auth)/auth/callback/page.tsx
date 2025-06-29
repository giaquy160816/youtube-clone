'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/auth/supabase-client';
import { loginWithGoogleToken } from '@/lib/auth/login-google';
import { useLoginHandler } from '@/lib/hooks/useLoginHandler';
import { useAuthRedirect } from '@/lib/hooks/useAuthRedirect';
import { AuthResponse } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function AuthCallback() {
    const handleLogin = useLoginHandler();
    const { getStoredMessage } = useAuthRedirect();
    const router = useRouter();
    
    useEffect(() => {
        const handleOAuthRedirect = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('OAuth callback error:', error.message);
                return;
            }

            const providerToken = data?.session?.provider_token;

            if (providerToken) {
                try {
                    const res = await loginWithGoogleToken(providerToken);
                    if (res) {
                        handleLogin(res as AuthResponse);
                        
                        // Hiển thị thông báo từ sessionStorage sau khi đăng nhập thành công
                        setTimeout(() => {
                            const storedMessage = getStoredMessage();
                            if (storedMessage) {
                                toast.warning(storedMessage);
                            }
                        }, 100);
                    }
                } catch (err) {
                    router.push('/');
                    console.error('❌ Gửi token tới NestJS thất bại:', err);
                }
            } else {
                console.warn('❗ Không tìm thấy provider_token trong session.');
            }
        };

        handleOAuthRedirect();
    }, [handleLogin, router, getStoredMessage]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl animate-pulse">Đang xác thực, vui lòng đợi...</p>
        </div>
    );
}