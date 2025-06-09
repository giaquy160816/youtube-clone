// app/(root)/video/[id]/VideoClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { VideoDetail } from '@/types/video';
import { getVideoDetail } from '@/features/videos/get-video-detail';
import { getFullPath } from '@/lib/utils/get-full-path';
import { notify } from '@/lib/utils/noti';
import ReactPlayer from 'react-player/lazy'


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
            <div className="max-w-4xl mx-auto">
                <div className="aspect-video w-full relative mb-4">
                    {/* <video
                        src={getFullPath(video.path)}
                        controls
                        className="w-full h-full rounded-lg"
                        poster={getFullPath(video.image)}
                    /> */}
                    <ReactPlayer
                        url={getFullPath(video.path)}
                        className="w-full h-full rounded-lg"
                        playing={true}
                        controls={true}
                        muted={true}
                    />
                </div>
                <div className="flex items-start gap-4">
                    <Image
                        src={getFullPath(video.avatar)}
                        alt={video.author}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                        <div className="text-sm text-muted-foreground mb-2">
                            {video.views?.toLocaleString()} lượt xem • {video.createdAt}
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">{video.author}</div>
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="whitespace-pre-wrap">{video.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}