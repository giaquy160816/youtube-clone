// types/auth.ts

export interface UserInfo {
    email: string;
    fullname: string;
    avatar?: string;
    phone?: string;
    id?: number;
}

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserInfo;
}; 