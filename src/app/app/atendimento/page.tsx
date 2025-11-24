import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { redirect } from "next/navigation"
import AtendimentoClient from "./atendimento-client"

export default async function AtendimentoPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/login")
    }

    const { data: user } = await supabaseAdmin
        .from('User')
        .select('*, business:Business(*)')
        .eq('id', session.user.id as string)
        .single()

    if (!user?.business) {
        return <div>Erro: Business não encontrado.</div>
    }

    // Supabase returns an array for one-to-many, but Business is one-to-one.
    // However, the type might need adjustment if the client expects a specific shape.
    // For now, we pass user.business which should be the object.
    // Note: If the relation returns an array, we might need user.business[0]
    // But in Supabase JS with select('*, business:Business(*)'), if it's 1:1 it might still be an object or array depending on definition.
    // Let's assume object for now based on typical 1:1 setup, or handle array if needed.
    // Actually, for 1:1 in Supabase, it often returns an object if defined correctly, or array.
    // Let's cast it or check.

    const businessData = Array.isArray(user.business) ? user.business[0] : user.business

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Atendimento Automático</h1>
            <AtendimentoClient business={businessData} />
        </div>
    )
}
