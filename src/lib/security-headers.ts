import { NextResponse } from "next/server"

/**
 * Security headers configuration
 * Implements best practices for web application security
 */
export const SECURITY_HEADERS = {
    // Prevent clickjacking attacks
    "X-Frame-Options": "DENY",

    // Prevent MIME type sniffing
    "X-Content-Type-Options": "nosniff",

    // Enable browser XSS protection
    "X-XSS-Protection": "1; mode=block",

    // Control referrer information
    "Referrer-Policy": "strict-origin-when-cross-origin",

    // Permissions policy (formerly Feature-Policy)
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",

    // Strict Transport Security (HTTPS only)
    // Uncomment when deploying to production with HTTPS
    // "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

    // Content Security Policy
    "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval for dev
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.googleapis.com",
        "frame-ancestors 'none'",
    ].join("; "),
} as const

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}

/**
 * Create a NextResponse with security headers
 */
export function createSecureResponse(
    body: any,
    options?: ResponseInit
): NextResponse {
    const response = NextResponse.json(body, options)
    return applySecurityHeaders(response)
}

/**
 * CORS configuration for API routes
 */
export const CORS_HEADERS = {
    "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
} as const

/**
 * Apply CORS headers to a response
 */
export function applyCorsHeaders(response: NextResponse): NextResponse {
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        response.headers.set(key, value)
    })
    return response
}
