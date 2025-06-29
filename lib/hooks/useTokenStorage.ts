'use client';

import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { UserInfo } from '@/types/auth';
import { useUser } from '@/lib/context/UserContext';

export function useTokenStorage() {
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

        // Store in localStorage
        localStorage.setItem('user_info', JSON.stringify(user));
        localStorage.setItem('user_expired', expiredAt.toString());

        // Store in cookies
        Cookies.set('access_token', accessToken, { expires: expiredAt / 86400 }); // Convert seconds to days
        Cookies.set('user_info', JSON.stringify(user), { expires: expiredAt / 86400 });

        // Update UserContext
        setUser(user);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('cookieChange'));

        console.log('✅ Token refreshed successfully');
    };
} 