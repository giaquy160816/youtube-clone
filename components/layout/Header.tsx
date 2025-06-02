// components/layout/Header.tsx
"use client";
import UserMenu from "@/components/layout/UserMenu";
import { Youtube } from "lucide-react";
import { FaSearch } from 'react-icons/fa';


export function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
            <div className="font-semibold text-lg flex items-center gap-2">
                <Youtube className="text-red-600" />
                <span>YouTube Premium</span>
            </div>
            <form className="flex w-full max-w-xl mx-6">
                <div className="flex flex-1 border border-input bg-background rounded-full overflow-hidden dark:border-secondary">
                    <input
                        type="text"
                        placeholder="Tìm kiếm video..."
                        className="flex-1 px-4 py-2 bg-transparent text-sm outline-none "
                    />
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 flex items-center justify-center cursor-pointer"
                    >
                        <FaSearch className="text-white text-sm" />
                    </button>
                </div>
            </form>

            <UserMenu />
        </header>
    );
}