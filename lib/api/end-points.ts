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
    },
    user: {
        me: '/backend/user/me',
    },
} as const;