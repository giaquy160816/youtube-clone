import { apiGet } from '@/lib/api/fetcher';
import type { VideoDetail } from '@/types/video';
import { API_ENDPOINTS } from '@/lib/api/end-points';

export async function getVideoDetail(id: string): Promise<VideoDetail> {
    const res = await apiGet<{ data: VideoDetail }>(
        API_ENDPOINTS.video.detail(id)
    );
    return res.data;
}