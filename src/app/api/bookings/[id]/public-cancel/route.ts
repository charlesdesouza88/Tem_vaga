import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { offerSlotToWaitlist } from "@/lib/waitlist"
import { sendCancellationNotification } from "@/lib/whatsapp"

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const bookingId = params.id

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { business: true },
        })

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 })
        }

        // In a real app, we would verify a token here to ensure secure cancellation
        // For prototype, we assume possession of the link (ID) is enough

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: "CANCELADO",
                cancelledAt: new Date(),
            },
        })

        // Trigger waitlist logic
        await offerSlotToWaitlist(updatedBooking.businessId, updatedBooking)

        // Notify business owner (optional, but good)
        // Notify customer (confirmation)
        await sendCancellationNotification(updatedBooking, booking.business)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Cancellation error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
