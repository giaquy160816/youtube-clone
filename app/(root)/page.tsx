import VideoList from '@/components/video/list-video';
import type { Video } from '@/components/video/item-video';

const mockVideos: Video[] = Array.from({ length: 15 }).map((_, i) => ({
    id: i + 1,
    title: `Video số ${i + 1}`,
    thumbnail: `https://picsum.photos/seed/${i + 1}/400/225`,
    author: `Tác giả ${i + 1}`,
    views: Math.floor(Math.random() * 100000),
    createdAt: new Date().toISOString(),
}));

export default function HomePage() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold mb-6">Video mới nhất 8</h1>
            <VideoList videos={mockVideos} />
        </div>
    );
}