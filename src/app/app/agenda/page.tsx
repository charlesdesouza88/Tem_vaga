import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
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

    const { data: user } = await supabaseAdmin
        .from('User')
        .select('*, business:Business(*)')
        .eq('id', session.user?.id as string)
        .single()

    if (!user?.business) {
        return <div>Erro: Business não encontrado.</div>
    }

    // Handle business being array or object
    const businessData = Array.isArray(user.business) ? user.business[0] : user.business

    const today = new Date()
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString()

    const { data: bookings } = await supabaseAdmin
        .from('Booking')
        .select('*, servico:Servico(*)')
        .eq('businessId', businessData.id)
        .gte('dataHora', startOfDay)
        .lte('dataHora', endOfDay)
        .order('dataHora', { ascending: true })



    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
                <h1 className="text-3xl font-bold text-neutral-900">
                    Olá, {user.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-neutral-600 mt-1">
                    Hoje é {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
            </div>

            <AgendaClient bookings={bookings as any || []} />
        </div>
    )
}
