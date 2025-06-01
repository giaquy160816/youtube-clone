import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Các route cần bảo vệ (chỉ cho phép đã đăng nhập)
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Các route chỉ cho phép nếu chưa login
const guestOnlyRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const pathname = request.nextUrl.pathname;

    // Nếu đang login mà vào /login thì redirect về dashboard
    if (guestOnlyRoutes.includes(pathname) && accessToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Nếu vào route cần auth mà chưa có token → redirect login
    if (protectedRoutes.includes(pathname) && !accessToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Cho phép tiếp tục
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/profile', '/settings', '/login', '/register'],
};