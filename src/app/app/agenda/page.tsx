"use client"

import { useState, useEffect } from "react"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { Database } from "@/types/supabase"
import { format, addDays, subDays, isSameDay, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Clock, User, Phone, Calendar as CalendarIcon } from "lucide-react"

type Booking = Database['public']['Tables']['Booking']['Row'] & {
    servico: Database['public']['Tables']['Servico']['Row']
}

export default function AgendaPage() {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBookings()
    }, [selectedDate])

    const fetchBookings = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`/api/bookings?date=${selectedDate.toISOString()}`)
            if (response.ok) {
                const data = await response.json()
                setBookings(data.bookings || [])
            }
        } catch (error) {
            console.error("Error fetching bookings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1))
    const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1))
    const handleToday = () => setSelectedDate(new Date())

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Agenda</h1>
                    <p className="text-neutral-500">Gerencie seus agendamentos do dia</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-clay-md shadow-clay-sm">
                    <button
                        onClick={handlePrevDay}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-2 px-4 font-bold text-neutral-800 min-w-[180px] justify-center">
                        <CalendarIcon size={18} className="text-primary-500" />
                        {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
                    </div>
                    <button
                        onClick={handleNextDay}
                        className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                    <button
                        onClick={handleToday}
                        className="ml-2 px-3 py-1 text-xs font-bold text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
                    >
                        Hoje
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {bookings.length === 0 && !isLoading ? (
                    <div className="text-center py-16 bg-white rounded-clay-lg border-2 border-dashed border-neutral-200">
                        <CalendarIcon className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                        <h3 className="text-lg font-medium text-neutral-900">Agenda vazia</h3>
                        <p className="text-neutral-500">Nenhum agendamento para este dia.</p>
                    </div>
                ) : (
                    bookings.map(booking => (
                        <ClayCard key={booking.id} variant="hover" className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {/* Time Column */}
                            <div className="flex flex-col items-center min-w-[80px] bg-primary-50 rounded-xl p-3 border border-primary-100">
                                <span className="text-xl font-bold text-primary-700">
                                    {format(parseISO(booking.dataHora), "HH:mm")}
                                </span>
                                <span className="text-xs font-medium text-primary-500">
                                    {booking.servico.duracaoMin} min
                                </span>
                            </div>

                            {/* Info Column */}
                            <div className="flex-1 space-y-1">
                                <h3 className="text-lg font-bold text-neutral-800">{booking.clienteNome}</h3>
                                <p className="text-neutral-600 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                                    {booking.servico.nome}
                                </p>
                            </div>

                            {/* Contact Column */}
                            <div className="flex items-center gap-2 text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg">
                                <Phone size={16} />
                                <span className="text-sm font-medium">{booking.clienteWhats}</span>
                            </div>

                            {/* Status Badge */}
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                                ${booking.status === 'AGENDADO' ? 'bg-green-100 text-green-700' :
                                    booking.status === 'CANCELADO' ? 'bg-red-100 text-red-700' :
                                        'bg-neutral-100 text-neutral-700'}`
                            }>
                                {booking.status}
                            </div>
                        </ClayCard>
                    ))
                )}
            </div>
        </div>
    )
}
