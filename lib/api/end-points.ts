// lib/api/end-points.ts

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
    auth: {
        login: '/backend/auth/login',
        loginGoogle: '/backend/auth/login-google-supabase',
    },
    video: {
        list: '/home/video',
        detail: (id: string) => `/home/video/${id}`,
    },
} as const;