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
        const raw = localStorage.getItem('user_info');
        if (raw) setUser(JSON.parse(raw));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
