"use client";

import MainLayout from "@/components/layout/MainLayout";
import { UserProvider } from "@/context/UserContext";
import { useEffect, useState } from "react";

export default function RootMainLayout({ children }: { children: React.ReactNode }) {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const hour = new Date().getHours();
        // Nếu giờ từ 18h (6pm) đến 6h sáng
        const dark = hour >= 18 || hour < 6;
        setIsDark(dark);
    }, []);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
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