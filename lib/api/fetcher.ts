// lib/api/fetcher.ts

import { SecurityUtils } from '@/lib/utils/security';
import { createApiUrl } from '@/lib/utils/url';

function getAccessTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null; // SSR guard

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
): Promise<TResponse | { error: string }> {
    const token = getAccessTokenFromCookie();
    
    const headers: HeadersInit = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const isFormData = body instanceof FormData;

    if (!isFormData && !(headers as Record<string, string>)['Content-Type']) {
        (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    try {
        // Mã hóa endpoint để ẩn khỏi network tab
        const encryptedEndpoint = SecurityUtils.encryptEndpoint(endpoint);
        
        // Tạo URL hợp lệ sử dụng utility function
        const url = createApiUrl(encryptedEndpoint);
        
        console.log('🌐 Fetching URL:', url);
        
        // Sử dụng proxy API để ẩn backend URL
        const res = await fetch(url, {
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

        if (res.status === 204) return {} as TResponse;
        
        const contentType = res.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        const data = isJson ? await res.json() : null;

        if (!res.ok) {
            throw new Error(data?.message || res.statusText || 'Request failed');
        }

        return data as TResponse;
    } catch (error) {
        throw new Error((error as Error).message || 'Unexpected error occurred');
    }
}

// ✅ Shortcut functions
export const apiGet = <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' });
export const apiPost = <T, B>(endpoint: string, body: B) => api<T, B>(endpoint, { method: 'POST' }, body);
export const apiPut = <T, B>(endpoint: string, body: B) => api<T, B>(endpoint, { method: 'PUT' }, body);
export const apiDelete = <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' });