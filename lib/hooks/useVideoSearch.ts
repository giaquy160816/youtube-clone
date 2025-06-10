import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import type { VideoResponse } from '@/types/video';
import type { VideoListParams, ApiResponse } from '@/types/api';
import { notify } from '@/lib/utils/noti';
import { PATH } from '@/lib/constants/paths';

interface UseVideoSearchProps {
    onSearch?: (videos: VideoResponse[]) => void;
    defaultParams?: Partial<VideoListParams>;
    onAfterSearch?: () => void;
}

export const useVideoSearch = ({ onSearch, defaultParams = {}, onAfterSearch }: UseVideoSearchProps = {}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const searchVideos = async (query: string) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const params: VideoListParams = {
                page: 1,
                limit: 9,
                q: query,
                ...defaultParams
            };

            const url = `${API_ENDPOINTS.video.list}?q=${params.q}&page=${params.page}&limit=${params.limit}`;
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

            onSearch?.(formattedVideos);
            router.push(`${PATH.VIDEO_SEARCH}?q=${encodeURIComponent(query)}`);
            onAfterSearch?.();
        } catch (err) {
            console.error('❌ Error searching videos:', err);
            notify.error('Không thể tìm kiếm video');
        } finally {
            setLoading(false);
        }
    };

    return {
        searchVideos,
        loading
    };
}; 