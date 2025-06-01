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
            <img
                src={video.thumbnail}
                alt={video.title}
                className="rounded mb-2 aspect-video w-full object-cover"
                loading="lazy"
            />
            <div className="flex items-start gap-3">
                <img
                    src={`https://i.pravatar.cc/40?u=${video.author}`}
                    alt={video.author}
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