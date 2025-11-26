import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Global Middleware for Security
 * Applies security headers to all responses
 */
export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Apply Security Headers
    const securityHeaders = {
        // Prevent clickjacking
        "X-Frame-Options": "DENY",

        // Prevent MIME type sniffing
        "X-Content-Type-Options": "nosniff",

        // XSS Protection
        "X-XSS-Protection": "1; mode=block",

        // Referrer Policy
        "Referrer-Policy": "strict-origin-when-cross-origin",

        // Permissions Policy
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",

        // Content Security Policy
        "Content-Security-Policy": [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googleapis.com https://accounts.google.com",
            "frame-ancestors 'none'",
        ].join("; "),
    }

    // Apply headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
    })

    // CORS for API routes
    if (request.nextUrl.pathname.startsWith("/api")) {
        const origin = request.headers.get("origin")
        const allowedOrigins = [
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            "http://localhost:3000",
        ]

        if (origin && allowedOrigins.includes(origin)) {
            response.headers.set("Access-Control-Allow-Origin", origin)
        }

        response.headers.set(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization, X-CSRF-Token"
        )
    }

    return response
}

// Configure which routes the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
}
