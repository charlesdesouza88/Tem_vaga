import { NextResponse } from "next/server"
import { ZodError } from "zod"

/**
 * Standard Error Response Format
 */
export interface ErrorResponse {
    error: string
    code?: string
    details?: any
    timestamp: string
}

/**
 * Error codes for consistent error handling
 */
export const ERROR_CODES = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED",
    AUTHORIZATION_FAILED: "AUTHORIZATION_FAILED",
    RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND",
    RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
    CSRF_TOKEN_INVALID: "CSRF_TOKEN_INVALID",
    INVALID_ORIGIN: "INVALID_ORIGIN",
    DATABASE_ERROR: "DATABASE_ERROR",
    EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
    INTERNAL_ERROR: "INTERNAL_ERROR",
} as const

/**
 * Create a standardized error response
 */
export function createErrorResponse(
    message: string,
    code?: string,
    status: number = 500,
    details?: any
): NextResponse {
    const response: ErrorResponse = {
        error: message,
        timestamp: new Date().toISOString(),
    }

    if (code) {
        response.code = code
    }

    if (details) {
        response.details = details
    }

    return NextResponse.json(response, { status })
}

/**
 * Handle Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse {
    return createErrorResponse(
        "Dados inválidos",
        ERROR_CODES.VALIDATION_ERROR,
        400,
        error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
        }))
    )
}

/**
 * Handle database errors
 */
export function handleDatabaseError(error: any): NextResponse {
    console.error("[DATABASE ERROR]", error)

    // Don't expose internal database errors to clients
    return createErrorResponse(
        "Erro ao processar sua solicitação",
        ERROR_CODES.DATABASE_ERROR,
        500
    )
}

/**
 * Handle authentication errors
 */
export function handleAuthError(message: string = "Autenticação falhou"): NextResponse {
    return createErrorResponse(
        message,
        ERROR_CODES.AUTHENTICATION_FAILED,
        401
    )
}

/**
 * Handle authorization errors
 */
export function handleAuthorizationError(
    message: string = "Você não tem permissão para acessar este recurso"
): NextResponse {
    return createErrorResponse(
        message,
        ERROR_CODES.AUTHORIZATION_FAILED,
        403
    )
}

/**
 * Handle not found errors
 */
export function handleNotFoundError(
    resource: string = "Recurso"
): NextResponse {
    return createErrorResponse(
        `${resource} não encontrado`,
        ERROR_CODES.RESOURCE_NOT_FOUND,
        404
    )
}

/**
 * Handle rate limit errors
 */
export function handleRateLimitError(retryAfter?: number): NextResponse {
    const response = createErrorResponse(
        "Muitas requisições. Tente novamente mais tarde.",
        ERROR_CODES.RATE_LIMIT_EXCEEDED,
        429,
        retryAfter ? { retryAfter } : undefined
    )

    if (retryAfter) {
        response.headers.set("Retry-After", retryAfter.toString())
    }

    return response
}

/**
 * Generic error handler - determines error type and returns appropriate response
 */
export function handleApiError(error: unknown): NextResponse {
    console.error("[API ERROR]", error)

    // Zod validation error
    if (error instanceof ZodError) {
        return handleZodError(error)
    }

    // Database error (Supabase/PostgreSQL)
    if (
        error &&
        typeof error === "object" &&
        ("code" in error || "detail" in error)
    ) {
        return handleDatabaseError(error)
    }

    // Standard Error object
    if (error instanceof Error) {
        // Check for specific error messages
        if (error.message.includes("not found")) {
            return handleNotFoundError()
        }

        if (error.message.includes("unauthorized")) {
            return handleAuthError()
        }

        // Generic error
        return createErrorResponse(
            "Erro ao processar sua solicitação",
            ERROR_CODES.INTERNAL_ERROR,
            500
        )
    }

    // Unknown error type
    return createErrorResponse(
        "Erro desconhecido",
        ERROR_CODES.INTERNAL_ERROR,
        500
    )
}

/**
 * Try-catch wrapper for API routes
 * Automatically handles errors and logging
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<Response>>(
    handler: T
): T {
    return (async (...args: any[]) => {
        try {
            return await handler(...args)
        } catch (error) {
            return handleApiError(error)
        }
    }) as T
}
