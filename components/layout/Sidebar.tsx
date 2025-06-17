import { PATH } from "@/lib/constants/paths";
import {
    Home,
    Clock,
    Video,
    ListVideo,
    ThumbsUp,
    Youtube,
    X
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import SidebarSearch from "./SidebarSearch";

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
            className={`fixed top-0 left-0 z-40 h-full w-64 bg-background text-foreground  p-4 space-y-4 overflow-y-auto transform transition-transform duration-300 ease-in-out
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
                <SidebarSearch onClose={onClose} />
            </div>


            <div className="space-y-1">
                <Link href={PATH.HOME} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Home size={18} /> Trang chủ
                </Link>
                {/* <Link href={PATH.HOME} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <ListVideo size={18} /> Kênh đăng ký
                </Link> */}
            </div>

            <hr className="border-border dark:border-primary-foreground my-3" />

            <div className="text-sm text-muted-foreground px-3">Bạn</div>
            <div className="space-y-1">
                <Link href={PATH.ME.VIDEO_MANAGE} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Video size={18} /> Video của bạn
                </Link>
                <Link href={PATH.ME.VIDEO_WATCHED} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <Clock size={18} /> Video đã xem
                </Link>
                <Link href={PATH.ME.VIDEO_PLAYLIST} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <ListVideo size={18} /> Danh sách phát
                </Link>
                <Link href={PATH.ME.VIDEO_LIKED} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
                    <ThumbsUp size={18} /> Video đã thích
                </Link>
            </div>
        </aside>
    );
}
