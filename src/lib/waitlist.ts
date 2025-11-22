import { prisma } from "@/lib/prisma"
import { Booking, WaitlistStatus } from "@prisma/client"
import { sendWaitlistOffer } from "./whatsapp"

export async function offerSlotToWaitlist(businessId: string, cancelledBooking: Booking) {
    console.log("Checking waitlist for business", businessId, "and date", cancelledBooking.dataHora)

    // Find the earliest WaitlistEntry with:
    // same businessId
    // status = ATIVO
    // dataDesejada same day as cancelledBooking.dataHora

    const startOfDay = new Date(cancelledBooking.dataHora)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(cancelledBooking.dataHora)
    endOfDay.setHours(23, 59, 59, 999)

    const entry = await prisma.waitlistEntry.findFirst({
        where: {
            businessId,
            status: "ATIVO",
            dataDesejada: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        orderBy: {
            createdAt: 'asc',
        },
        include: {
            business: true
        }
    })

    if (entry) {
        console.log("Would notify", entry.clienteNome, "about new slot", cancelledBooking.dataHora)

        // Update entry status to OFERECIDO
        await prisma.waitlistEntry.update({
            where: { id: entry.id },
            data: { status: "OFERECIDO" },
        })

        // Send notification
        await sendWaitlistOffer(entry, cancelledBooking, entry.business)
    } else {
        console.log("No waitlist entries found for this slot.")
    }
}
