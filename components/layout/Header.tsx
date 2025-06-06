"use client";
import UserMenu from "@/components/layout/UserMenu";
import { FaSearch } from "react-icons/fa";
import { Menu } from "lucide-react";
import { PATH } from "@/lib/constants/paths";
import Link from "next/link";

export function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background">
            {/* Mobile: menu icon */}
            <button
                className="md:hidden text-gray-800"
                onClick={toggleSidebar}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 mx-auto md:mx-0 text-primary dark:text-white">
                <Link href={PATH.HOME}>
                    <span className="text-lg font-semibold">Youtube Clone</span>
                </Link>
            </div>

            {/* Search form: hidden on mobile */}
            <form className="hidden md:flex w-full max-w-xl mx-6">
                <div className="flex flex-1 border border-input bg-background rounded-full overflow-hidden">
                    <input
                        type="text"
                        placeholder="Tìm kiếm video..."
                        className="flex-1 px-4 py-2 bg-transparent text-sm outline-none"
                    />
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-4 flex items-center justify-center"
                    >
                        <FaSearch className="text-white text-sm" />
                    </button>
                </div>
            </form>

            {/* User avatar */}
            <div className="md:ml-0">
                <UserMenu />
            </div>
        </header>
    );
}
