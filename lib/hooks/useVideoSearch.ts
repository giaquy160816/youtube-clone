import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import type { VideoResponse } from '@/types/video';
import type { VideoListParams, ApiResponse } from '@/types/api';
import { notify } from '@/lib/utils/noti';
import { PATH } from '@/lib/constants/paths';

const DEFAULT_SEARCH_PAGE_LIMIT = parseInt(process.env.NEXT_PUBLIC_PAGE_LIMIT || '9');

interface UseVideoSearchProps {
    onSearch?: (videos: VideoResponse[], page: number, total: number) => void; // ✅ sửa
    defaultParams?: Partial<VideoListParams>;
    onAfterSearch?: () => void;
}

export const useVideoSearch = ({
    onSearch,
    defaultParams = {},
    onAfterSearch
}: UseVideoSearchProps = {}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const searchVideos = useCallback(async (query: string, page = 1) => {
        if (!query.trim()) return;

        setLoading(true);
        try {
            const params: VideoListParams = {
                page,
                limit: DEFAULT_SEARCH_PAGE_LIMIT,
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

            const totalItems = res.total || 0;
            setTotal(totalItems);

            // ✅ truyền thêm `total` vào onSearch
            onSearch?.(formattedVideos, page, totalItems);

            if (page === 1) {
                router.push(`${PATH.VIDEO_SEARCH}?q=${encodeURIComponent(query)}`);
            }

            onAfterSearch?.();
        } catch (err) {
            console.error('❌ Error searching videos:', err);
        } finally {
            setLoading(false);
        }
    }, [router, onSearch, onAfterSearch, defaultParams]);

    return {
        searchVideos,
        loading,
        total,
        limit: DEFAULT_SEARCH_PAGE_LIMIT
    };
};