import VideoCard from "./item-video";

export type Video = {
    id: number;
    title: string;
    thumbnail: string;
    author: string;
    views: number;
    createdAt: string;
};

type Props = {
    videos: Video[];
};

export default function VideoList({ videos }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
            ))}
        </div>
    );
}
