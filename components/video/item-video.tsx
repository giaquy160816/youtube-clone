import Image from 'next/image';

type Video = {
    id: number;
    title: string;
    thumbnail: string;
    author: string;
    views: number;
    createdAt: string;
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
                    src={`https://i.pravatar.cc/40?u=${video.author}`}
                    alt={video.author}
                    width={10}
                    height={10}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <div className="text-lg font-semibold text-foreground">{video.title}</div>
                    <div className="text-sm text-muted-foreground">{video.author}</div>
                    <div className="text-sm text-muted-foreground">{video.views.toLocaleString()} lượt xem • {new Date(video.createdAt).toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    );
}