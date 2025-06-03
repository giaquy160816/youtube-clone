// lib/auth/login-google.ts
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { apiPost } from '@/lib/api/fetcher';

interface LoginGoogleResponse {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    user?: {
        id?: string;
        email?: string;
        name?: string;
        avatar?: string;
    };
}

export async function loginWithGoogleToken(googleToken: string): Promise<LoginGoogleResponse> {
    return apiPost<LoginGoogleResponse, { token: string }>(
        API_ENDPOINTS.auth.loginGoogle,
        { token: googleToken }
    );
}