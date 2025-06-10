// app/(root)/video/[id]/VideoClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { VideoDetail } from '@/types/video';
import { getVideoDetail } from '@/features/videos/get-video-detail';
import { getFullPath } from '@/lib/utils/get-full-path';
import { notify } from '@/lib/utils/noti';
import ReactPlayer from 'react-player/lazy'
import { ThumbsUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function VideoClient({ id }: { id: string }) {
    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await getVideoDetail(id);
                if (!response) {
                    notify.error('Video not found');
                    return;
                }
                setVideo(response);
            } catch (error) {
                console.error('Error fetching video:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);

    if (loading) return <div className="p-4">Đang tải...</div>;
    if (!video) return <div className="p-4">Không tìm thấy video</div>;

    return (
        <div className="p-4">
            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
                <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                    {/* <video
                        src={getFullPath(video.path)}
                        controls
                        className="w-full h-full rounded-lg"
                        poster={getFullPath(video.image)}
                    /> */}
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
                        {/* Actions */}
                        <div className="mt-4 flex items-center gap-4 mb-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    // TODO: thực hiện logic lưu like vào Supabase/NestJS
                                    toast.success('Bạn đã thích video này!');
                                }}
                                className="flex items-center gap-1 border-primary border-1 border-solid"
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Thích</span>
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
}