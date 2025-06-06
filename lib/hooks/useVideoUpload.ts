import { useState } from 'react';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { notify } from '@/lib/utils/noti';

const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB

interface UseVideoUploadProps {
    onSuccess?: (path: string) => void;
    onProgress?: (progress: number) => void;
}

export const useVideoUpload = ({ onSuccess, onProgress }: UseVideoUploadProps = {}) => {
    const [loading, setLoading] = useState(false);
    const [uploadId, setUploadId] = useState<string | null>(null);

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            if (file.size <= CHUNK_SIZE) {
                // Upload trực tiếp nếu file nhỏ hơn hoặc bằng 10MB
                const formData = new FormData();
                formData.append('file', file);
                const res = await api(API_ENDPOINTS.common.uploadVideo, { method: 'POST' }, formData) as { path: string };
                onSuccess?.(res.path);
                e.target.value = '';
                return res.path;
            }

            // Chunk upload nếu file lớn hơn 10MB
            // ... (phần chunk upload giữ nguyên như cũ)
            const initRes = await api(API_ENDPOINTS.common.initVideoUpload, { 
                method: 'POST' 
            }, { 
                filename: file.name,
                totalSize: file.size 
            }) as { uploadId: string };
            setUploadId(initRes.uploadId);

            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            let uploadedChunks = 0;

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append('chunk', chunk);
                formData.append('uploadId', initRes.uploadId);
                formData.append('chunkIndex', chunkIndex.toString());

                await api(API_ENDPOINTS.common.uploadVideoChunk, { method: 'POST' }, formData);

                uploadedChunks++;
                const progress = (uploadedChunks / totalChunks) * 100;
                onProgress?.(progress);
            }

            const completeRes = await api(API_ENDPOINTS.common.completeVideoUpload, { 
                method: 'POST' 
            }, { 
                uploadId: initRes.uploadId 
            }) as { path: string };

            onSuccess?.(completeRes.path);
            e.target.value = '';
            return completeRes.path;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi upload video';
            notify.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
            setUploadId(null);
        }
    };

    return {
        handleVideoUpload,
        loading,
        uploadId
    };
}; 