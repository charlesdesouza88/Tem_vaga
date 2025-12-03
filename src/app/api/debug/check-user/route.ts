import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
    try {
        const { data: user } = await (supabaseAdmin
            .from('User') as any)
            .select('*, business:Business(*)')
            .eq('email', 'supabase4@test.com')
            .single()

        if (!user) {
            return NextResponse.json({ error: "User not found" })
        }

        return NextResponse.json({ user })
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" })
    }
}
