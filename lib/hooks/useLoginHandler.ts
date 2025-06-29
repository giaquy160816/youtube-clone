'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { PATH } from '@/lib/constants/paths';
import { UserInfo } from '@/types/auth';
import { useUser } from '@/lib/context/UserContext';

export function useLoginHandler() {
    const router = useRouter();
    const { setUser } = useUser();

    return async (data: {
        accessToken: string;
        expiredAt?: number;
        user: UserInfo;
    }) => {
        const { accessToken, expiredAt = 3600, user } = data;

        if (!accessToken || !user?.email) {
            toast.warning('❌ Thiếu accessToken hoặc user');
            return;
        }

        // Lưu trực tiếp expiredAt (đã là mili giây)
        localStorage.setItem('user_info', JSON.stringify(user));
        localStorage.setItem('user_expired', expiredAt.toString());

        // Store in cookies
        Cookies.set('access_token', accessToken, { expires: expiredAt / 86400 / 1000 }); // Convert ms to days
        Cookies.set('user_info', JSON.stringify(user), { expires: expiredAt / 86400 / 1000 });

        // Update UserContext
        setUser(user);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('cookieChange'));

        // Kiểm tra xem có return URL không
        const returnUrl = sessionStorage.getItem('return_url');
        if (returnUrl) {
            sessionStorage.removeItem('return_url');
            router.push(returnUrl);
        } else {
            router.push(PATH.HOME);
        }
    };
}