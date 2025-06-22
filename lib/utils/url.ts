/**
 * Utility để tạo URL hợp lệ cho cả client và server
 */
export function createApiUrl(path: string): string {
    const API_BASE_URL = '/api/proxy';
    
    // Luôn sử dụng absolute URL cho fetch
    if (typeof window !== 'undefined') {
        // Client-side: sử dụng window.location.origin
        return `${window.location.origin}${API_BASE_URL}${path}`;
    } else {
        // Server-side: sử dụng process.env.NEXT_PUBLIC_APP_URL hoặc fallback
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        return `${baseUrl}${API_BASE_URL}${path}`;
    }
}

/**
 * Utility để tạo static file URL
 */
export function createStaticUrl(path: string): string {
    const STATIC_BASE_URL = '/api/static';
    
    if (typeof window !== 'undefined') {
        return `${window.location.origin}${STATIC_BASE_URL}/${path}`;
    } else {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        return `${baseUrl}${STATIC_BASE_URL}/${path}`;
    }
}

/**
 * Utility để kiểm tra xem URL có hợp lệ không
 */
export function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
} 