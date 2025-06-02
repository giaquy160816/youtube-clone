import Image from 'next/image';
import Link from 'next/link';

type Video = {
    id: number;
    title: string;
    thumbnail: string;
    author: string;
    views: number;
    createdAt: string;
    avatar: string;
};

export type { Video };

export default function VideoCard({ video }: { video: Video }) {
    return (
        <div className="bg-card">
            <figure className="relative aspect-video w-full rounded-xl overflow-hidden mb-2">
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                />
            </figure>
            <div className="flex items-start gap-3">
                <Image
                    src={video.avatar}
                    alt={video.author}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <div className="text-lg font-semibold text-foreground">
                        <Link href={`/video/${video.id}`}>
                            {video.title}
                        </Link>
                    </div>
                    <div className="text-sm text-muted-foreground">{video.author}</div>
                    <div className="text-sm text-muted-foreground">{video.views.toLocaleString()} lượt xem • {video.createdAt}</div>
                </div>
            </div>
        </div>
    );
}