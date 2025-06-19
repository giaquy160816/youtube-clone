// lib/api/end-points.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    auth: {
        login: '/backend/auth/login',
        loginGoogle: '/backend/auth/login-google-supabase',
        refreshToken: '/backend/auth/refresh-token',
        logout: '/backend/auth/logout',
    },
    video: {
        list: '/video',
        detail: (id: string) => `/video/${id}`,
    },
    common: {
        uploadImage: '/backend/common/upload-image',
        uploadVideo: '/backend/common/upload-video',
        initVideoUpload: '/backend/common/init-video-upload',
        uploadVideoChunk: '/backend/common/upload-video-chunk',
        completeVideoUpload: '/backend/common/complete-video-upload',
    },
    user: {
        me: '/backend/user/me',
        video: {
            me: '/backend/video/me',
            post: '/backend/video',
            detail: (id: string) => `/backend/video/${id}`,
            edit: (id: string) => `/backend/video/${id}`,
            delete: (id: string) => `/backend/video/${id}`,
            like: `/backend/like`,
            dislike: (id: string) => `/backend/like/${id}`,
            checkLike: (id: string) => `/backend/like/check/${id}`,
            watched: `/backend/watched`,
            listWatched: `/backend/watched/list`,
            checkWatched: (id: string) => `/backend/watched/${id}`,
            deleteWatched: (id: string) => `/backend/watched/${id}`,
        }
    },
} as const;