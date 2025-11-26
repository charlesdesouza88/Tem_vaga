import { NextResponse } from "next/server"
import crypto from "crypto"

/**
 * CSRF Token Management
 * Protects against Cross-Site Request Forgery attacks
 */

// In-memory token storage (use database for production)
const csrfTokens = new Map<string, { token: string; expiresAt: number }>()

// Token expiration (1 hour)
const TOKEN_EXPIRATION_MS = 60 * 60 * 1000

// Clean up expired tokens every 10 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, value] of csrfTokens.entries()) {
        if (value.expiresAt < now) {
            csrfTokens.delete(key)
        }
    }
}, 10 * 60 * 1000)

/**
 * Generate a CSRF token for a session
 */
export function generateCsrfToken(sessionId: string): string {
    const token = crypto.randomBytes(32).toString("hex")

    csrfTokens.set(sessionId, {
        token,
        expiresAt: Date.now() + TOKEN_EXPIRATION_MS,
    })

    return token
}

/**
 * Verify a CSRF token
 */
export function verifyCsrfToken(sessionId: string, token: string): boolean {
    const stored = csrfTokens.get(sessionId)

    if (!stored) {
        return false
    }

    if (stored.expiresAt < Date.now()) {
        csrfTokens.delete(sessionId)
        return false
    }

    return stored.token === token
}

/**
 * Middleware to validate CSRF token
 * Use this for state-changing operations (POST, PUT, DELETE)
 */
export function validateCsrfToken(
    req: Request,
    sessionId: string
): NextResponse | null {
    // Skip CSRF check for safe methods
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return null
    }

    const token = req.headers.get("x-csrf-token")

    if (!token || !verifyCsrfToken(sessionId, token)) {
        return NextResponse.json(
            {
                error: "Token CSRF inválido ou expirado",
                code: "CSRF_TOKEN_INVALID",
            },
            { status: 403 }
        )
    }

    return null
}

/**
 * Check if request is from same origin
 * Additional protection against CSRF
 */
export function isSameOrigin(req: Request): boolean {
    const origin = req.headers.get("origin")
    const referer = req.headers.get("referer")
    const host = req.headers.get("host")

    if (!origin && !referer) {
        // Allow requests without origin/referer (like API clients)
        // In production, you might want to be stricter
        return true
    }

    const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        `http://localhost:3000`,
        `http://${host}`,
        `https://${host}`,
    ]

    if (origin) {
        return allowedOrigins.some(allowed => origin === allowed)
    }

    if (referer) {
        return allowedOrigins.some(allowed => referer.startsWith(allowed))
    }

    return false
}

/**
 * Validate origin for state-changing operations
 */
export function validateOrigin(req: Request): NextResponse | null {
    // Skip origin check for safe methods
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        return null
    }

    if (!isSameOrigin(req)) {
        console.warn(`[SECURITY] Origin validation failed for ${req.url}`)
        return NextResponse.json(
            {
                error: "Origem da requisição não autorizada",
                code: "INVALID_ORIGIN",
            },
            { status: 403 }
        )
    }

    return null
}

/**
 * Double Submit Cookie pattern (alternative to CSRF tokens)
 * Simpler approach that doesn't require server-side token storage
 */
export function generateDoubleSubmitToken(): string {
    return crypto.randomBytes(32).toString("hex")
}

export function verifyDoubleSubmitToken(
    cookieToken: string | null,
    headerToken: string | null
): boolean {
    if (!cookieToken || !headerToken) {
        return false
    }

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(cookieToken),
        Buffer.from(headerToken)
    )
}
