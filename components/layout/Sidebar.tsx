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
} from "lucide-react";
import Link from "next/link";

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-border p-4 space-y-4 bg-background text-foreground sticky top-0 h-screen overflow-y-auto">
            <div className="font-semibold text-lg flex items-center gap-2">
                <Youtube className="text-red-600" />
                <span>YouTube Premium</span>
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