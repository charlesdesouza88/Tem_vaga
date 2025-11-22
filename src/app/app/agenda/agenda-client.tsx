"use client"

import { Booking, Servico } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarX, CheckCircle, Clock, MoreVertical } from "lucide-react"

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
                <div className="text-center py-10 text-slate-500 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <p>Nenhum agendamento para hoje.</p>
                </div>
            ) : (
                bookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                        <div className="flex items-start gap-4">
                            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg font-bold text-lg">
                                {format(new Date(booking.dataHora), "HH:mm")}
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">{booking.clienteNome}</h3>
                                <p className="text-sm text-slate-500">{booking.servico.nome} • {booking.servico.duracaoMin} min</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <StatusBadge status={booking.status} />
                                    <span className="text-xs text-slate-400">{booking.clienteWhats}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                            {booking.status === "AGENDADO" && (
                                <>
                                    <button
                                        onClick={() => handleRemind(booking)}
                                        className="text-xs font-medium text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors"
                                    >
                                        Lembrete
                                    </button>
                                    <button
                                        onClick={() => handleCancel(booking.id)}
                                        disabled={loadingId === booking.id}
                                        className="text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-md transition-colors disabled:opacity-50"
                                    >
                                        {loadingId === booking.id ? "..." : "Cancelar"}
                                    </button>
                                </>
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
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">Confirmado</span>
    }
    if (status === "CANCELADO") {
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Cancelado</span>
    }
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
}
