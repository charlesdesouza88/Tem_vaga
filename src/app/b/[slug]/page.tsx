import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import BookingFlow from "./booking-flow"

export default async function PublicBookingPage({ params }: { params: { slug: string } }) {
    const business = await prisma.business.findUnique({
        where: { slug: params.slug },
        include: {
            servicos: {
                where: { ativo: true }
            },
            horarios: {
                where: { ativo: true }
            }
        }
    })

    if (!business) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4">
            <BookingFlow business={business} />

            <div className="text-center mt-8 text-slate-400 text-sm">
                Agendamento via <span className="font-bold text-slate-500">AgendamentoFácil</span>
            </div>
        </div>
    )
}
