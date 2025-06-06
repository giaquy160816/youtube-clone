'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { PATH } from '@/lib/constants/paths';
import { UserInfo } from '@/types/auth';

export function useLoginHandler() {
    const router = useRouter();

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

        router.push(PATH.HOME);
    };
}