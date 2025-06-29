// lib/api/end-points.ts

// Sử dụng proxy API thay vì gọi trực tiếp đến backend
export const API_BASE_URL = '/api/proxy';

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
            getLiked: `/backend/like/liked-videos`,
            dislike: (id: string) => `/backend/like/${id}`,
            checkLike: (id: string) => `/backend/like/check/${id}`,

            watched: `/backend/watched`,
            listWatched: `/backend/watched/list`,
            checkWatched: (id: string) => `/backend/watched/${id}`,
            deleteWatched: (id: string) => `/backend/watched/${id}`,
        },
        playlist: {
            list: '/backend/playlists',
            create: '/backend/playlists',
            detail: (id: string) => `/backend/playlists/${id}`,
            update: (id: string) => `/backend/playlists/${id}`,
            delete: (id: string) => `/backend/playlists/${id}`,
        },
        playlistVideo: {
            add: '/backend/playlist-video',
            playlist: (videoId: string) => `/backend/playlist-video/video/${videoId}`,
            delete: (id: string, videoId: string) => `/backend/playlist-video/${id}/${videoId}`,
        }
    },
    comment: {
        create: '/backend/comment',
        getByVideo: (videoId: string) => `/backend/comment/video/${videoId}`,
        update: (id: string) => `/backend/comment/${id}`,
        delete: (id: string) => `/backend/comment/${id}`,
        like: (id: string) => `/backend/comment/${id}/like`,
        dislike: (id: string) => `/backend/comment/${id}/dislike`,
    }
} as const;