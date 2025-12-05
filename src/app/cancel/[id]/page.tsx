"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

export default function CancellationPage() {
    const params = useParams()
    const bookingId = params.id as string

    const [status, setStatus] = useState<'loading' | 'confirm' | 'success' | 'error'>('loading')
    const [bookingDetails, setBookingDetails] = useState<any>(null)

    useEffect(() => {
        fetchBooking()
    }, [])

    const fetchBooking = async () => {
        try {
            const { data, error } = await (supabase
                .from('Booking') as any)
                .select('*, servico:Servico(*), business:Business(*)')
                .eq('id', bookingId)
                .single()

            if (error || !data) throw new Error("Booking not found")

            setBookingDetails(data)
            setStatus('confirm')
        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }

    const handleCancel = async () => {
        setStatus('loading')
        try {
            // 1. Update booking status
            const { error } = await (supabase
                .from('Booking') as any)
                .update({
                    status: 'CANCELADO' as const,
                    cancelledAt: new Date().toISOString(),
                    cancellationReason: 'Cancelado pelo cliente'
                })
                .eq('id', bookingId)

            if (error) throw error

            // 2. Check Waitlist (Simplified Logic for MVP)
            // In a real production app, this would be a Supabase Edge Function or Database Trigger
            // to ensure reliability and handle the "3 minute" reservation logic.
            // Here we simulate the notification trigger.
            await checkWaitlistAndNotify(bookingDetails)

            setStatus('success')
        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }

    const checkWaitlistAndNotify = async (booking: any) => {
        // Find active waitlist entries for this business/date preference
        // This is a simplified matching logic
        const bookingDate = new Date(booking.dataHora)
        const startOfDay = new Date(bookingDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(bookingDate)
        endOfDay.setHours(23, 59, 59, 999)

        const { data: waitlist } = await (supabase
            .from('WaitlistEntry') as any)
            .select('*')
            .eq('businessId', booking.businessId)
            .eq('status', 'ATIVO')
            .gte('dataDesejada', startOfDay.toISOString())
            .lte('dataDesejada', endOfDay.toISOString())
            .order('createdAt', { ascending: true }) // First come, first served
            .limit(1)
            .single()

        if (waitlist) {
            console.log(`[WAITLIST] Notifying ${waitlist.clienteNome} (${waitlist.clienteWhats}) about free slot at ${booking.dataHora}`)

            // Update waitlist status
            await (supabase
                .from('WaitlistEntry') as any)
                .update({ status: 'OFERECIDO' as const })
                .eq('id', waitlist.id)

            // In production: Call WhatsApp API here to send the message with a link to claim the spot
        }
    }

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center bg-primary-50">Carregando...</div>
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
                <ClayCard className="text-center max-w-md w-full">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-neutral-800 mb-2">Erro ao carregar</h1>
                    <p className="text-neutral-600">Não foi possível encontrar este agendamento.</p>
                </ClayCard>
            </div>
        )
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
                <ClayCard className="text-center max-w-md w-full">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-neutral-800 mb-2">Cancelamento Confirmado</h1>
                    <p className="text-neutral-600">Seu agendamento foi cancelado com sucesso.</p>
                </ClayCard>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-50 p-4">
            <ClayCard className="max-w-md w-full text-center">
                <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-neutral-800 mb-2">Cancelar Agendamento?</h1>

                <div className="bg-neutral-50 p-4 rounded-clay-md my-6 text-left">
                    <p className="font-bold text-neutral-800">{bookingDetails.servico.nome}</p>
                    <p className="text-sm text-neutral-600 mt-1">
                        {new Date(bookingDetails.dataHora).toLocaleString('pt-BR')}
                    </p>
                    <p className="text-sm text-neutral-600 mt-1">
                        {bookingDetails.business.nome}
                    </p>
                </div>

                <p className="text-neutral-500 text-sm mb-6">
                    Ao cancelar, este horário ficará disponível para outros clientes.
                </p>

                <div className="flex flex-col gap-3">
                    <ClayButton
                        variant="primary"
                        className="w-full"
                        onClick={() => window.location.href = `/b/${bookingDetails.business.slug}?reschedule=${bookingId}`}
                    >
                        Reagendar
                    </ClayButton>

                    <div className="flex gap-3">
                        <ClayButton
                            variant="secondary"
                            className="flex-1"
                            onClick={() => window.history.back()}
                        >
                            Voltar
                        </ClayButton>
                        <ClayButton
                            variant="danger"
                            className="flex-1"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </ClayButton>
                    </div>
                </div>
            </ClayCard>
        </div>
    )
}
