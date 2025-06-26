import { InMemoryCache } from '@/lib/utils/cache';
import { apiGet } from '@/lib/api/fetcher';
import type { VideoDetail } from '@/types/video';
import { API_ENDPOINTS } from '@/lib/api/end-points';

const videoCache = new InMemoryCache<VideoDetail>(60 * 1000); // TTL 1 phút

export async function getVideoDetail(id: string): Promise<VideoDetail | null> {
    const videoId = parseInt(id);
    if (isNaN(videoId)) {
        return null;
    }
    const cached = videoCache.get(id);
    if (cached) return cached;

    const res = await apiGet<{ data: VideoDetail }>(
        API_ENDPOINTS.video.detail(id)
    );

    if ('error' in res) {
        return null;
    }

    videoCache.set(id, res.data);
    return res.data;
}