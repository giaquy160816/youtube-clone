import Image from 'next/image';
import Link from 'next/link';
import type { VideoResponse } from '@/types/video';
import { PATH } from '@/lib/constants/paths';
import { getFullPath } from '@/lib/utils/get-full-path';

export default function VideoCard({ video }: { video: VideoResponse }) {
    return (
        <div className="bg-card">
            <figure className="relative aspect-video w-full rounded-xl overflow-hidden mb-2">
                <Link href={PATH.VIDEO_DETAIL(video.id) || ''}>
                    <Image
                        src={getFullPath(video.image) || ''}
                        alt={video.title}
                        fill
                        className="object-cover"
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