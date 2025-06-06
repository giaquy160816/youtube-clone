// app/(root)/video/[id]/page.tsx

import type { Metadata } from 'next';
import VideoClient from './VideoClient';
import { getVideoDetail } from '@/features/videos/get-video-detail';

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
        title: video.title,
        description: video.description?.slice(0, 160) || 'Xem video chi tiết',
        openGraph: {
            images: [video.image],
        },
    };
}

// ✅ Server component – truyền `id` sang client
export default async function Page({ params }: Props) {
    const { id } = await params;
    return <VideoClient id={id} />;
}