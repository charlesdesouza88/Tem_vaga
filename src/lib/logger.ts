/**
 * Request Logger and Audit Trail
 * Logs important API requests for security monitoring and debugging
 */

export interface LogEntry {
    timestamp: string
    method: string
    path: string
    ip: string
    userAgent?: string
    userId?: string
    status?: number
    duration?: number
    error?: string
}

// In-memory log storage (use database or external service for production)
const requestLogs: LogEntry[] = []
const MAX_LOGS = 1000 // Keep last 1000 requests

/**
 * Log a request
 */
export function logRequest(entry: LogEntry): void {
    requestLogs.push({
        ...entry,
        timestamp: entry.timestamp || new Date().toISOString(),
    })

    // Keep only the last MAX_LOGS entries
    if (requestLogs.length > MAX_LOGS) {
        requestLogs.shift()
    }

    // In production, you would send this to:
    // - Database (Supabase, PostgreSQL)
    // - Logging service (DataDog, Sentry, CloudWatch)
    // - File system (for local development)

    // For now, just console log sensitive operations
    if (isSensitiveOperation(entry)) {
        console.log(
            `[AUDIT] ${entry.method} ${entry.path} | User: ${entry.userId || "anonymous"} | IP: ${entry.ip} | Status: ${entry.status}`
        )
    }
}

/**
 * Check if operation is sensitive and should be logged
 */
function isSensitiveOperation(entry: LogEntry): boolean {
    const sensitivePaths = [
        "/api/auth/register",
        "/api/auth/login",
        "/api/bookings/create",
        "/api/bookings/cancel",
        "/api/business/settings",
    ]

    return sensitivePaths.some(path => entry.path.includes(path))
}

/**
 * Get recent logs (for admin dashboard in future)
 */
export function getRecentLogs(limit: number = 100): LogEntry[] {
    return requestLogs.slice(-limit).reverse()
}

/**
 * Get logs for a specific user
 */
export function getUserLogs(userId: string, limit: number = 50): LogEntry[] {
    return requestLogs
        .filter(log => log.userId === userId)
        .slice(-limit)
        .reverse()
}

/**
 * Get failed requests (for security monitoring)
 */
export function getFailedRequests(limit: number = 50): LogEntry[] {
    return requestLogs
        .filter(log => log.status && log.status >= 400)
        .slice(-limit)
        .reverse()
}

/**
 * Get requests from a specific IP (for abuse detection)
 */
export function getRequestsByIP(ip: string, limit: number = 50): LogEntry[] {
    return requestLogs
        .filter(log => log.ip === ip)
        .slice(-limit)
        .reverse()
}

/**
 * Extract request information for logging
 */
export function extractRequestInfo(req: Request): {
    ip: string
    userAgent: string
    method: string
    path: string
} {
    const forwarded = req.headers.get("x-forwarded-for")
    const realIp = req.headers.get("x-real-ip")
    const cfIp = req.headers.get("cf-connecting-ip")
    const ip = forwarded?.split(",")[0] || realIp || cfIp || "unknown"

    const userAgent = req.headers.get("user-agent") || "unknown"
    const url = new URL(req.url)

    return {
        ip,
        userAgent,
        method: req.method,
        path: url.pathname,
    }
}

/**
 * Higher-order function to wrap API routes with logging
 */
export function withLogging<T extends (...args: any[]) => Promise<Response>>(
    handler: T,
    options: { logSuccess?: boolean; logErrors?: boolean } = {}
): T {
    const { logSuccess = true, logErrors = true } = options

    return (async (...args: any[]) => {
        const req = args[0] as Request
        const startTime = Date.now()
        const requestInfo = extractRequestInfo(req)

        try {
            const response = await handler(...args)
            const duration = Date.now() - startTime

            if (logSuccess) {
                logRequest({
                    ...requestInfo,
                    timestamp: new Date().toISOString(),
                    status: response.status,
                    duration,
                })
            }

            return response
        } catch (error) {
            const duration = Date.now() - startTime

            if (logErrors) {
                logRequest({
                    ...requestInfo,
                    timestamp: new Date().toISOString(),
                    status: 500,
                    duration,
                    error: error instanceof Error ? error.message : "Unknown error",
                })
            }

            throw error
        }
    }) as T
}
