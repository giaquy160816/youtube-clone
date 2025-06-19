import Image from 'next/image';
import Link from 'next/link';
import type { VideoResponse } from '@/types/video';
import { PATH } from '@/lib/constants/paths';
import { getFullPath } from '@/lib/utils/get-full-path';

export function RelatedVideoItem({ video }: { video: VideoResponse }) {
    return (
        <Link href={PATH.VIDEO_DETAIL(video.id) || ''} className="flex gap-2 items-center mb-3 hover:bg-accent rounded p-1 transition">
            <div className="relative w-[80px] h-[45px] flex-shrink-0 rounded overflow-hidden relative aspect-[16/9]">
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
    console.log('video', video);
    
    return (
        <Link href={PATH.VIDEO_DETAIL(video.id) || ''} className="cursor-pointer transform hover:scale-105 transition">
                <Image
                    src={getFullPath(video.image) || ''}
                    alt={video.title}
                    width={150}
                    height={100}
                    className="w-full rounded-lg shadow-md"
                    loading="lazy"
                />
                <p className="mt-2 text-center text-sm">{video.title}</p>
        </Link>
    );
}

export default function VideoCard({ video }: { video: VideoResponse }) {
    return (
        <div className="bg-card">
            <figure className="relative w-full rounded-xl overflow-hidden mb-2 relative aspect-[16/9]">
                <Link href={PATH.VIDEO_DETAIL(video.id) || ''} className="w-full h-full">
                    <Image
                        src={getFullPath(video.image) || ''}
                        alt={video.title}
                        width={550}
                        height={309}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
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