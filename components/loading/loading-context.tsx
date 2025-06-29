// components/loading/loading-context.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import GlobalLoading from '@/components/loading/global-loading';
import { useRouter } from 'next/navigation';

const LoadingContext = createContext<{
    show: (msg?: string) => void;
    hide: () => void;
}>({
    show: () => { },
    hide: () => { },
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string | undefined>('Đang tải...');
    const router = useRouter();

    const show = (msg?: string) => {
        setMessage(msg);
        setVisible(true);
    };

    const hide = () => setVisible(false);

    useEffect(() => {
        const handleAuthExpired = () => {
            window.alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
            router.push('/login');
        };
        window.addEventListener('authExpired', handleAuthExpired);
        return () => window.removeEventListener('authExpired', handleAuthExpired);
    }, [router]);

    return (
        <LoadingContext.Provider value={{ show, hide }}>
            {visible && <GlobalLoading message={message} />}
            {children}
        </LoadingContext.Provider>
    );
}

export const useGlobalLoading = () => useContext(LoadingContext);