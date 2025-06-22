// lib/utils/get-full-path.ts
import { SecurityUtils } from './security';
import { createStaticUrl } from './url';

const getFullPath = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // Sử dụng SecurityUtils để xác định route phù hợp
    const route = SecurityUtils.getRouteForPath(path);
    if (route === '/api/static') {
        return createStaticUrl(path);
    }
    
    // Fallback cho các trường hợp khác
    return createStaticUrl(path);
};

export default getFullPath;
