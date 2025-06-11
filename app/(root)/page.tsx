'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import VideoList from '@/components/video/list-video';
import type { VideoResponse } from '@/types/video'; 
import type { VideoListParams, ApiResponse } from '@/types/api';
import { notify } from '@/lib/utils/noti';
const DEFAULT_SEARCH_PAGE_LIMIT = parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT || '9');
const defaultParams: VideoListParams = {
    page: 1,
    limit: DEFAULT_SEARCH_PAGE_LIMIT,
    q: '',
} as const;

export default function HomePage() {
    const [videos, setVideos] = useState<VideoResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const url = `${API_ENDPOINTS.video.list}?q=${defaultParams.q}&page=${defaultParams.page}&limit=${defaultParams.limit}`;
                const res = await apiGet<ApiResponse<VideoResponse[]>>(url);
                if ('error' in res) {
                    notify.error(res.error);
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

                setVideos(formattedVideos);
            } catch (err) {
                console.error('❌ Error fetching videos:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">Video mới nhất</h1>
            {loading ? (
                <div>Đang tải danh sách video...</div>
            ) : (
                <VideoList videos={videos} />
            )}
        </div>
    );
}