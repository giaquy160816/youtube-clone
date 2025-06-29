// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { PATH } from '@/lib/constants/paths';

const protectedRoutes = Object.values(PATH.ME).filter((v): v is string => typeof v === 'string');
console.log('protectedRoutes', protectedRoutes);
const guestOnlyRoutes = ['/login', '/register'];

function match(path: string, routes: string[]) {
    return routes.some(route => path.startsWith(route));
}

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const path = request.nextUrl.pathname;

    // Bảo vệ API proxy routes với security headers
    if (path.startsWith('/api/proxy')) {
        const response = NextResponse.next();
        
        // Ẩn thông tin server
        response.headers.set('Server', 'Next.js');
        response.headers.set('X-Powered-By', 'Next.js');
        
        // Bảo vệ khỏi XSS
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        
        return response;
    }

    // Xử lý static files với cache headers
    if (path.startsWith('/api/static')) {
        const response = NextResponse.next();
        
        // Thêm cache headers cho static files
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
        
        return response;
    }

    // Bảo vệ các API routes khác
    if (path.startsWith('/api/')) {
        const response = NextResponse.next();
        
        // Thêm security headers cho tất cả API routes
        response.headers.set('X-Content-Type-Options', 'nosniff');
        response.headers.set('X-Frame-Options', 'DENY');
        response.headers.set('X-XSS-Protection', '1; mode=block');
        
        return response;
    }

    // Xử lý authentication cho các routes khác
    if (match(path, guestOnlyRoutes) && accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (match(path, protectedRoutes) && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/me/:path*',
        '/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/video/post/:path*',
        '/video/manage',
        '/login',
        '/register',
        '/logout',
        '/api/:path*',
    ],
};