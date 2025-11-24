import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { autoReplyEnabled, autoReplyConfig, endereco } = body

        const { data: user } = await supabaseAdmin
            .from('User')
            .select('*, business:Business(*)')
            .eq('id', session.user.id as string)
            .single()

        if (!user?.business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 })
        }

        // Handle business being array or object
        const businessData = Array.isArray(user.business) ? user.business[0] : user.business

        const { error: updateError } = await supabaseAdmin
            .from('Business')
            .update({
                autoReplyEnabled,
                autoReplyConfig,
                endereco,
                updatedAt: new Date().toISOString(),
            })
            .eq('id', businessData.id)

        if (updateError) {
            console.error("Settings update error:", updateError)
            throw updateError
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Settings update error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
