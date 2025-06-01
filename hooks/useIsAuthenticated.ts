'use client';

import { useEffect, useState } from 'react';

export function useIsAuthenticated() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);
    }, []);

    return isAuthenticated;
}