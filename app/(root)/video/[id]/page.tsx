// app/(root)/video/[id]/page.tsx

import type { Metadata } from 'next';
import VideoClient from './VideoClient';
import { getVideoDetail } from '@/lib/videos/get-video-detail';

type Props = {
    params: Promise<{ id: string }>;
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

// ✅ SEO metadata từ nội dung video
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const video = await getVideoDetail(id);

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