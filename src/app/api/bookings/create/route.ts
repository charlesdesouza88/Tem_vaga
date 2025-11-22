import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { sendBookingConfirmation } from "@/lib/whatsapp"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { businessId, servicoId, dataHora, clienteNome, clienteWhats, joinWaitlist } = body

        if (!businessId || !servicoId || !dataHora || !clienteNome || !clienteWhats) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        // Create Booking
        const booking = await prisma.booking.create({
            data: {
                businessId,
                servicoId,
                clienteNome,
                clienteWhats,
                dataHora: new Date(dataHora),
                status: "AGENDADO",
            },
            include: {
                business: true,
                servico: true
            }
        })

        // Handle Waitlist
        if (joinWaitlist) {
            await prisma.waitlistEntry.create({
                data: {
                    businessId,
                    clienteNome,
                    clienteWhats,
                    dataDesejada: new Date(dataHora), // Ideally this would be the *desired* date, which might be different if they booked a later slot?
                    // For the prototype, let's assume they booked a slot but want an earlier one on the same day or just want to be on the list.
                    // The prompt says: "Checkbox: “Quero entrar na fila se abrir horário mais cedo.”"
                    // So we use the same date.
                    bookingId: booking.id,
                    status: "ATIVO",
                }
            })
        }

        // Send Confirmation
        await sendBookingConfirmation(booking, booking.business)

        return NextResponse.json({ booking })
    } catch (error) {
        console.error("Booking error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
