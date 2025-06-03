'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        document.cookie = 'access_token=; path=/; max-age=0';
        document.cookie = 'expires_in=; path=/; max-age=0';
        // ✅ Chuyển hướng
        router.replace('/');
    }, [router]);

    return <p>Đang đăng xuất...</p>;
}