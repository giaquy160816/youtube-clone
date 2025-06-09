import { useState } from 'react';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { notify } from '@/lib/utils/noti';
import { getFullPath } from '@/lib/utils/get-full-path';

type FileType = 'image' | 'video';

interface UseFileUploadProps {
    onSuccess?: (path: string) => void;
    fileType?: FileType;
}

export const useFileUpload = ({ onSuccess, fileType = 'image' }: UseFileUploadProps = {}) => {
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string>('');

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        setLoading(true);

        try {
            const endpoint = fileType === 'image' 
                ? API_ENDPOINTS.common.uploadImage 
                : API_ENDPOINTS.common.uploadVideo;

            const res = await api(endpoint, { method: 'POST' }, formData) as { path: string };
            
            if (fileType === 'image') {
                setPreview(getFullPath(res.path || ''));
            }
            
            onSuccess?.(res.path);
            e.target.value = '';
            return res.path;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : `Lỗi upload ${fileType === 'image' ? 'ảnh' : 'video'}`;
            notify.error(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        handleFileUpload,
        loading,
        preview,
        setPreview
    };
}; 