'use client';

import VideoList from "@/components/video/list-video";
import { useState } from "react";
import { useLoadingOnce } from "@/hooks/useLoadingOnce";

const watchedVideos = [
    {
        id: 111,
        title: "Video bạn đã xem 1",
        thumbnail: "https://picsum.photos/seed/w1/400/225",
        author: "Tác giả A",
        views: 13000,
        createdAt: new Date().toISOString(),
    },
    {
        id: 222,
        title: "Video bạn đã xem 2",
        thumbnail: "https://picsum.photos/seed/w2/400/225",
        author: "Tác giả B",
        views: 8700,
        createdAt: new Date().toISOString(),
    },
    {
        id: 333,
        title: "Video bạn đã xem 3",
        thumbnail: "https://picsum.photos/seed/w3/400/225",
        author: "Tác giả C",
        views: 42000,
        createdAt: new Date().toISOString(),
    },
    {
        id: 444,
        title: "Video bạn đã xem 4",
        thumbnail: "https://picsum.photos/seed/w4/400/225",
        author: "Tác giả D",
        views: 21000,
        createdAt: new Date().toISOString(),
    },
    {
        id: 555,
        title: "Video bạn đã xem 5",
        thumbnail: "https://picsum.photos/seed/w5/400/225",
        author: "Tác giả E",
        views: 33000,
        createdAt: new Date().toISOString(),
    },
];

export default function WatchedPage() {
    const [visibleCount, setVisibleCount] = useState(3);
    const [loadingMore, setLoadingMore] = useState(false);
    useLoadingOnce('Đang tải danh sách video nef...', 1500);

    const handleLoadMore = () => {
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + 2);
            setLoadingMore(false);
        }, 1000);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Video đã xem</h1>
            <VideoList videos={watchedVideos.slice(0, visibleCount)} />
            {visibleCount < watchedVideos.length && (
                <div className="mt-6 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
                        disabled={loadingMore}
                    >
                        {loadingMore ? "Đang tải..." : "Tải thêm"}
                    </button>
                </div>
            )}
        </div>
    );
}