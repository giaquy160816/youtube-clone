// components/ui/global-loading.tsx
'use client';

import { useEffect } from 'react';

export default function GlobalLoading({ message = 'Đang tải...' }: { message?: string }) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 text-white">
            <div className="flex flex-col items-center space-y-3 animate-pulse">
                <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8z"
                    />
                </svg>
                <p>{message}</p>
            </div>
        </div>
    );
}