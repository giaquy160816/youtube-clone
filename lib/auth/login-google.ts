// lib/auth/login-google.ts
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { apiPost } from '@/lib/api/fetcher';
import { AuthResponse } from '@/types/auth';


export async function loginWithGoogleToken(googleToken: string): Promise<AuthResponse> {
    return apiPost<AuthResponse, { token: string }>(
        API_ENDPOINTS.auth.loginGoogle,
        { token: googleToken }
    );
}