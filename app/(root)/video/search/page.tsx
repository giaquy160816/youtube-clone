'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import VideoList from '@/components/video/list-video';
import type { VideoResponse } from '@/types/video';
import { useVideoSearch } from '@/lib/hooks/useVideoSearch';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const [videos, setVideos] = useState<VideoResponse[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false); // mặc định false

    const { searchVideos, loading, limit } = useVideoSearch({
        onSearch: (results, currentPage, total) => {
            if (currentPage === 1) {
                setVideos(results);
            } else {
                setVideos(prev => [...prev, ...results]);
            }

            const loadedCount = (currentPage - 1) * limit + results.length;
            setHasMore(loadedCount < total);
        }
    });

    useEffect(() => {
        if (!query) return;
        setVideos([]);
        setPage(1);
        setHasMore(false); // reset trước khi query mới
        searchVideos(query, 1);
    }, [query]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        searchVideos(query, nextPage);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">
                {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm video'}
            </h1>

            {loading && videos.length === 0 ? (
                <div>Đang tìm kiếm...</div>
            ) : videos.length > 0 ? (
                <>
                    <VideoList videos={videos} />
                    {hasMore && (
                        <div className="mt-4 text-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-4 py-2 bg-primary/70 text-white rounded hover:bg-primary transition-colors w-[200px] cursor-pointer border-rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Đang tải...' : 'Tải thêm'}
                            </button>
                        </div>
                    )}
                </>
            ) : query ? (
                <div>Không tìm thấy kết quả nào cho &ldquo;{query}&rdquo;</div>
            ) : null}
        </div>
    );
}