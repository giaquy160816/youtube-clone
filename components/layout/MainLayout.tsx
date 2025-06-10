// components/layout/MainLayout.tsx
'use client';

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

export default function MainLayout({ children, isDark }: { children: React.ReactNode, isDark: boolean }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={`min-h-screen bg-background text-foreground flex ${isDark ? 'dark' : ''}`}>
            {/* Sidebar: hidden on mobile, slide in/out */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Overlay khi mở sidebar mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-primary/30 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />

            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col border-l border-border dark:border-primary-foreground">
                <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
