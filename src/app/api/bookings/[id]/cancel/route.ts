import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { offerSlotToWaitlist } from "@/lib/waitlist"
import { sendCancellationNotification } from "@/lib/whatsapp"

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookingId = params.id

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { business: true },
        })

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 })
        }

        // Verify ownership (optional but good practice)
        // In a real app, check if session.user.id owns the business of the booking
        // For now, assuming the user is logged in is enough for the prototype or check business owner

        const business = await prisma.business.findUnique({
            where: { ownerId: session.user.id as string }
        })

        if (!business || business.id !== booking.businessId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                status: "CANCELADO",
                cancelledAt: new Date(),
            },
        })

        // Trigger waitlist logic
        await offerSlotToWaitlist(updatedBooking.businessId, updatedBooking)

        // Notify customer
        await sendCancellationNotification(updatedBooking, booking.business)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Cancellation error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
