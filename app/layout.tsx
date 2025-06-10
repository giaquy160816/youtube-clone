import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { LoadingProvider } from "@/components/loading/loading-context";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });
import type { Viewport } from 'next'

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    // Also supported but less commonly used
    // interactiveWidget: 'resizes-visual',
}
export const metadata: Metadata = {
    title: "YouTube Clone",
    description: "Next.js 15 + Tailwind + Shadcn",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
    return (
        <html lang="en">
            <body className={`${inter.className} relative isolate`} suppressHydrationWarning>
                <LoadingProvider>
                    {children}
                </LoadingProvider>
                <Toaster position="top-right" richColors closeButton />
            </body>
        </html>
    );
}