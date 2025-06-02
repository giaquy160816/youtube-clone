"use client";
import VideoList from '@/components/video/list-video';
import type { Video } from '@/components/video/item-video';
import { api } from '@/lib/api';
import { Suspense, useEffect, useState } from 'react';

export default function HomePage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(9);
    const [q, setQ] = useState('video');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `/home/video?q=${q}&page=${page}&limit=${limit}`;
                const response = await api.get(url);
                const formattedVideos: Video[] = response.data.map((video: any) => ({
                    id: video.id,
                    title: video.title,
                    thumbnail: video.image,
                    author: video.author,
                    views: video.views,
                    createdAt: video.createdAt,
                    avatar: video.avatar,
                }));
                setVideos(formattedVideos);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };
        fetchData();
        
    }, []);
    console.log('>>> videos', videos);
    
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-6">Video mới nhất</h1>
                <VideoList videos={videos} />
            </div>
        </Suspense>
    );
}