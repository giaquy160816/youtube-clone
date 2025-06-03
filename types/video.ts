/**
 * Represents a video in the application
 */
export type Video = {
    id: number;
    title: string;
    description?: string;
    image?: string;
    path?: string;
    author?: string;
    views?: number;
    createdAt?: string;
    avatar?: string;
};

/**
 * Represents the raw video data from the API response
 */
export type VideoResponse = {
    id: number;
    title: string;
    image: string;
    author: string;
    views: number;
    createdAt: string;
    avatar: string;
};

/**
 * Represents detailed video information
 */
export type VideoDetail = {
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