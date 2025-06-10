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

    const { searchVideos, loading } = useVideoSearch({
        onSearch: (results) => setVideos(results),
    });

    useEffect(() => {
        if (query) {
            searchVideos(query);
        }
    }, [query]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">
                {query ? `Kết quả tìm kiếm cho "${query}"` : 'Tìm kiếm video'}
            </h1>
            {loading ? (
                <div>Đang tìm kiếm...</div>
            ) : videos.length > 0 ? (
                <VideoList videos={videos} />
            ) : query ? (
                <div>Không tìm thấy kết quả nào cho "{query}"</div>
            ) : null}
        </div>
    );
} 