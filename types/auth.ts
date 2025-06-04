// types/auth.ts

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
        email: string;
        fullname: string;
        avatar?: string;
    };
}; 