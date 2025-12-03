import { NextResponse } from "next/server"
import { sendWhatsAppMessage, sendBookingConfirmation } from "@/lib/whatsapp"

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
