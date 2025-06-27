'use client';

import { useEffect, useState } from 'react';
import VideoList from '@/components/video/list-video';
import { useLikedVideos } from '@/lib/hooks/useLikedVideos';
import { Skeleton } from '@/components/ui/skeleton';
import type { VideoResponse } from '@/types/video';

export default function MeLikePage() {
    const [videos, setVideos] = useState<VideoResponse[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const { loading, total, fetchLikedVideos, limit } = useLikedVideos({
        onFetch: (results, currentPage, totalItems) => {
            if (currentPage === 1) {
                setVideos(results);
            } else {
                setVideos(prev => [...prev, ...results]);
            }

            const loadedCount = (currentPage - 1) * limit + results.length;
            setHasMore(loadedCount < totalItems);
        }
    });

    useEffect(() => {
        setVideos([]);
        setPage(1);
        setHasMore(false);
        fetchLikedVideos(1);
    }, [fetchLikedVideos]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchLikedVideos(nextPage);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">
                Video đã thích ({total})
            </h1>

            {loading && videos.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div key={index} className="bg-card">
                            <Skeleton className="w-full h-[200px] rounded-xl mb-2" />
                            <div className="flex items-start gap-3">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="flex-1">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-3 w-3/4 mb-1" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
            ) : (
                <div className="text-center py-8">
                    <div className="text-muted-foreground text-lg mb-2">
                        Bạn chưa thích video nào
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Các video bạn thích sẽ xuất hiện ở đây
                    </div>
                </div>
            )}
        </div>
    );
}