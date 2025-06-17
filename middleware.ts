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
        '/me/:path*',
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