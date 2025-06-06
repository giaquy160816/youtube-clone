// lib/auth/login-google.ts
import { API_ENDPOINTS } from '@/lib/api/end-points';
import { apiPost } from '@/lib/api/fetcher';
import { AuthResponse } from '@/types/auth';
import { notify } from '../utils/noti';


export async function loginWithGoogleToken(googleToken: string): Promise<AuthResponse | null> {
    const res = await apiPost<AuthResponse, { token: string }>(
        API_ENDPOINTS.auth.loginGoogle,
        { token: googleToken }
    );
    if ('error' in res) {
        notify.error(res.error);
        return null;
    }
    return res;
}