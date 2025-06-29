// lib/api/fetcher.ts

import { SecurityUtils } from '@/lib/utils/security';
import { createApiUrl } from '@/lib/utils/url';
import { clearAuthData } from '@/lib/utils/auth';
import { API_ENDPOINTS } from '@/lib/api/end-points';
import type { AuthResponse } from '@/types/auth';

let isRefreshing = false;
let refreshPromise: Promise<AuthResponse> | null = null;

async function refreshToken() {
    // Gọi refresh token qua proxy API
    const encryptedEndpoint = SecurityUtils.encryptEndpoint(API_ENDPOINTS.auth.refreshToken);
    const url = createApiUrl(encryptedEndpoint);
    const res = await fetch(url, {
        method: 'GET',
        credentials: 'include',
    });
    if (!res.ok) throw new Error('Refresh token failed');
    const data = await res.json();
    if (!data.accessToken || !data.user) throw new Error('Refresh token failed');
    // Lưu lại token mới
    localStorage.setItem('user_info', JSON.stringify(data.user));
    const expiredAt = data.expiresIn || 3600;
    const expiryTime = Date.now() + expiredAt * 1000;
    localStorage.setItem('user_expired', expiryTime.toString());
    document.cookie = `access_token=${data.accessToken}; path=/;`;
    document.cookie = `user_info=${encodeURIComponent(JSON.stringify(data.user))}; path=/;`;
    window.dispatchEvent(new CustomEvent('cookieChange'));
    return data;
}

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
    body?: TRequest,
    _retry = false
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
        
        // console.log('🌐 Fetching URL:', url);
        
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

        if (res.status === 401 || res.status === 403) {
            // Nếu chưa thử refresh, thử refresh token
            if (!_retry) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = refreshToken();
                }
                try {
                    await refreshPromise;
                    isRefreshing = false;
                    refreshPromise = null;
                    // Retry lại request gốc với token mới
                    return await api(endpoint, options, body, true);
                } catch {
                    isRefreshing = false;
                    refreshPromise = null;
                    clearAuthData();
                    throw new Error('Token Expired');
                }
            } else {
                clearAuthData();
                throw new Error('Token Expired');
            }
        }

        if (res.status === 204) return {} as TResponse;
        
        const contentType = res.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        const data = isJson ? await res.json() : null;

        if (!res.ok) {
            // Nếu backend trả về lỗi Token Expired
            if ((data?.message === 'Token Expired' || data?.error === 'Token Expired') && !_retry) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshPromise = refreshToken();
                }
                try {
                    await refreshPromise;
                    isRefreshing = false;
                    refreshPromise = null;
                    return await api(endpoint, options, body, true);
                } catch {
                    isRefreshing = false;
                    refreshPromise = null;
                    clearAuthData();
                    throw new Error('Token Expired');
                }
            }
            throw new Error(data?.message || res.statusText || 'Request failed');
        }
        return data as TResponse;
    } catch (error: unknown) {
        console.log('error', error);
        throw new Error((error as Error).message || 'Unexpected error occurred');
    }
}

// ✅ Shortcut functions
export const apiGet = <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' });
export const apiPost = <T, B>(endpoint: string, body: B) => api<T, B>(endpoint, { method: 'POST' }, body);
export const apiPut = <T, B>(endpoint: string, body: B) => api<T, B>(endpoint, { method: 'PUT' }, body);
export const apiDelete = <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' });