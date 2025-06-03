'use client';

import { useEffect, useState } from 'react';

export function useIsAuthenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = document.cookie
            .split('; ')
            .find(row => row.startsWith('access_token='))
            ?.split('=')[1];

        setIsAuthenticated(!!token);
    }, []);

    return isAuthenticated;
}