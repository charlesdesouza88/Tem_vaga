"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Booking, Business } from "@prisma/client"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlertTriangle, CheckCircle } from "lucide-react"

export default function CancelPageClient({ booking }: { booking: Booking & { business: Business } }) {
    const [isCancelled, setIsCancelled] = useState(booking.status === "CANCELADO")
    const [loading, setLoading] = useState(false)

    const handleCancel = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/bookings/${booking.id}/public-cancel`, {
                method: "POST",
            })
            if (!res.ok) throw new Error("Erro ao cancelar")
            setIsCancelled(true)
        } catch (error) {
            alert("Erro ao cancelar agendamento")
        } finally {
            setLoading(false)
        }
    }

    if (isCancelled) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Agendamento Cancelado</h1>
                    <p className="text-slate-600">
                        Seu horário foi cancelado com sucesso. Esperamos vê-lo novamente em breve!
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full text-center">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Cancelar Horário?</h1>
                <p className="text-slate-600 mb-6">
                    Você tem certeza que deseja cancelar seu horário com <strong>{booking.business.nome}</strong> em <strong>{format(new Date(booking.dataHora), "dd/MM 'às' HH:mm")}</strong>?
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-70"
                    >
                        {loading ? "Cancelando..." : "Cancelar Horário"}
                    </button>
                    <button
                        onClick={() => window.history.back()} // Or redirect to booking page
                        className="w-full bg-white text-slate-700 border border-slate-200 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                    >
                        Manter Agendamento
                    </button>
                </div>
            </div>
        </div>
    )
}
