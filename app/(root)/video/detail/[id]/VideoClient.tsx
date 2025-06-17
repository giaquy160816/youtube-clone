'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { VideoDetail, VideoResponse } from '@/types/video';
import { getFullPath } from '@/lib/utils/get-full-path';
import ReactPlayer from 'react-player/lazy';
// import dynamic from 'next/dynamic';
// const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false });
import { ThumbsUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsAuthenticated } from '@/lib/hooks/useIsAuthenticated';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { RelatedVideoItemOnPlayer } from '@/components/video/item-video';

export default function VideoClient({
    id,
    video,
    relatedVideos,
}: {
    id: string;
    video: VideoDetail | null;
    relatedVideos: VideoResponse[] | null;
}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const rawAuth = useIsAuthenticated();
    const [isLiked, setIsLiked] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const handleVideoEnd = () => {
        setShowOverlay(true);
    };
    const handlePlay = () => {
        // If user presses play again after video ends, hide overlay
        setShowOverlay(false);
    };
    useEffect(() => {
        if (rawAuth) setIsAuthenticated(true);
    }, [rawAuth]);

    useEffect(() => {
        if (!video) return;
        const checkLike = async () => {
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
    console.log(relatedVideos)
    return (
        <div className="w-full">
            <div className="w-full max-w-4xl mx-auto">
                <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                        <ReactPlayer
                            // key={retryKey}
                            url={getFullPath(video.path)}
                            width="100%"
                            height="100%"
                            playing
                            controls
                            muted
                            className="absolute top-0 left-0"
                            // onError={(e) => {
                            //     console.warn('Retrying video load...');
                            //     console.error('Video load error:', e);
                            //     setTimeout(() => setRetryKey((k) => k + 1), 500);
                            // }}
                            onEnded={handleVideoEnd}
                            onPlay={handlePlay}
                        />
                        {showOverlay && relatedVideos  && (
                            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white p-6 z-10" style={{margin: '10px 10px 80px', opacity: 0.9, borderRadius:'10px'}}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedVideos.map((video,index) => (
                                        index < 4 ?<RelatedVideoItemOnPlayer key={video.id} video={video} />:''
                                    ))}
                                </div>
                            </div>
                        )}
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="relative w-[100px] h-[100px]">
                            <Image
                                src={getFullPath(video.avatar)}
                                alt={video.author}
                                width={400}
                                height={400}
                                className="rounded-full object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex flex-col">
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
                        </div>
                    </div>
                    {/* Description Block */}
                    <div className="p-4 rounded-lg mb-3 w-full border border-border">
                        <div className="font-semibold mb-2 text-base">Mô tả</div>
                        <p className="whitespace-pre-wrap text-sm text-foreground">{video.description}</p>
                    </div>
                    {/* Tags Block */}
                    {video.tags && video.tags.length > 0 && (
                        <div className="rounded-lg">
                            <div className="font-semibold mb-2 text-base">Tags</div>
                            <div className="flex flex-wrap gap-2">
                                {video.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium shadow-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
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