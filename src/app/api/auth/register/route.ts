import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"
import { registerSchema } from "@/lib/validations"
import { hashPassword } from "@/lib/password"
import { z } from "zod"
import { rateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
import { logRequest, extractRequestInfo } from "@/lib/logger"
import { validateOrigin } from "@/lib/csrf"

export async function POST(req: Request) {
    const startTime = Date.now()
    const requestInfo = extractRequestInfo(req)

    // Validate origin (CSRF protection)
    const originValidation = validateOrigin(req)
    if (originValidation) {
        logRequest({
            ...requestInfo,
            timestamp: new Date().toISOString(),
            status: 403,
            duration: Date.now() - startTime,
            error: "Invalid origin",
        })
        return originValidation
    }

    // Apply rate limiting
    const identifier = getClientIdentifier(req)
    const rateLimitResponse = rateLimit(identifier, RATE_LIMITS.AUTH)
    if (rateLimitResponse) {
        logRequest({
            ...requestInfo,
            timestamp: new Date().toISOString(),
            status: 429,
            duration: Date.now() - startTime,
            error: "Rate limited",
        })
        return rateLimitResponse
    }

    try {
        const body = await req.json()

        // Validate input
        const validationResult = registerSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Dados inválidos",
                    details: validationResult.error.issues.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                },
                { status: 400 }
            )
        }

        const { email, password, name } = validationResult.data

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('User')
            .select('id')
            .eq('email', email)
            .single()

        if (existingUser) {
            return NextResponse.json(
                { error: "Usuário já existe com este email" },
                { status: 400 }
            )
        }

        // Hash password with bcrypt
        const passwordHash = await hashPassword(password)
        const userId = crypto.randomUUID()

        // 1. Create User
        const { error: userError } = await (supabase
            .from('User') as any)
            .insert({
                id: userId,
                email,
                passwordHash,
                name,
                updatedAt: new Date().toISOString(),
            })

        if (userError) {
            console.error("Supabase User Create Error:", userError)
            throw userError
        }

        // 2. Create Business
        const businessId = crypto.randomUUID()
        const slug = name?.toLowerCase().replace(/\s+/g, '-') || email.split('@')[0]

        const { error: businessError } = await (supabase
            .from('Business') as any)
            .insert({
                id: businessId,
                ownerId: userId,
                nome: `${name}'s Business`,
                slug: `${slug}-${crypto.randomUUID().slice(0, 4)}`, // Ensure uniqueness
                telefoneWhats: "",
                updatedAt: new Date().toISOString(),
            })

        if (businessError) {
            console.error("Supabase Business Create Error:", businessError)
            // Ideally we should rollback user creation here, but for prototype we'll skip
            throw businessError
        }

        // Log successful registration
        logRequest({
            ...requestInfo,
            timestamp: new Date().toISOString(),
            userId,
            status: 200,
            duration: Date.now() - startTime,
        })

        return NextResponse.json({
            user: { id: userId, email, name },
            message: "Usuário criado com sucesso"
        })
    } catch (error) {
        console.error("Registration error:", error)

        if (error instanceof z.ZodError) {
            logRequest({
                ...requestInfo,
                timestamp: new Date().toISOString(),
                status: 400,
                duration: Date.now() - startTime,
                error: "Validation error",
            })
            return NextResponse.json(
                { error: "Dados inválidos", details: error.issues },
                { status: 400 }
            )
        }

        logRequest({
            ...requestInfo,
            timestamp: new Date().toISOString(),
            status: 500,
            duration: Date.now() - startTime,
            error: error instanceof Error ? error.message : "Unknown error",
        })

        return NextResponse.json(
            { error: "Erro ao criar usuário. Tente novamente." },
            { status: 500 }
        )
    }
}
