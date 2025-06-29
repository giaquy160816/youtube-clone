'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { VideoResponse } from '@/types/video';
import { PATH } from '@/lib/constants/paths';
import getFullPath from '@/lib/utils/get-full-path';
import { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

export function RelatedVideoItem({ video }: { video: VideoResponse }) {
    return (
        <Link href={PATH.VIDEO_DETAIL(video.id) || ''} className="flex gap-2 items-center mb-3 hover:bg-accent rounded p-1 transition">
            <div className="relative w-[80px] h-[45px] flex-shrink-0 rounded overflow-hidden aspect-[16/9]">
                <Image
                    src={getFullPath(video.image) || ''}
                    alt={video.title}
                    fill
                    className="object-cover rounded"
                    loading="lazy"
                />
            </div>
            <div className="text-sm font-medium line-clamp-2 text-foreground">
                {video.title}
            </div>
        </Link>
    );
}

export function RelatedVideoItemOnPlayer({ video }: { video: VideoResponse }) {
    return (
        <Link href={PATH.VIDEO_DETAIL(video.id) || ''} 
        className="cursor-pointer transform hover:scale-105 transition w-full h-full object-cover rounded flex flex-col flex-1">
            <div className="relative w-full h-full">
                <Image
                    src={getFullPath(video.image) || ''}
                    alt={video.title}
                    fill
                    className="w-full rounded-lg shadow-md object-cover"
                    loading="lazy"
                />
            </div>

            <div className="h-[20px] w-full text-center text-sm font-semibold mt-2 truncate overflow-hidden text-ellipsis whitespace-nowrap">
                {video.title}
            </div>
        </Link>
    );
}

export default function VideoCard({ video }: { video: VideoResponse }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const isPlayable = video.path?.endsWith('.m3u8');
    const handleMouseEnter = () => {
        if (!isPlayable) return;
        setIsHovered(true);
        setShowPlayer(true); // bắt đầu load player
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsPlayerReady(false); // reset trạng thái buffer
        setTimeout(() => setShowPlayer(false), 200); // delay một chút để transition đẹp
    };

    return (
        <div className="bg-card">
            <figure className="relative w-full rounded-xl overflow-hidden mb-2 aspect-[16/9]"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Link href={PATH.VIDEO_DETAIL(video.id) || ''} className="w-full h-full">
                    <Image
                        src={getFullPath(video.image) || ''}
                        alt={video.title}
                        width={550}
                        height={309}
                        className={`object-cover w-full h-full absolute inset-0 transition-opacity duration-300 ${isHovered && isPlayerReady ? 'opacity-0' : 'opacity-100'}`}
                        loading="lazy"
                    />
                    {isPlayable && showPlayer && (
                        <div className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isHovered && isPlayerReady ? 'opacity-100' : 'opacity-0'
                            }`}>
                            <ReactPlayer
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    opacity: isHovered && isPlayerReady ? 1 : 0,
                                    transition: 'opacity 300ms ease',
                                    pointerEvents: 'none',
                                }}
                                url={getFullPath(video?.path || '')}
                                playing={isHovered}
                                muted
                                loop
                                width="100%"
                                height="100%"
                                playsinline
                                onReady={() => setIsPlayerReady(true)}
                                config={{
                                    file: {
                                        attributes: {
                                            controls: false,
                                            preload: 'auto',
                                        },
                                    },
                                }}
                            />
                        </div>
                    )}
                </Link>
            </figure>
            <div className="flex items-start gap-3">
                <Image
                    src={getFullPath(video.avatar) || ''}
                    alt={video.author || ''}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <div className="text-lg font-semibold text-foreground">
                        <Link href={PATH.VIDEO_DETAIL(video.id) || ''}>
                            {video.title}
                        </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">{video.author || ''}</div>
                    <div className="text-sm text-muted-foreground">{video.views?.toLocaleString() || ''} lượt xem • {video.createdAt || ''}</div>
                </div>
            </div>
        </div>
    );
}