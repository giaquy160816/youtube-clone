// lib/login-google.ts
import { API_BASE_URL, API_ENDPOINTS } from './api';

export async function loginWithGoogleToken(googleToken: string) {
    const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.loginGoogle}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: googleToken }),
    });

    if (!res.ok) throw new Error('Login failed');

    return await res.json(); // Có thể là JWT trả về
}