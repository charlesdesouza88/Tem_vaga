import { NextResponse } from "next/server"

// Simple in-memory rate limiter
// For production, use Redis or a database
interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries every 10 minutes
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key)
        }
    }
}, 10 * 60 * 1000)

interface RateLimitConfig {
    maxRequests: number
    windowMs: number
    message?: string
}

/**
 * Rate limiter middleware
 * @param identifier - Unique identifier for the client (IP, user ID, etc)
 * @param config - Rate limit configuration
 * @returns NextResponse if rate limited, null if allowed
 */
export function rateLimit(
    identifier: string,
    config: RateLimitConfig
): NextResponse | null {
    const now = Date.now()
    const entry = rateLimitStore.get(identifier)

    if (!entry || entry.resetTime < now) {
        // First request or window expired - create new entry
        rateLimitStore.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs,
        })
        return null
    }

    if (entry.count >= config.maxRequests) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
        return NextResponse.json(
            {
                error: config.message || "Muitas requisições. Tente novamente mais tarde.",
                retryAfter,
            },
            {
                status: 429,
                headers: {
                    "Retry-After": retryAfter.toString(),
                    "X-RateLimit-Limit": config.maxRequests.toString(),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": entry.resetTime.toString(),
                },
            }
        )
    }

    // Increment count
    entry.count++
    return null
}

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(req: Request): string {
    // Try to get IP from various headers
    const forwarded = req.headers.get("x-forwarded-for")
    const realIp = req.headers.get("x-real-ip")
    const cfIp = req.headers.get("cf-connecting-ip")

    const ip = forwarded?.split(",")[0] || realIp || cfIp || "unknown"
    return ip
}

// Preset configurations
export const RATE_LIMITS = {
    // Auth endpoints - stricter limits
    AUTH: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
        message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    },
    // API endpoints - moderate limits
    API: {
        maxRequests: 100,
        windowMs: 15 * 60 * 1000, // 15 minutes
    },
    // Public booking - lenient limits
    PUBLIC: {
        maxRequests: 30,
        windowMs: 15 * 60 * 1000, // 15 minutes
    },
} as const
