import { useEffect, useRef } from 'react';
import { useGlobalLoading } from '@/components/loading/loading-context';

export function useLoadingOnce(message: string, delay = 1500) {
    const { show, hide } = useGlobalLoading();

    const showRef = useRef(show);
    const hideRef = useRef(hide);
    const hasRunRef = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        showRef.current = show;
        hideRef.current = hide;
    }, [show, hide]);

    useEffect(() => {
        if (hasRunRef.current) return;

        hasRunRef.current = true;

        showRef.current(message);
        timeoutRef.current = setTimeout(() => {
            hideRef.current();
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            hideRef.current(); // fallback if unmount
        };
    }, [message, delay]);
}