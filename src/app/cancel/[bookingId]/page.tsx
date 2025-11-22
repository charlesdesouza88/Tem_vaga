import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CancelPageClient from "./cancel-client"

export default async function CancelPage({ params }: { params: { bookingId: string } }) {
    const booking = await prisma.booking.findUnique({
        where: { id: params.bookingId },
        include: { business: true },
    })

    if (!booking) {
        notFound()
    }

    return <CancelPageClient booking={booking} />
}
