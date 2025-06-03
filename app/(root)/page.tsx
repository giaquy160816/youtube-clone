"use client";
import VideoList from '@/components/video/list-video';
import type { Video, VideoResponse } from '@/types/video';
import type { VideoListParams } from '@/types/api';
import { api } from '@/lib/api';
import { Suspense, useEffect, useState } from 'react';

const defaultParams: VideoListParams = {
    page: 1,
    limit: 9,
    q: 'video',
} as const;

export default function HomePage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const url = `/home/video?q=${defaultParams.q}&page=${defaultParams.page}&limit=${defaultParams.limit}`;
                const response = await api.get<VideoResponse[]>(url);
                const formattedVideos = response.data.map((video) => ({
                    id: video.id,
                    title: video.title,
                    image: video.image,
                    author: video.author,
                    views: video.views,
                    createdAt: video.createdAt,
                    avatar: video.avatar,
                })) satisfies Video[];
                setVideos(formattedVideos);
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-6">Video mới nhất</h1>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <VideoList videos={videos} />
                )}
            </div>
        </Suspense>
    );
}