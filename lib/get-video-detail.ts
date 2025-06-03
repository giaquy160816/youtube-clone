import { api } from '@/lib/api';
import type { VideoDetail } from '@/types/video';

export async function getVideoDetail(id: string): Promise<VideoDetail> {
    const res = await api.get<VideoDetail>(`/home/video/${id}`);
    return res.data;
}