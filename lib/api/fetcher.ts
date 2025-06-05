// lib/api/fetcher.ts

import { API_BASE_URL } from '@/lib/api/end-points';

function getAccessTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null; // SSR không có document

    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === 'access_token') return decodeURIComponent(value);
    }
    return null;
}


export async function api<TResponse = unknown, TRequest = unknown>(
    endpoint: string,
    options: RequestInit = {},
    body?: TRequest
): Promise<TResponse> {
    const token = getAccessTokenFromCookie();

    const headers: HeadersInit = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const isFormData = body instanceof FormData;
    if (!isFormData && !(headers as Record<string, string>)['Content-Type']) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: options.method || (body ? 'POST' : 'GET'),
        headers,
        credentials: 'include',
        body: body
            ? isFormData
                ? (body as FormData)
                : JSON.stringify(body)
            : undefined,
    });

    if (!res.ok) {
        let errorMessage = 'Request failed';
        try {
            const errorData = await res.json();
            errorMessage = errorData?.message || errorMessage;
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
        throw new Error(errorMessage);
    }

    if (res.status === 204) return {} as TResponse;

    return res.json();
}

// ✅ Shortcut functions
export const apiGet = <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' });
export const apiPost = <T, B>(endpoint: string, body: B) => api<T, B>(endpoint, { method: 'POST' }, body);
export const apiPut = <T, B>(endpoint: string, body: B) => api<T, B>(endpoint, { method: 'PUT' }, body);
export const apiDelete = <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' });