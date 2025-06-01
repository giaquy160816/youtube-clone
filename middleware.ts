// ✅ 2. Middleware kiểm tra login (Next.js middleware.ts)
// file: middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { isProtectedRoute } from "@/lib/auth-routes";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const url = req.nextUrl.clone();

    console.log('token', token);

    if (isProtectedRoute(req.nextUrl.pathname) && !token) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next|favicon.ico).*)"], // áp dụng cho tất cả route ngoài static/api
};