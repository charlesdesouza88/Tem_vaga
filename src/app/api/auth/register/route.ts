import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('User')
            .select('id')
            .eq('email', email)
            .single()

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        const passwordHash = password // TEMPORARY: Plain text for prototype
        const userId = crypto.randomUUID()

        // 1. Create User
        const { error: userError } = await supabase
            .from('User')
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

        const { error: businessError } = await supabase
            .from('Business')
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

        return NextResponse.json({ user: { id: userId, email, name } })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}
