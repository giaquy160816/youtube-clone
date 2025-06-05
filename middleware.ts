import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/profile', '/settings'];
const guestOnlyRoutes = ['/login', '/register'];

function match(path: string, routes: string[]) {
    return routes.some(route => path.startsWith(route));
}

export function middleware(request: NextRequest) {
    console.log('🧹 request', request);
    const accessToken = request.cookies.get('access_token')?.value;
    const path = request.nextUrl.pathname;

    if (match(path, guestOnlyRoutes) && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (match(path, protectedRoutes) && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/settings/:path*',
        '/video/post/:path*',
        '/video/manage',
        '/login',
        '/register',
        '/logout',
    ],
};