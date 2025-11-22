import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import AtendimentoClient from "./atendimento-client"

export default async function AtendimentoPage() {
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

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Atendimento Automático</h1>
            <AtendimentoClient business={user.business} />
        </div>
    )
}
