import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check for Laravel session cookie only for authentication
    const hasSession = request.cookies.has("laravel-session") || request.cookies.has("laravel_session");

    if (process.env.NODE_ENV === "development") {
        const cookiesCount = request.cookies.getAll().length;
        console.log(`[Proxy] ${path} check - hasSession: ${hasSession}, Cookies: ${cookiesCount}`);
        if (hasSession) {
            console.log(`[Proxy] laravel-session present: ${request.cookies.get("laravel-session")?.value.substring(0, 10)}...`);
        }
    }

    // 1. Protect private routes
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    if (isProtectedRoute && !hasSession) {
        if (process.env.NODE_ENV === "development") {
            console.log(`[Proxy] Redirecting to /login from ${path}`);
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Redirect authenticated users away from auth pages (login/register) to dashboard
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));
    if (isAuthRoute && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 3. Redirect authenticated users from homepage to dashboard
    if (path === "/" && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const response = NextResponse.next();

    // Add security headers (these complement the ones in next.config.ts)
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    return response;
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
