// lib/constants/paths.ts

export const PATH = {
    HOME: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    PROFILE: '/me/profile',
    VIDEO_POST: '/me/post',
    VIDEO_EDIT: (id: string | number) => `/me/post/${id}`,
    VIDEO_MANAGE: '/me/manage',
    VIDEO_DETAIL: (id: string | number) => `/video/detail/${id}`,
    VIDEO_LIST: '/video',
    // USER_DETAIL: (uid: string) => `/user/${uid}`,
};