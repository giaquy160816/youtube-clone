// lib/constants/paths.ts
export const PATH = {
    HOME: '/',
    ME: {
        PROFILE: '/me/profile',
        VIDEO_POST: '/me/post',
        VIDEO_EDIT: (id: string | number) => `/me/post/${id}`,
        VIDEO_MANAGE: '/me/manage',
        VIDEO_WATCHED: '/me/watched',
        VIDEO_LIKED: '/me/liked',
        VIDEO_PLAYLIST: '/me/playlist',
        LOGOUT: '/logout',
    },
    LOGIN: '/login',
    VIDEO_DETAIL: (id: string | number) => `/video/detail/${id}`,
    VIDEO_LIST: '/video',
    VIDEO_SEARCH: '/video/search',
    // USER_DETAIL: (uid: string) => `/user/${uid}`,
};