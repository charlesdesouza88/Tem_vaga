import { NextResponse } from "next/server"
import { google } from "googleapis"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get("code")
    const userId = searchParams.get("state") // We passed user ID as state

    if (!code || !userId) {
        return NextResponse.json({ error: "Missing code or state" }, { status: 400 })
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
        )

        const { tokens } = await oauth2Client.getToken(code)

        if (!tokens.refresh_token) {
            console.warn("No refresh token received from Google. User might have already authorized.")
            // In production, we might want to prompt user to revoke access if we need a new refresh token.
        }

        // Get Business ID for this User
        const { data: business } = await supabaseAdmin
            .from('Business')
            .select('id')
            .eq('ownerId', userId)
            .single()

        if (!business) {
            console.error("Business not found for user:", userId)
            return NextResponse.json({ error: "Business not found" }, { status: 404 })
        }

        console.log("Saving tokens for business:", business.id)
        console.log("Has refresh token:", !!tokens.refresh_token)
        console.log("Has access token:", !!tokens.access_token)

        // Update Business with tokens
        const { error, data } = await supabaseAdmin
            .from('Business')
            .update({
                googleAccessToken: tokens.access_token,
                googleRefreshToken: tokens.refresh_token || null,
                googleTokenExpiry: tokens.expiry_date || null,
            })
            .eq('id', business.id)
            .select()

        if (error) {
            console.error("Error saving tokens:", error)
            return NextResponse.json({ error: "Failed to save tokens", details: error }, { status: 500 })
        }

        console.log("Tokens saved successfully:", data)

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/app/configuracoes?google_connected=true`)
    } catch (error) {
        console.error("Google Callback Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
