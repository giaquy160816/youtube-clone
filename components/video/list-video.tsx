import VideoCard from "./item-video";
import { RelatedVideoItem } from './item-video';
import type { VideoResponse } from '@/types/video';

type Props = {
    videos: VideoResponse[];
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

export function RelatedVideoList({ videos }: { videos: VideoResponse[] }) {
    return (
        <div className="flex flex-col">
            {videos.map((video) => (
                <RelatedVideoItem key={video.id} video={video} />
            ))}
        </div>
    );
}
