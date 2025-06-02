"use client";
import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import Image from 'next/image';

type VideoDetail = {
    id: number;
    title: string;
    description: string;
    image: string;
    path: string;
    author: string;
    views: number;
    createdAt: string;
    avatar: string;
};

export default function VideoPage({ params }: { params: { id: string } }) {
    const [video, setVideo] = useState<VideoDetail | null>(null);
    const [loading, setLoading] = useState(true);

    console.log('>>> params', params);
    
    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/home/video/${params.id}`);
                console.log('Video response:', response); // Add logging to debug
                setVideo(response.data);
            } catch (error) {
                console.error('Error fetching video:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [params.id]);

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!video) {
        return <div className="p-4">Video not found</div>;
    }

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto">
                <div className="aspect-video w-full relative mb-4">
                    <video
                        src={video.path}
                        controls
                        className="w-full h-full rounded-lg"
                        poster={video.image}
                    />
                </div>
                <div className="flex items-start gap-4">
                    <Image
                        src={video.avatar}
                        alt={video.author}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                        <div className="text-sm text-muted-foreground mb-2">
                            {video.views.toLocaleString()} lượt xem • {new Date(video.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">
                            {video.author}
                        </div>
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="whitespace-pre-wrap">{video.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 