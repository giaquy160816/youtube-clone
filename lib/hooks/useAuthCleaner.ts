'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { api } from '@/lib/api/fetcher';
import { useLoginHandler } from './useLoginHandler';
import type { AuthResponse } from '@/types/auth';

export function useAuthCleaner() {
    const handleLogin = useLoginHandler();

    useEffect(() => {
        let stopped = false;

        const checkAndClean = async () => {
            if (stopped) return;

            const expired = parseInt(localStorage.getItem('user_expired') || '0', 10);
            if (Date.now() > expired) {
                // Clear token info
                localStorage.removeItem('user_info');
                localStorage.removeItem('user_expired');

                Cookies.remove('access_token');
                Cookies.remove('user_info');

                try {
                    const response = await api<AuthResponse>(
                        API_ENDPOINTS.auth.refreshToken,
                        {
                            method: 'GET',
                            credentials: 'include',
                        }
                    );

                    if (response.accessToken) {
                        await handleLogin(response);
                        return;
                    }
                } catch (error) {
                    console.warn('⚠️ Refresh token failed:', error);
                }
                stopped = true;
            }
        };

        checkAndClean();
        const interval = setInterval(checkAndClean, 30 * 1000);
        return () => clearInterval(interval);
    }, [handleLogin]);
}