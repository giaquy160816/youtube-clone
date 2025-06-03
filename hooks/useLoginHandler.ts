'use client';

import { useRouter } from 'next/navigation';

export function useLoginHandler() {
    const router = useRouter();

    return (data: any) => {
        const accessToken = data?.accessToken;
        const expiresIn = data?.expiresIn || 3600;
        const user = data?.user || {};

        if (!accessToken) {
            console.warn('❌ Token không hợp lệ:', data);
            return;
        }

        document.cookie = `access_token=${accessToken}; path=/; max-age=${expiresIn}; secure; samesite=lax`;

        if (user?.email) {
            localStorage.setItem('user_info', JSON.stringify(user));
        }
        router.push('/dashboard');
    };
}