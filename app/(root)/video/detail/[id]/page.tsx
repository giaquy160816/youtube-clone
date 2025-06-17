// app/(root)/video/[id]/page.tsx

import type { Metadata } from 'next';
import VideoClient from './VideoClient';
import { getVideoDetail } from '@/features/videos/get-video-detail';
import CommentSection from './CommentSection';
import { VideoDetail } from '@/types/video';
import { apiGet } from '@/lib/api/fetcher';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import type { VideoResponse } from '@/types/video';
import { RelatedVideoList } from '@/components/video/list-video';

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const video = await getVideoDetail(id);

    if (!video || 'error' in video) {
        return {
            title: 'Video không tồn tại',
            description: 'Video bạn tìm kiếm không tồn tại hoặc đã bị xóa.',
            openGraph: {
                images: ['/default-thumbnail.jpg'], // fallback image
            },
        };
    }

    return {
        title: video.title + ' - ' + video.author,
        description: video.description?.slice(0, 160) || 'Xem video chi tiết',
        openGraph: {
            images: [video.image],
        },
    };
}

// ✅ Server component – truyền `id` sang client
export default async function Page({ params }: Props) {
    const { id } = await params;
    const video: VideoDetail | { error: string } | null = await getVideoDetail(id);
    const isValid = video && !('error' in video);

    // Lấy danh sách video liên quan (tạm thời: lấy 6 video đầu, loại bỏ video hiện tại)
    let relatedVideos: VideoResponse[] = [];
    try {
        const urlGetRelatedVideos = API_ENDPOINTS.video.list + '?q='+video?.tags?.join(',')+'&page=1&limit=7';
        const res = await apiGet<{ data: VideoResponse[] } | { error: string }>(urlGetRelatedVideos);
        if (res && !('error' in res) && Array.isArray(res.data)) {
            relatedVideos = res.data.filter((v: VideoResponse) => v.id.toString() !== id).slice(0, 6);
        }
    } catch {}

    return (
        <div className="w-full flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-10 px-2">
            <div className="flex-1 min-w-0">
                <VideoClient id={id} video={isValid ? video : null} relatedVideos={relatedVideos} />
                {isValid && <CommentSection videoId={id} />}
            </div>
            <aside className="w-full md:w-[320px] flex-shrink-0">
                <div className="font-semibold text-lg mb-3">Video liên quan</div>
                <RelatedVideoList videos={relatedVideos} />
            </aside>
        </div>
    )
}