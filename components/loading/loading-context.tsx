// components/loading/loading-context.tsx
'use client';

import { createContext, useContext, useState } from 'react';
import GlobalLoading from '@/components/loading/global-loading';

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

    const show = (msg?: string) => {
        setMessage(msg);
        setVisible(true);
    };

    const hide = () => setVisible(false);

    return (
        <LoadingContext.Provider value={{ show, hide }}>
            {visible && <GlobalLoading message={message} />}
            {children}
        </LoadingContext.Provider>
    );
}

export const useGlobalLoading = () => useContext(LoadingContext);