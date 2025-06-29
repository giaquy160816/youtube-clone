'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { PATH } from '@/lib/constants/paths';
import { apiPost } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { useUser } from '@/lib/context/UserContext';

export default function LogoutPage() {
    const router = useRouter();
    const { setUser } = useUser();

    useEffect(() => {
        const doLogout = async () => {
            try {
                await apiPost(API_ENDPOINTS.auth.logout, {}); // Gọi backend xóa cookie HttpOnly
            } catch (err) {
                console.warn('Logout API failed:', err);
            }

            localStorage.removeItem('user_info');
            localStorage.removeItem('user_expired');

            Cookies.remove('access_token'); // chỉ xóa cookie frontend
            Cookies.remove('user_info');

            // Update UserContext
            setUser(null);

            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('cookieChange'));

            router.replace(PATH.LOGIN);
        };

        doLogout();
    }, [router, setUser]);

    return <p>Đang đăng xuất...</p>;
}