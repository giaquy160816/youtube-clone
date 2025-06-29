'use client';

import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { api } from '@/lib/api/fetcher';
import { toast } from 'sonner';
import { useIsAuthenticated } from './useIsAuthenticated';

interface UseVideoLikeProps {
    videoId: string | number;
    initialLiked?: boolean;
}

export function useVideoLike({ videoId, initialLiked = false }: UseVideoLikeProps) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);
    const rawAuth = useIsAuthenticated();

    // Kiểm tra trạng thái like ban đầu
    useEffect(() => {
        if (!videoId || !rawAuth) return;

        const checkLike = async () => {
            try {
                const res = await api(API_ENDPOINTS.user.video.checkLike(videoId.toString()), { method: 'GET' }) as { isLiked: boolean };
                setIsLiked(res?.isLiked || false);
            } catch (err) {
                console.warn('Không kiểm tra được like:', err);
            }
        };

        checkLike();
    }, [videoId, rawAuth]);

    // Hàm xử lý like/unlike
    const handleLike = useCallback(async () => {
        if (!rawAuth) {
            toast.error('Vui lòng đăng nhập để thực hiện chức năng này');
            return;
        }

        setLoading(true);
        try {
            if (isLiked) {
                // Unlike video
                await api(API_ENDPOINTS.user.video.dislike(videoId.toString()), { method: 'DELETE' });
                setIsLiked(false);
                toast.error('Bạn đã bỏ thích video này!');
            } else {
                // Like video
                await api(API_ENDPOINTS.user.video.like, { method: 'POST' }, { video_id: parseInt(videoId.toString()) });
                setIsLiked(true);
                toast.success('Bạn đã thích video này!');
            }
        } catch (error) {
            console.error('Error liking/unliking video:', error);
            toast.error('Có lỗi xảy ra khi thực hiện thao tác');
        } finally {
            setLoading(false);
        }
    }, [isLiked, videoId, rawAuth]);

    // Hàm để cập nhật trạng thái like từ bên ngoài (nếu cần)
    const updateLikeStatus = useCallback((status: boolean) => {
        setIsLiked(status);
    }, []);

    return {
        isLiked,
        loading,
        handleLike,
        updateLikeStatus,
    };
} 