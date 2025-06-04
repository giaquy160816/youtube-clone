// types/video.ts


export type VideoResponse = {
    id: number;
    title: string;
    image: string;
    author: string;
    views: number;
    createdAt: string;
    avatar: string;
};


export type VideoDetail = VideoResponse & {
    views: number;
    description: string;
    path: string;
}; 