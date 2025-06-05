import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { LoadingProvider } from "@/components/loading/loading-context";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "YouTube Clone",
    description: "Next.js 15 + Tailwind + Shadcn",
};

export default function RootLayout({ children, }: { children: React.ReactNode; }) {
    
    return (
        <html lang="en">
            <body className={`${inter.className} relative isolate`}>
                <LoadingProvider>
                    {children}
                </LoadingProvider>
                <Toaster position="top-right" richColors closeButton />
            </body>
        </html>
    );
}