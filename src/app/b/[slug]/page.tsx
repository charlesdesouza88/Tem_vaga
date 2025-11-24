import { supabaseAdmin } from "@/lib/supabase-admin"
import { notFound } from "next/navigation"
import BookingFlow from "./booking-flow"

export default async function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    // Fetch Business first
    const { data: business } = await supabaseAdmin
        .from('Business')
        .select('*')
        .eq('slug', slug)
        .single()

    if (!business) {
        notFound()
    }

    // Fetch Services and Hours separately to avoid relation issues
    const { data: servicos } = await supabaseAdmin
        .from('Servico')
        .select('*')
        .eq('businessId', business.id)
        .eq('ativo', true)

    const { data: horarios } = await supabaseAdmin
        .from('HorarioAtendimento')
        .select('*')
        .eq('businessId', business.id)
        .eq('ativo', true)

    // Attach to business object for the component
    // Attach to business object for the component
    const businessWithData = {
        ...business,
        servicos: servicos || [],
        horarios: horarios || []
    }

    return (
        <div className="min-h-screen bg-neutral-50 py-12 px-4">
            <BookingFlow business={businessWithData} />

            <div className="text-center mt-8 text-neutral-500 text-sm">
                Powered by <span className="font-bold text-primary-600">Tem_vaga</span>
            </div>
        </div>
    )
}
