import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    // Get the pathname of the request
    const path = request.nextUrl.pathname;

    // Define public paths that don't require authentication
    const isPublicPath = path === "/login" || path === "/";

    // Get token from cookies (if using cookie-based auth)
    // For Laravel Sanctum SPA auth, the session cookie is httpOnly
    // so we can't read it directly, but we can check if user is authenticated
    // by making a request to the API

    // For now, we'll just add security headers
    // Authentication is handled by the ProtectedRoute component

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
