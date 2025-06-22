'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { apiGet } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import VideoList from '@/components/video/list-video';
import type { VideoResponse } from '@/types/video';
import type { ApiResponse } from '@/types/api';
import { notify } from '@/lib/utils/noti';
const DEFAULT_SEARCH_PAGE_LIMIT = parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT || '9');

export default function HomePage() {
    const [videos, setVideos] = useState<VideoResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef<IntersectionObserver | null>(null);

    const lastVideoElementRef = useCallback(
        (node: HTMLDivElement) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage(prevPage => prevPage + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        if (!hasMore) return;
        if (page > 1) setLoading(true);

        const fetchVideos = async () => {
            try {
                const url = `${API_ENDPOINTS.video.list}?q=&page=${page}&limit=${DEFAULT_SEARCH_PAGE_LIMIT}`;
                const res = await apiGet<ApiResponse<VideoResponse[]>>(url);
                if ('error' in res) {
                    notify.error(res.error);
                    setHasMore(false);
                    return;
                }
                const formattedVideos: VideoResponse[] = res.data.map((video: VideoResponse) => ({
                    id: video.id,
                    title: video.title,
                    image: video.image,
                    author: video.author,
                    views: video.views,
                    createdAt: video.createdAt,
                    avatar: video.avatar,
                }));

                setVideos(prev => [...prev, ...formattedVideos]);
                if (formattedVideos.length < DEFAULT_SEARCH_PAGE_LIMIT) {
                    setHasMore(false);
                }
            } catch (err) {
                console.error('❌ Error fetching videos:', err);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [page, hasMore]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">Video mới nhất</h1>
            {/* Initial loading state */}
            {loading && videos.length === 0 && <div>Đang tải danh sách video...</div>}

            <VideoList videos={videos} />

            {/* Sentinel element to trigger loading more */}
            <div ref={lastVideoElementRef} />

            {/* Loading indicator for subsequent pages */}
            {loading && videos.length > 0 && <div className="text-center py-4">Đang tải thêm video...</div>}

            {/* Message when all videos have been loaded */}
            {!loading && !hasMore && videos.length > 0 && (
                <div className="text-center py-4 text-gray-500">Đã xem hết video.</div>
            )}

            {/* Message if no videos are found at all */}
            {!loading && !hasMore && videos.length === 0 && (
                <div className="text-center py-4">Không có video nào để hiển thị.</div>
            )}
        </div>
    );
}