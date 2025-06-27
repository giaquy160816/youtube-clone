'use client';

import { useRouter } from 'next/navigation';
import { PATH } from '@/lib/constants/paths';

export function useAuthRedirect() {
    const router = useRouter();

    const redirectToLogin = (message: string, returnUrl?: string) => {
        // Lưu thông báo vào sessionStorage để hiển thị sau khi đăng nhập
        sessionStorage.setItem('auth_message', message);
        
        // Lưu URL hiện tại để redirect về sau khi đăng nhập
        if (returnUrl) {
            sessionStorage.setItem('return_url', returnUrl);
        } else {
            sessionStorage.setItem('return_url', window.location.href);
        }
        
        // Redirect về trang login
        router.push(PATH.LOGIN);
    };

    const getStoredMessage = () => {
        const message = sessionStorage.getItem('auth_message');
        if (message) {
            sessionStorage.removeItem('auth_message');
            return message;
        }
        return null;
    };

    const getReturnUrl = () => {
        const returnUrl = sessionStorage.getItem('return_url');
        if (returnUrl) {
            sessionStorage.removeItem('return_url');
            return returnUrl;
        }
        return null;
    };

    return {
        redirectToLogin,
        getStoredMessage,
        getReturnUrl
    };
} 