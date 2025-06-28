import { InMemoryCache } from '@/lib/utils/cache';
import { apiGet } from '@/lib/api/fetcher';
import type { VideoDetail } from '@/types/video';
import { API_ENDPOINTS } from '@/lib/api/end-points';

const videoCache = new InMemoryCache<VideoDetail>(60 * 1000); // TTL 1 phút

export async function getVideoDetail(id: string): Promise<VideoDetail | { error: string } | null> {
    const videoId = parseInt(id);
    if (isNaN(videoId)) {
        return { error: 'Invalid video ID' };
    }
    const cached = videoCache.get(id);
    if (cached) return cached;

    try {
        const res = await apiGet<{ data: VideoDetail }>(
            API_ENDPOINTS.video.detail(id)
        );

        if ('error' in res) {
            return { error: res.error || 'Video not found' };
        }

        videoCache.set(id, res.data);
        return res.data;
    } catch (error) {
        console.error('Error fetching video detail:', error);
        return { error: 'Failed to fetch video' };
    }
}