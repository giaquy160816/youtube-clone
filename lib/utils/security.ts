// lib/utils/security.ts

// Utility để mã hóa và ẩn thông tin nhạy cảm
export class SecurityUtils {
    private static readonly ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-32-chars-long!!';
    
    // Mã hóa endpoint để ẩn khỏi network tab
    static encryptEndpoint(endpoint: string): string {
        try {
            const [path, queryString] = endpoint.split('?');
            const encryptedPath = path
                .replace(/^\/video$/, '/v')
                .replace(/^\/video\//, '/v/')
                .replace(/^\/backend\//, '/b/')
                .replace(/^\/api\//, '/a/')
                .replace(/^\/auth\//, '/u/')
                .replace(/^\/user\//, '/usr/')
                .replace(/^\/common\//, '/c/')
                .replace(/^\/comment$/, '/cmt')
                .replace(/^\/comment\//, '/cmt/')
                .replace(/^\/playlists/, '/b/pl')
                .replace(/^\/playlist-video/, '/b/plv');

            const encrypted = queryString ? `${encryptedPath}?${queryString}` : encryptedPath;
            // console.log('🔐 Encrypting endpoint:', endpoint, '→', encrypted);
            return encrypted;
        } catch (error) {
            console.warn('Encryption failed, using original endpoint:', error);
            return endpoint;
        }
    }
    
    // Giải mã endpoint
    static decryptEndpoint(encryptedEndpoint: string): string {
        try {
            const [path, queryString] = encryptedEndpoint.split('?');
            // Thêm dấu '/' vào đầu path nếu chưa có để đảm bảo logic replace hoạt động
            const normalizedPath = path.startsWith('/') ? path : `/${path}`;

            const decryptedPath = normalizedPath
                .replace(/^\/v$/, '/video')
                .replace(/^\/v\//, '/video/')
                .replace(/^\/b\//, '/backend/')
                .replace(/^\/a\//, '/api/')
                .replace(/^\/u\//, '/auth/')
                .replace(/^\/usr\//, '/user/')
                .replace(/^\/c\//, '/common/')
                .replace(/^\/cmt$/, '/comment')
                .replace(/^\/cmt\//, '/comment/')
                .replace(/^\/b\/pl/, '/playlists')
                .replace(/^\/b\/plv/, '/playlist-video');

            const decrypted = queryString ? `${decryptedPath}?${queryString}` : decryptedPath;

            // console.log('🔓 Decrypting endpoint:', `(${encryptedEndpoint})`, '→', decrypted);
            return decrypted;
        } catch (error) {
            console.warn('Decryption failed, using encrypted endpoint:', error);
            return encryptedEndpoint;
        }
    }
    
    // Tạo request ID ngẫu nhiên để ẩn thông tin
    static generateRequestId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    // Ẩn thông tin trong headers
    static sanitizeHeaders(headers: HeadersInit): HeadersInit {
        const sanitized: HeadersInit = {};
        
        Object.entries(headers).forEach(([key, value]) => {
            if (key.toLowerCase() === 'authorization') {
                sanitized[key] = 'Bearer ***';
            } else {
                sanitized[key] = value;
            }
        });
        
        return sanitized;
    }
    
    // Tạo fake endpoint để ẩn endpoint thật
    static createFakeEndpoint(realEndpoint: string): string {
        const fakeEndpoints: Record<string, string> = {
            '/backend/auth/login': '/auth/login',
            '/backend/auth/login-google-supabase': '/auth/google',
            '/backend/auth/refresh-token': '/auth/refresh',
            '/backend/auth/logout': '/auth/logout',
            '/video': '/content/videos',
            '/backend/user/me': '/user/profile',
            '/backend/video/me': '/user/videos',
            '/backend/video': '/user/upload',
            '/backend/like': '/user/like',
            '/backend/watched': '/user/history',
        };
        
        return fakeEndpoints[realEndpoint] || realEndpoint;
    }
    
    // Kiểm tra xem path có phải là file upload không
    static isUploadFile(path: string): boolean {
        return path.startsWith('uploads/') || 
               path.includes('/uploads/') || 
               path.includes('uploads/') ||
               /\.(jpg|jpeg|png|gif|webp|mp4|avi|mov|wmv|flv|mkv|pdf|doc|docx)$/i.test(path);
    }
    
    // Lấy route phù hợp cho path
    static getRouteForPath(path: string): string {
        if (this.isUploadFile(path)) {
            return '/api/static';
        }
        return '/api/proxy';
    }
} 