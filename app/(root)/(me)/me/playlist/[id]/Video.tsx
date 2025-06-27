'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { VideoDetail, videoSmall } from '@/types/video';
import getFullPath from '@/lib/utils/get-full-path';
import ReactPlayer from 'react-player/lazy';

export default function VideoClient({
    id,
    video,
    videos,
    currentVideoId,
    onVideoChange
}: {
    id: string;
    video: VideoDetail | null;
    videos?: videoSmall[];
    currentVideoId?: string | null;
    onVideoChange?: (videoId: string) => void;
}) {
    const playerRef = useRef<ReactPlayer>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const description = video ? video.description : null;
    const [expanded, setExpanded] = useState(false);
    const length = 100;
    const words = description ? description.trim().split(/\s+/) : null;
    const isLong = words ? words.length > length : false;
    const shortText = words ? words.slice(0, length).join(' ') : null;
    const displayText = expanded || !isLong
        ? description
        : shortText;

    const handleVideoEnd = () => {
        setIsPlaying(false);
        
        // Tự động phát video tiếp theo trong playlist
        if (videos && currentVideoId && onVideoChange) {
            const currentIndex = videos.findIndex(v => v.id.toString() === currentVideoId);
            if (currentIndex !== -1) {
                if (currentIndex < videos.length - 1) {
                    // Nếu không phải video cuối, phát video tiếp theo
                    const nextVideo = videos[currentIndex + 1];
                    onVideoChange(nextVideo.id.toString());
                } else {
                    // Nếu là video cuối, quay về video đầu tiên (vòng lặp vô tận)
                    const firstVideo = videos[0];
                    onVideoChange(firstVideo.id.toString());
                }
            }
        }
    };
    
    const handlePlay = () => {
        setIsPlaying(true);
    };

    // Tự động play video khi chuyển sang video mới
    useEffect(() => {
        setIsPlaying(true);
    }, [id]);

    if (!video) return <div className="p-4 text-red-500">Không tìm thấy video</div>;
    
    return (
        <div className="w-full">
            <div className="w-full max-w-4xl mx-auto">
                <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-lg">
                    <ReactPlayer
                        ref={playerRef}
                        url={getFullPath(video.path)}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        controls
                        muted
                        className="absolute top-0 left-0"
                        onEnded={handleVideoEnd}
                        onPlay={handlePlay}
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-4">
                        <div className="relative w-[50px] h-[50px] me-4">
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
                        </div>
                    </div>
                    {/* Description Block */}
                    <div className="p-4 rounded-lg mb-3 w-full border border-border">
                        <div className="font-semibold mb-2 text-base">Mô tả</div>
                        <p className="whitespace-pre-wrap text-sm text-foreground">
                            {displayText}
                            {isLong && !expanded && (
                                <span
                                    className="text-blue-600 hover:underline cursor-pointer" style={{ paddingLeft: '10px' }}
                                    onClick={() => setExpanded(true)}
                                >
                                    ...Xem thêm
                                </span>
                            )}
                            {isLong && expanded && (
                                <p
                                    className="text-blue-600 hover:underline cursor-pointer" style={{ paddingTop: '20px' }}
                                    onClick={() => setExpanded(false)}
                                >
                                    Thu gọn
                                </p>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}