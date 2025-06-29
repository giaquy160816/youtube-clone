'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { UserInfo } from '@/types/auth';

type UserContextType = {
    user: UserInfo | null;
    setUser: (user: UserInfo | null) => void;
};

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const loadUserFromStorage = () => {
            const raw = localStorage.getItem('user_info');
            if (raw) {
                try {
                    setUser(JSON.parse(raw));
                } catch (error) {
                    console.error('Error parsing user info:', error);
                }
            }
        };

        // Load user info on mount
        loadUserFromStorage();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
