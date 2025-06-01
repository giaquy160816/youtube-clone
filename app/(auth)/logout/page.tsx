// app/logout/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        // ✅ Xóa token/localStorage ở đây
        localStorage.removeItem('access_token');
        localStorage.removeItem('user'); // nếu có lưu

        // ✅ Chuyển hướng về trang chủ
        router.replace('/');
    }, [router]);

    return <p>Đang đăng xuất...</p>;
}