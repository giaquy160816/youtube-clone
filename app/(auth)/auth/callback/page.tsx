'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { loginWithGoogleToken } from '@/lib/login-google';
import { useLoginHandler } from '@/hooks/useLoginHandler';

export default function AuthCallback() {
    const handleLogin = useLoginHandler(); // ✅ sử dụng custom hook

    useEffect(() => {
        const handleOAuthRedirect = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('OAuth callback error:', error.message);
                return;
            }

            if (data?.session?.provider_token) {
                try {
                    const res = await loginWithGoogleToken(data.session.provider_token);
                    handleLogin(res); // ✅ gọi logic login thành công
                } catch (err) {
                    console.error('❌ Gửi token tới NestJS thất bại:', err);
                }
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