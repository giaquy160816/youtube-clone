'use client';

import { useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { api } from '@/lib/api/fetcher';
import { useTokenStorage } from './useTokenStorage';
import type { AuthResponse } from '@/types/auth';
import { notify } from '../utils/noti';
import { 
    isTokenExpiringSoon, 
    isTokenExpired, 
    clearAuthData,
    isUserLoggedIn as isUserLoggedInAuth
} from '../utils/auth';

function isUserLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    const accessToken = document.cookie.includes('access_token=');
    const userInfo = localStorage.getItem('user_info');
    return !!accessToken && !!userInfo;
}

export function useAuthCleaner() {
    const storeToken = useTokenStorage();

    useEffect(() => {
        let stopped = false;
        let interval: NodeJS.Timeout | number | undefined;

        const checkAndClean = async () => {
            if (stopped) return;
            // Kiểm tra login trước khi gọi refresh
            if (!isUserLoggedIn()) return;
            // Kiểm tra xem token có sắp hết hạn trong 30 giây tới không
            if (isTokenExpiringSoon()) {
                try {
                    console.log('refresh token');
                    console.log('refresh token link', API_ENDPOINTS.auth.refreshToken);
                    const response = await api<AuthResponse>(
                        API_ENDPOINTS.auth.refreshToken,
                        {
                            method: 'GET',
                            credentials: 'include',
                        }
                    );

                    if ('accessToken' in response && 'user' in response) {
                        await storeToken(response as AuthResponse);
                        return;
                    }
                } catch (error) {
                    console.warn('⚠️ Refresh token failed:', error);
                    notify.error('Refresh token failed');
                    // Nếu refresh thất bại và token đã hết hạn, xóa token
                    if (isTokenExpired()) {
                        clearAuthData();
                        stopped = true;
                    }
                }
            }
        };

        if (isUserLoggedIn()) {
            checkAndClean();
            interval = setInterval(checkAndClean, 10 * 1000); // mỗi 30 giây
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [storeToken]);
}