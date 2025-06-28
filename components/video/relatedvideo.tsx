'use client';
import type { videoSmall } from '@/types/video';
import getFullPath from "@/lib/utils/get-full-path";
import Image from "next/image";
import { MoreVertical, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
    videos: videoSmall[];
    playlistId: number;
    onDeleteVideo?: (videoId: number) => void;
    onMoveVideo?: (videoId: number, direction: 'up' | 'down') => void;
    onVideoChange?: (videoId: string) => void;
};

export function RelatedVideoListPlaylist({ 
    videos, 
    playlistId, 
    onDeleteVideo, 
    onMoveVideo, 
    onVideoChange,
    currentVideoId 
}: Props & { currentVideoId?: string | null }) {
    return (
        <div className="flex flex-col">
            {videos.map((video, index) => {
                const isActive = video.id.toString() === currentVideoId;
                return (
                    <div
                        key={video.id}
                        className={`flex items-center mb-2 group rounded-lg transition ${
                            isActive ? 'bg-primary/80 text-primary-foreground' : ''
                        }`}
                    >
                        <div 
                            onClick={() => onVideoChange?.(video.id.toString())}
                            className="cursor-pointer transform hover:scale-105 transition w-full h-full object-cover rounded flex flex-row flex-1 p-2"
                        >
                            <div className="relative rounded-lg w-[100px] aspect-[16/9]">
                                <Image
                                    src={getFullPath(video.image) || ''}
                                    alt={video.title}
                                    fill
                                    className="w-full rounded-lg shadow-md object-cover"
                                    loading="lazy"
                                />
                            </div>
                
                            <div className="pl-2 flex-1 w-full truncate text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                {video.title}
                            </div>
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 h-8 w-8 p-0"
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {onMoveVideo && index > 0 && (
                                    <DropdownMenuItem 
                                        onClick={() => onMoveVideo(video.id, 'up')}
                                        className="cursor-pointer"
                                    >
                                        <MoveUp className="mr-2 h-4 w-4" />
                                        Di chuyển lên
                                    </DropdownMenuItem>
                                )}
                                {onMoveVideo && index < videos.length - 1 && (
                                    <DropdownMenuItem 
                                        onClick={() => onMoveVideo(video.id, 'down')}
                                        className="cursor-pointer"
                                    >
                                        <MoveDown className="mr-2 h-4 w-4" />
                                        Di chuyển xuống
                                    </DropdownMenuItem>
                                )}
                                {onDeleteVideo && (
                                    <DropdownMenuItem 
                                        onClick={() => onDeleteVideo(video.id)}
                                        className="cursor-pointer text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Xóa khỏi playlist
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            })}
        </div>
    );
} 