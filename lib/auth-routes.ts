// ✅ 1. File cấu hình nhóm route cần auth
// file: lib/auth-routes.ts

export const protectedRoutes = [
    "/dashboard",
    "/account",
    "/profile",
    "/backend", // prefix toàn bộ group
];

export function isProtectedRoute(path: string) {
    return protectedRoutes.some((route) =>
        route.endsWith("/") ? path.startsWith(route) : path === route || path.startsWith(`${route}/`)
    );
}
