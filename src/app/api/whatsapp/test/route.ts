import { NextResponse } from "next/server"
import { sendTemplateMessage } from "@/lib/whatsapp" // We need to export this or just use sendBookingConfirmation which uses it
import { sendWhatsAppMessage } from "@/lib/whatsapp"

// We need to expose sendTemplateMessage or similar for testing, 
// or we can just use sendWhatsAppMessage but that logs text.
// Let's modify lib/whatsapp.ts to export sendTemplateMessage or create a wrapper here.
// Actually, let's just import the logic or use sendBookingConfirmation with dummy data.

// Better: Let's update lib/whatsapp.ts to export sendTemplateMessage first.
// But I can't edit it again right now easily without another step.
// I'll copy the logic here for the test route or just use sendBookingConfirmation with a mock booking.

import { sendBookingConfirmation } from "@/lib/whatsapp"

export async function POST(req: Request) {
    try {
        const { phone } = await req.json()

        if (!phone) {
            return NextResponse.json({ error: "Phone number required" }, { status: 400 })
        }

        // Mock booking data
        const mockBooking: any = {
            clienteNome: "Test User",
            clienteWhats: phone,
            dataHora: new Date(),
        }

        const mockBusiness: any = {
            nome: "Test Business"
        }

        await sendBookingConfirmation(mockBooking, mockBusiness)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Test WhatsApp Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
