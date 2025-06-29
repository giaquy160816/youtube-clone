'use client';

import { useEffect, useState } from 'react';

export function useIsAuthenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('access_token='))
                ?.split('=')[1];

            setIsAuthenticated(!!token);
        };

        // Check auth on mount
        checkAuth();

        // Listen for cookie changes (when token is refreshed)
        const handleCookieChange = () => {
            checkAuth();
        };

        // Use a custom event to listen for cookie changes
        window.addEventListener('cookieChange', handleCookieChange);

        return () => {
            window.removeEventListener('cookieChange', handleCookieChange);
        };
    }, []);

    return isAuthenticated;
}