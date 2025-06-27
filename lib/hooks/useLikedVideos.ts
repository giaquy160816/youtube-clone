'use client';

import { useState, useCallback, useRef } from 'react';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { apiGet, api } from '@/lib/api/fetcher';
import { toast } from 'sonner';
import type { VideoResponse } from '@/types/video';
import { responseSuccess } from '@/types/api';

type LikedVideoResponse = {
    data: VideoResponse[];
    total: number;
};

interface UseLikedVideosProps {
    onFetch?: (videos: VideoResponse[], page: number, total: number) => void;
}

export function useLikedVideos({ onFetch }: UseLikedVideosProps = {}) {
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const limit = 20;
    const onFetchRef = useRef(onFetch);
    
    // Cập nhật ref khi onFetch thay đổi
    onFetchRef.current = onFetch;

    const fetchLikedVideos = useCallback(async (page: number = 1) => {
        setLoading(true);
        try {
            const query = `?page=${page}&limit=${limit}`;
            const res = await apiGet<LikedVideoResponse>(`${API_ENDPOINTS.user.video.getLiked}${query}`);

            if (!res || "error" in res) {
                toast.error(res?.error || "Không thể tải danh sách video đã thích");
                onFetchRef.current?.([], page, 0);
                return;
            }

            const newVideos = Array.isArray(res.data) ? res.data : [];
            const totalItems = res.total || 0;
            setTotal(totalItems);
            
            onFetchRef.current?.(newVideos, page, totalItems);
        } catch (error) {
            console.error('Error fetching liked videos:', error);
            toast.error('Có lỗi xảy ra khi tải danh sách video đã thích');
            onFetchRef.current?.([], page, 0);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    const unlikeVideo = useCallback(async (videoId: number) => {
        const confirmUnlike = confirm('Bạn có chắc chắn muốn bỏ thích video này?');
        if (!confirmUnlike) return;

        try {
            const res = await api<responseSuccess>(API_ENDPOINTS.user.video.dislike(videoId.toString()), { method: 'DELETE' });
            if (!res || "error" in res) {
                toast.error(res?.error || 'Bỏ thích video thất bại');
                return;
            }
            
            toast.success(res.message || 'Đã bỏ thích video!');
            setTotal(prev => prev - 1);
        } catch (error) {
            console.error('Error unliking video:', error);
            toast.error('Có lỗi xảy ra khi bỏ thích video');
        }
    }, []);

    return {
        loading,
        total,
        fetchLikedVideos,
        unlikeVideo,
        limit,
    };
} 