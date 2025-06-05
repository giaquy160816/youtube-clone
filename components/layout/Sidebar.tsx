'use client';

import { PATH } from "@/lib/constants/paths";
import {
    Home,
    Clock,
    Video,
    ListVideo,
    Clock3,
    ThumbsUp,
    Download,
    UserSquare,
    Music2,
    Youtube,
    X
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { FaSearch } from "react-icons/fa";

export function Sidebar({
    isOpen = false,
    onClose = () => { }
}: {
    isOpen?: boolean;
    onClose?: () => void;
}) {
    // ESC để đóng sidebar
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-full w-64 bg-background text-foreground border-r border-border p-4 space-y-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:block`}
        >
            {/* Close button for mobile */}
            <div className="md:hidden flex justify-end">
                <button onClick={onClose}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="font-semibold text-lg flex items-center gap-2">
                <Link href={PATH.HOME} className="flex items-center gap-2">
                    <Youtube className="text-red-600" />
                    <span>YouTube</span>
                </Link>
            </div>

            {/* Mobile Search Form */}
            <div className="md:hidden px-1 pb-2">
                <form className="flex items-center border border-input rounded-full overflow-hidden">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="flex-1 px-3 py-1 text-sm outline-none bg-transparent"
                    />
                    <button type="submit" className="bg-red-600 text-white px-3 py-1">
                        <FaSearch className="text-sm" />
                    </button>
                </form>
            </div>


            <div className="space-y-1">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Home size={18} /> Trang chủ
                </Link>
                <Link href="/shorts" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <UserSquare size={18} /> Shorts
                </Link>
                <Link href="/subscriptions" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <ListVideo size={18} /> Kênh đăng ký
                </Link>
                <Link href="/music" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Music2 size={18} /> YouTube Music
                </Link>
            </div>

            <hr className="border-border my-3" />

            <div className="text-sm text-muted-foreground px-3">Bạn</div>
            <div className="space-y-1">
                <Link href="/watched" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Clock size={18} /> Video đã xem
                </Link>
                <Link href="/playlist" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <ListVideo size={18} /> Danh sách phát
                </Link>
                <Link href="/your-videos" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Video size={18} /> Video của bạn
                </Link>
                <Link href="/watch-later" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Clock3 size={18} /> Xem sau
                </Link>
                <Link href="/liked" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <ThumbsUp size={18} /> Video đã thích
                </Link>
                <Link href="/downloads" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Download size={18} /> Nội dung tải xuống
                </Link>
            </div>
        </aside>
    );
}
