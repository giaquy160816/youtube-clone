// lib/constants/paths.ts

export const PATH = {
    HOME: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    PROFILE: '/profile',
    VIDEO_DETAIL: (id: string | number) => `/video/detail/${id}`,
    VIDEO_POST: '/video/post',
    VIDEO_MANAGE: '/video/manage',
    // USER_DETAIL: (uid: string) => `/user/${uid}`,
};
