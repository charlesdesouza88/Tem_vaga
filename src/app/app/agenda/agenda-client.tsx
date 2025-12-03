"use client"

import { Database } from "@/types/supabase"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, Phone, X } from "lucide-react"

type Booking = Database['public']['Tables']['Booking']['Row']
type Servico = Database['public']['Tables']['Servico']['Row']

type BookingWithService = Booking & { servico: Servico }

export default function AgendaClient({ bookings }: { bookings: BookingWithService[] }) {
    const router = useRouter()
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handleCancel = async (id: string) => {
        if (!confirm("Tem certeza que deseja cancelar este agendamento?")) return

        setLoadingId(id)
        try {
            const res = await fetch(`/api/bookings/${id}/cancel`, {
                method: "POST",
            })
            if (!res.ok) throw new Error("Erro ao cancelar")
            router.refresh()
        } catch (error) {
            alert("Erro ao cancelar agendamento")
        } finally {
            setLoadingId(null)
        }
    }

    const handleRemind = (booking: BookingWithService) => {
        alert(`Lembrete simulado enviado para ${booking.clienteNome} (${booking.clienteWhats})`)
    }

    return (
        <div className="space-y-4">
            {bookings.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-neutral-50 to-white rounded-2xl border-2 border-neutral-200 shadow-sm">
                    <Calendar className="mx-auto mb-4 text-neutral-500" size={64} strokeWidth={1.5} />
                    <p className="text-neutral-800 font-semibold text-lg">Nenhum agendamento para hoje</p>
                    <p className="text-neutral-600 text-sm mt-2">Novos agendamentos aparecerão aqui automaticamente</p>
                </div>
            ) : (
                bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            {/* Left: Time & Info */}
                            <div className="flex items-start gap-4">
                                <div className="bg-primary-100 text-primary-700 px-4 py-3 rounded-xl font-bold text-xl min-w-[80px] text-center">
                                    {format(new Date(booking.dataHora), "HH:mm")}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-neutral-900 text-lg mb-1">{booking.clienteNome}</h3>
                                    <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                                        <Clock size={16} />
                                        <span>{booking.servico.nome} • {booking.servico.duracaoMin} min</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={booking.status} />
                                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                                            <Phone size={14} />
                                            <span>{booking.clienteWhats}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            {booking.status === "AGENDADO" && (
                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    <button
                                        onClick={() => handleRemind(booking)}
                                        className="px-4 py-2 bg-primary-600 text-white font-semibold text-sm rounded-xl hover:bg-primary-700 shadow-md hover:shadow-lg transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 active:scale-95"
                                    >
                                        Lembrete
                                    </button>
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        disabled={loadingId === booking.id}
                                        className="px-4 py-2 bg-red-600 text-white font-semibold text-sm rounded-xl hover:bg-red-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-300 active:scale-95"
                                    >
                                        {loadingId === booking.id ? "..." : "Cancelar"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === "AGENDADO") {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-green-600 text-white shadow-sm">
                Confirmado
            </span>
        )
    }
    if (status === "CANCELADO") {
        return (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-red-600 text-white shadow-sm">
                Cancelado
            </span>
        )
    }
    return (
        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-neutral-600 text-white shadow-sm">
            {status}
        </span>
    )
}
