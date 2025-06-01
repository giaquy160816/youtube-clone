// hooks/useLoginHandler.ts
'use client';
import { useRouter } from 'next/navigation';

export function useLoginHandler() {
    const router = useRouter();

    return (data: any) => {
        if (!data?.token?.accessToken || !data?.token?.refreshToken) {
            console.warn('❌ Token không hợp lệ:', data);
            return;
        }

        localStorage.setItem('access_token', data.token.accessToken);
        localStorage.setItem('refresh_token', data.token.refreshToken);
        document.cookie = `access_token=${data.token.accessToken}; path=/`;

        if (data.data?.email) {
            localStorage.setItem('user_info', JSON.stringify(data?.data));
        }

        router.push('/dashboard');
    };
}