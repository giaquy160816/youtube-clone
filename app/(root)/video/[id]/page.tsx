import type { Metadata } from 'next';
import VideoClient from '@/app/(root)/video/[id]/VideoClient';
import { getVideoDetail } from '@/lib/get-video-detail';

type Props = {
    params: Promise<{ id: string }>
}


// ✅ Nếu muốn SEO từ video thật
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const video = await getVideoDetail(id.toString());

    return {
        title: video.title,
        description: video.description?.slice(0, 160) || 'Xem video chi tiết',
        openGraph: {
            images: [video.image],
        },
    };
}

// ✅ Server component
export default async function Page({ params }: Props & { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <VideoClient id={id} />;
}