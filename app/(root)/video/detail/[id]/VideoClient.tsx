'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import type { VideoDetail, VideoResponse } from '@/types/video';
import getFullPath from '@/lib/utils/get-full-path';
import ReactPlayer from 'react-player/lazy';
import { Button } from '@/components/ui/button';
import { useIsAuthenticated } from '@/lib/hooks/useIsAuthenticated';
import { api } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { RelatedVideoItemOnPlayer } from '@/components/video/item-video';
import { useRouter } from 'next/navigation';
import GroupButton from './GroupButton';
import PlaylistDialog from './PlaylistDialog';
import { useVideoLike } from '@/lib/hooks/useVideoLike';
import { downloadVideoFile } from '@/lib/utils/video';

export default function VideoClient({
    id,
    video,
    relatedVideos,
}: {
    id: string;
    video: VideoDetail | null;
    relatedVideos: VideoResponse[] | null;
}) {
    const rawAuth = useIsAuthenticated();
    const { isLiked, handleLike } = useVideoLike({ videoId: id });
    const [showOverlay, setShowOverlay] = useState(false);
    const router = useRouter();
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
    
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);

    const handleVideoEnd = () => {
        setShowOverlay(true);
        setIsPlaying(false);
    };
    
    const handlePlay = () => {
        // If user presses play again after video ends, hide overlay
        setShowOverlay(false);
        setIsPlaying(true);
    };

    const downloadFile = () => {
        if (video?.path) {
            downloadVideoFile(video.path);
        }
    };
    
    useEffect(() => {
        if (!video || !rawAuth) return;

        const checkWatched = async () => {
            try {
                //const resCKW = await api(API_ENDPOINTS.user.video.checkWatched(id), { method: 'GET' }) as { isWatched: boolean };
               // if (resCKW?.isWatched === false) {
                    sendWatched();
               // }
            } catch (err) {
                console.warn('Không kiểm tra được watched:', err);
            }
        };

        const sendWatched = async () => {
            try {
                await api(API_ENDPOINTS.user.video.watched, { method: 'POST' }, { id: parseInt(id) });
            } catch (err) {
                console.warn('Không gửi được watched:', err);
            }
        };
        checkWatched();
    }, [id, video, rawAuth]);

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
                    {showOverlay && relatedVideos && (
                        <div className="absolute inset-0 bg-[#000000]/90 flex flex-col h-full w-full text-white justify-center ">
                            <div className="flex-1 w-full flex items-center justify-center p-4 hidden md:block">
                                <div className="grid grid-cols-2 flex-1 grid-rows-2 gap-4 w-full h-full">
                                    {relatedVideos.slice(0, 4).map((video) => (
                                        <div key={video.id} className="flex flex-col h-full min-h-0 bg-transparent">
                                            <RelatedVideoItemOnPlayer video={video} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex md:flex-row flex-col gap-4 w-full items-center justify-center my-2 h-[30px] min-h-[30px] max-h-[30px]">
                                <Button variant="secondary" onClick={() => router.back()} className="h-[30px] px-4">Quay về</Button>
                                <Button variant="default" onClick={() => {
                                    setShowOverlay(false);
                                    setIsPlaying(true);
                                    if (playerRef.current) playerRef.current.seekTo(0, 'seconds');
                                }} className="h-[30px] px-4">Xem lại</Button>
                                <Button variant="outline" className="bg-muted text-primary h-[30px] px-4"
                                    disabled={!relatedVideos || relatedVideos.length === 0}
                                    onClick={() => {
                                        if (!relatedVideos || relatedVideos.length === 0) return;
                                        const randomIdx = Math.floor(Math.random() * relatedVideos.length);
                                        const randomVideo = relatedVideos[randomIdx];
                                        if (randomVideo && randomVideo.id) router.push(`/video/detail/${randomVideo.id}`);
                                    }}>
                                    Video ngẫu nhiên
                                </Button>
                            </div>
                        </div>
                    )}
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

                            <GroupButton 
                                video={video}
                                isLiked={isLiked}
                                handleLike={handleLike}
                                downloadFile={downloadFile}
                                setPlaylistModalOpen={setPlaylistModalOpen}
                            />
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
            
            {/* Playlist Dialog */}
            <PlaylistDialog 
                open={playlistModalOpen}
                onOpenChange={setPlaylistModalOpen}
                videoId={id}
            />
        </div>
    );
}