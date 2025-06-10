'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { VideoDetail } from '@/types/video';
import { getFullPath } from '@/lib/utils/get-full-path';
import ReactPlayer from 'react-player/lazy';
import { ThumbsUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsAuthenticated } from '@/lib/hooks/useIsAuthenticated';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';

export default function VideoClient({
    id,
    video,
}: {
    id: string;
    video: VideoDetail | null;
}) {
    const isAuthenticated = useIsAuthenticated();
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const checkLike = async () => {
            if (!video) return;
            try {
                const res = await api(API_ENDPOINTS.user.video.checkLike(id), { method: 'GET' }) as { isLiked: boolean };
                setIsLiked(res?.isLiked || false);
            } catch (err) {
                console.warn('Không kiểm tra được like:', err);
            }
        };
        checkLike();
    }, [id, video]);

    if (!video) return <div className="p-4 text-red-500">Không tìm thấy video</div>;

    return (
        <div className="p-4">
            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                    <ReactPlayer
                        url={getFullPath(video.path)}
                        width="100%"
                        height="100%"
                        playing
                        controls
                        muted
                        className="absolute top-0 left-0"
                    />
                </div>
                <div className="flex items-start gap-4">
                    <Image
                        src={getFullPath(video.avatar)}
                        alt={video.author}
                        width={50}
                        height={50}
                        className="rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                        <div className="text-sm text-muted-foreground mb-2">{video.author}</div>
                        <div className="text-sm text-muted-foreground mb-2">
                            {video.views?.toLocaleString()} lượt xem • {video.createdAt}
                        </div>

                        <div className="mt-4 flex items-center gap-4 mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        toast.warning('Vui lòng đăng nhập để thực hiện chức năng này!');
                                        return;
                                    }
                                    handleLike();
                                }}
                                className={`flex items-center gap-1 border-primary border-1 border-solid hover:bg-primary hover:text-white ${isLiked ? 'bg-primary text-white' : ''}`}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{isLiked ? 'Đã thích' : 'Thích'}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const link = window.location.href;
                                    navigator.clipboard.writeText(link);
                                    toast.success('Đã sao chép liên kết!');
                                }}
                                className="flex items-center gap-1 border-[blue] border-1 border-solid hover:bg-[blue]"
                            >
                                <Share2 className="w-4 h-4" />
                                <span>Chia sẻ</span>
                            </Button>
                        </div>

                        <div className="bg-muted p-4 rounded-lg">
                            <p className="whitespace-pre-wrap">{video.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    async function handleLike() {
        try {
            if (isLiked) {
                await api(API_ENDPOINTS.user.video.dislike(id), { method: 'DELETE' });
                setIsLiked(false);
                toast.error('Bạn đã bỏ thích video này!');
                return;
            }
            await api(API_ENDPOINTS.user.video.like, { method: 'POST' }, { video_id: parseInt(id) });
            setIsLiked(true);
            toast.success('Bạn đã thích video này!');
        } catch (error) {
            console.error('Error liking video:', error);
        }
    }
}