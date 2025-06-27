import { useState, useCallback } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import type { CommentResponse, CommentParams, ApiResponse } from '@/types/api';
import { notify } from '@/lib/utils/noti';

export const useComment = () => {
    const [loading, setLoading] = useState(false);

    const getComments = useCallback(async (videoId: string): Promise<CommentResponse[]> => {
        try {
            setLoading(true);
            const url = API_ENDPOINTS.comment.getByVideo(videoId);
            const res = await apiGet<ApiResponse<CommentResponse[]>>(url);
            
            if ('error' in res) {
                notify.error(res.error);
                return [];
            }
            
            return res.data;
        } catch (error) {
            console.error('Error fetching comments:', error);
            notify.error('Không thể tải bình luận');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createComment = useCallback(async (params: CommentParams): Promise<CommentResponse | null> => {
        try {
            setLoading(true);
            const res = await apiPost<ApiResponse<CommentResponse>, CommentParams>(API_ENDPOINTS.comment.create, params);
            
            if ('error' in res) {
                notify.error(res.error);
                return null;
            }
            
            notify.success('Bình luận đã được đăng');
            return res.data;
        } catch (error) {
            console.error('Error creating comment:', error);
            notify.error('Không thể đăng bình luận');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateComment = useCallback(async (id: string, content: string): Promise<CommentResponse | null> => {
        try {
            setLoading(true);
            const res = await apiPut<ApiResponse<CommentResponse>, { content: string }>(API_ENDPOINTS.comment.update(id), { content });
            
            if ('error' in res) {
                notify.error(res.error);
                return null;
            }
            
            notify.success('Bình luận đã được cập nhật');
            return res.data;
        } catch (error) {
            console.error('Error updating comment:', error);
            notify.error('Không thể cập nhật bình luận');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteComment = useCallback(async (id: string): Promise<boolean> => {
        try {
            setLoading(true);
            const res = await apiDelete<ApiResponse<{ message: string }>>(API_ENDPOINTS.comment.delete(id));
            
            if ('error' in res) {
                notify.error(res.error);
                return false;
            }
            
            notify.success('Bình luận đã được xóa');
            return true;
        } catch (error) {
            console.error('Error deleting comment:', error);
            notify.error('Không thể xóa bình luận');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const likeComment = useCallback(async (id: string): Promise<boolean> => {
        try {
            const res = await apiPost<ApiResponse<{ message: string }>, Record<string, never>>(API_ENDPOINTS.comment.like(id), {});
            
            if ('error' in res) {
                notify.error(res.error);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error liking comment:', error);
            notify.error('Không thể thích bình luận');
            return false;
        }
    }, []);

    const dislikeComment = useCallback(async (id: string): Promise<boolean> => {
        try {
            const res = await apiPost<ApiResponse<{ message: string }>, Record<string, never>>(API_ENDPOINTS.comment.dislike(id), {});
            
            if ('error' in res) {
                notify.error(res.error);
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error disliking comment:', error);
            notify.error('Không thể không thích bình luận');
            return false;
        }
    }, []);

    return {
        loading,
        getComments,
        createComment,
        updateComment,
        deleteComment,
        likeComment,
        dislikeComment,
    };
}; 