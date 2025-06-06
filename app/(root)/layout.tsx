"use client";

import MainLayout from "@/components/layout/MainLayout";
import { UserProvider } from "@/lib/context/UserContext";
import { useEffect, useState } from "react";
import { useAuthCleaner } from "@/lib/hooks/useAuthCleaner";

export default function RootMainLayout({ children }: { children: React.ReactNode }) {
    useAuthCleaner();
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const hour = new Date().getHours();
        // Nếu giờ từ 18h (6pm) đến 6h sáng
        const dark = hour >= 18 || hour < 6;
        setIsDark(dark);
    }, []);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (const registration of registrations) {
                registration.unregister();
            }
        });
    }
    return (
        <UserProvider>
            <MainLayout isDark={isDark}>{children}</MainLayout>
        </UserProvider>
    );
}