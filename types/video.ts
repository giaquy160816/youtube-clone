// types/video.ts


export type VideoResponse = {
    id: number;
    title: string;
    image: string;
    path?: string;
    views: number;
    like: number;
    createdAt: string;
    author: string;
    avatar: string;
    tags?: string[];
};


export type VideoDetail = VideoResponse & {
    views: number;
    like: number;
    description: string;
    path: string;
    isActive: boolean;
}; 

export type videoSmall = {
    id: number;
    title: string;
    image: string;
}