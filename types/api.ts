// types/api.ts

import { videoSmall } from "./video";

export type ApiResponse<T> = {
    data: T;
    message?: string;
    status?: number;
    total?: number;
};

export type PaginationParams = {
    page: number;
    limit: number;
    q?: string;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type VideoListParams = PaginationParams & {
    q: string;
}; 

export type responseSuccess = {
    message: string;
}

export type responseCallApi = {
    statusCode: number;
    message: string;
}

export type CommentParams = {
    content: string;
    videoId: string;
    parentId?: string;
};

export type CommentResponse = {
    id: string;
    content: string;
    videoId: string;
    userId: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string;
        avatar?: string;
    };
    likes: number;
    dislikes: number;
    isLiked?: boolean;
    isDisliked?: boolean;
    replies?: CommentResponse[];
};

export type Playlist = {
    id: string;
    name: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    videos?: videoSmall[];
};

export type PlaylistVideo = {
    id: string;
    playlistId: string;
    createdAt: string;
    updatedAt: string;
    video: videoSmall;
};

export type CreatePlaylistRequest = {
    name: string;
};

export type AddVideoToPlaylistRequest = {
    playlistId: number;
    videoId: number;
};

export type PlaylistDetailResponse = ApiResponse<Playlist>;
export type PlaylistListResponse = ApiResponse<Playlist[]>;
export type PlaylistVideoListResponse = ApiResponse<PlaylistVideo[]>;