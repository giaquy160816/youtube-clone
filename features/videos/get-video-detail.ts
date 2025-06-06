import { InMemoryCache } from '@/lib/utils/cache';
import { apiGet } from '@/lib/api/fetcher';
import type { VideoDetail } from '@/types/video';
import { API_ENDPOINTS } from '@/lib/api/end-points';

const videoCache = new InMemoryCache<VideoDetail>(60 * 1000); // TTL 1 phút

export async function getVideoDetail(id: string): Promise<VideoDetail> {
    const cached = videoCache.get(id);
    if (cached) return cached;

    const res = await apiGet<{ data: VideoDetail }>(
        API_ENDPOINTS.video.detail(id)
    );

    videoCache.set(id, res.data);
    console.log('🧹 res.data', res.data);
    return res.data;
}