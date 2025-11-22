import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import AgendaClient from "./agenda-client"
import Link from "next/link"

export default async function AgendaPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/login")
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id as string },
        include: { business: true },
    })

    if (!user?.business) {
        return <div>Erro: Business não encontrado.</div>
    }

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0))
    const endOfDay = new Date(today.setHours(23, 59, 59, 999))

    const bookings = await prisma.booking.findMany({
        where: {
            businessId: user.business.id,
            dataHora: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
        include: {
            servico: true,
        },
        orderBy: {
            dataHora: "asc",
        },
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Olá, {user.name?.split(" ")[0]}
                    </h1>
                    <p className="text-slate-600">
                        Hoje é {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                    </p>
                </div>
                <Link
                    href="/app/agenda/full"
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    Ver agenda completa
                </Link>
            </div>

            <AgendaClient bookings={bookings} />
        </div>
    )
}
