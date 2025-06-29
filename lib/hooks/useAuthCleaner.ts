'use client';

import { useEffect, useState } from 'react';
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

export function useAuthCleaner() {
    const storeToken = useTokenStorage();
    const [loggedIn, setLoggedIn] = useState(isUserLoggedInAuth());

    useEffect(() => {
        const onCookieChange = () => setLoggedIn(isUserLoggedInAuth());
        window.addEventListener('cookieChange', onCookieChange);
        return () => window.removeEventListener('cookieChange', onCookieChange);
    }, []);

    useEffect(() => {
        if (!loggedIn) return;
        let stopped = false;
        const interval = setInterval(checkAndClean, 30 * 1000);

        async function checkAndClean() {
            if (stopped) return;
            if (!isUserLoggedInAuth()) return;
            if (isTokenExpiringSoon()) {
                try {
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
                    if (isTokenExpired()) {
                        clearAuthData();
                        stopped = true;
                    }
                }
            }
        }

        checkAndClean();
        return () => {
            stopped = true;
            clearInterval(interval);
        };
    }, [loggedIn, storeToken]);
}