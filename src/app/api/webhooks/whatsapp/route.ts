import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { sendWhatsAppMessage } from "@/lib/whatsapp"

// Verify Webhook (GET)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const mode = searchParams.get("hub.mode")
    const token = searchParams.get("hub.verify_token")
    const challenge = searchParams.get("hub.challenge")

    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
        console.log("Webhook verified!")
        return new NextResponse(challenge, { status: 200 })
    }

    return new NextResponse("Forbidden", { status: 403 })
}

// Handle Incoming Messages (POST)
export async function POST(req: Request) {
    try {
        const body = await req.json()

        // Check if it's a message
        if (body.object === "whatsapp_business_account") {
            const entry = body.entry?.[0]
            const changes = entry?.changes?.[0]
            const value = changes?.value
            const message = value?.messages?.[0]

            if (message) {
                const from = message.from // User's phone number
                const text = message.text?.body?.toLowerCase() || ""

                console.log(`Received message from ${from}: ${text}`)

                // 1. Find the Business (For prototype, we pick the first one with auto-reply enabled)
                // In production, we would match value.metadata.phone_number_id with a Business column
                const { data: business } = await (supabaseAdmin
                    .from('Business') as any)
                    .select('*')
                    .eq('autoReplyEnabled', true)
                    .single()

                if (business && business.autoReplyConfig) {
                    const config = business.autoReplyConfig as Record<string, any>
                    let replyText = ""

                    // 2. Simple Keyword Logic
                    if (text.includes("agendar") || text.includes("marcar") || text.includes("horario") || text.includes("1")) {
                        // Send Booking Link
                        replyText = `Para agendar seu horário, acesse: ${process.env.NEXT_PUBLIC_APP_URL}/b/${business.slug}`
                    } else if (text.includes("endereço") || text.includes("endereco") || text.includes("onde") || text.includes("2")) {
                        // Send Address
                        replyText = config.address_response || `Estamos em: ${business.endereco}`
                    } else if (text.includes("atendente") || text.includes("falar") || text.includes("humano") || text.includes("3")) {
                        // Human Handoff
                        replyText = config.human_response || "Um atendente falará com você em breve."
                    } else {
                        // Default Greeting + Menu
                        replyText = `${config.greeting}\n\n${config.menu}`
                    }

                    // 3. Send Reply
                    if (replyText) {
                        await sendWhatsAppMessage(from, replyText)
                    }
                }
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
