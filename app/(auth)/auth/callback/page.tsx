'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/auth/supabase-client';
import { loginWithGoogleToken } from '@/lib/auth/login-google';
import { useLoginHandler } from '@/lib/hooks/useLoginHandler';

export default function AuthCallback() {
    const handleLogin = useLoginHandler();

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
                    handleLogin(res);
                } catch (err) {
                    console.error('❌ Gửi token tới NestJS thất bại:', err);
                }
            } else {
                console.warn('❗ Không tìm thấy provider_token trong session.');
            }
        };

        handleOAuthRedirect();
    }, [handleLogin]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-xl animate-pulse">Đang xác thực, vui lòng đợi...</p>
        </div>
    );
}