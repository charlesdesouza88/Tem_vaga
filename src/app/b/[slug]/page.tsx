"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { ClayInput } from "@/components/ui/clay-input"
import { supabase } from "@/lib/supabase"
import { Database } from "@/types/supabase"
import { format, addDays, isSameDay, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock, Check, ChevronRight, ChevronLeft, Store, RefreshCw } from "lucide-react"

type Business = Database['public']['Tables']['Business']['Row']
type Service = Database['public']['Tables']['Servico']['Row']
type WorkingHour = Database['public']['Tables']['HorarioAtendimento']['Row']

export default function BookingPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const slug = params.slug as string
    const rescheduleId = searchParams.get('reschedule')

    const [step, setStep] = useState(1)
    const [business, setBusiness] = useState<Business | null>(null)
    const [services, setServices] = useState<Service[]>([])
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [clientData, setClientData] = useState({ name: "", whatsapp: "" })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [oldBooking, setOldBooking] = useState<any>(null)

    useEffect(() => {
        fetchBusinessData()
    }, [slug])

    useEffect(() => {
        if (rescheduleId && business) {
            fetchOldBooking()
        }
    }, [rescheduleId, business])

    useEffect(() => {
        if (selectedDate && selectedService && business) {
            calculateAvailability()
        }
    }, [selectedDate, selectedService, business])

    const fetchOldBooking = async () => {
        try {
            if (!rescheduleId) return
            const { data, error } = await (supabase
                .from('Booking') as any)
                .select('*, servico:Servico(*)')
                .eq('id', rescheduleId)
                .single()

            if (data) {
                setOldBooking(data)
                setClientData({
                    name: data.clienteNome,
                    whatsapp: data.clienteWhats
                })
                // Pre-select service if it belongs to this business
                if (data.servico && data.servico.businessId === business?.id) {
                    setSelectedService(data.servico)
                    // Don't auto-advance to step 2, let them confirm service or change it
                }
            }
        } catch (error) {
            console.error("Error fetching old booking:", error)
        }
    }

    const fetchBusinessData = async () => {
        try {
            const { data: businessData } = await (supabase
                .from('Business') as any)
                .select('*')
                .eq('slug', slug)
                .single()

            if (businessData) {
                setBusiness(businessData)

                const { data: servicesData } = await (supabase
                    .from('Servico') as any)
                    .select('*')
                    .eq('businessId', (businessData as any).id)
                    .eq('ativo', true)

                if (servicesData) setServices(servicesData)
            }
        } catch (error) {
            console.error("Error fetching business:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const calculateAvailability = async () => {
        if (!business || !selectedDate || !selectedService) return

        // 1. Get working hours for the day
        const dayOfWeek = selectedDate.getDay()
        const { data: hours } = await (supabase
            .from('HorarioAtendimento') as any)
            .select('*')
            .eq('businessId', (business as any).id)
            .eq('diaSemana', dayOfWeek)
            .eq('ativo', true)
            .single()

        if (!hours) {
            setAvailableSlots([])
            return
        }

        // 2. Get existing bookings
        const startOfDay = new Date(selectedDate)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(selectedDate)
        endOfDay.setHours(23, 59, 59, 999)

        const { data: bookings } = await (supabase
            .from('Booking') as any)
            .select('dataHora')
            .eq('businessId', (business as any).id)
            .gte('dataHora', startOfDay.toISOString())
            .lte('dataHora', endOfDay.toISOString())
            .neq('status', 'CANCELADO')

        // 3. Generate slots
        const slots: string[] = []
        let currentMin = (hours as any).inicioMin
        const endMin = (hours as any).fimMin
        const duration = (selectedService as any).duracaoMin

        while (currentMin + duration <= endMin) {
            const h = Math.floor(currentMin / 60)
            const m = currentMin % 60
            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`

            // Check collision
            const slotDate = new Date(selectedDate)
            slotDate.setHours(h, m, 0, 0)

            const isBusy = bookings?.some((b: any) => {
                const bookingTime = parseISO(b.dataHora)
                // Simple collision check: if booking starts at same time
                // In a real app, check full overlap
                return bookingTime.getTime() === slotDate.getTime()
            })

            if (!isBusy) {
                slots.push(timeString)
            }

            currentMin += duration // or fixed interval like 30min
        }

        setAvailableSlots(slots)
    }

    const handleBooking = async () => {
        if (!business || !selectedService || !selectedDate || !selectedTime) return

        setIsSubmitting(true)
        try {
            const [h, m] = selectedTime.split(':').map(Number)
            const bookingDate = new Date(selectedDate)
            bookingDate.setHours(h, m, 0, 0)

            if (rescheduleId) {
                // Handle Rescheduling
                const response = await fetch('/api/bookings/reschedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        oldBookingId: rescheduleId,
                        newBooking: {
                            businessId: business.id,
                            servicoId: selectedService.id,
                            clienteNome: clientData.name,
                            clienteWhats: clientData.whatsapp,
                            dataHora: bookingDate.toISOString(),
                        }
                    })
                })

                if (!response.ok) throw new Error("Falha ao reagendar")
            } else {
                // Handle New Booking
                const { error } = await (supabase
                    .from('Booking') as any)
                    .insert({
                        businessId: (business as any).id,
                        servicoId: (selectedService as any).id,
                        clienteNome: clientData.name,
                        clienteWhats: clientData.whatsapp,
                        dataHora: bookingDate.toISOString(),
                        status: 'AGENDADO' as const
                    })

                if (error) throw error
            }

            setBookingSuccess(true)
        } catch (error) {
            console.error("Booking error:", error)
            alert("Erro ao realizar agendamento. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-primary-50">Carregando...</div>
    if (!business) return <div className="min-h-screen flex items-center justify-center bg-primary-50">Negócio não encontrado</div>

    return (
        <div className="min-h-screen bg-primary-50 py-8 px-4">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-clay-sm text-primary-600">
                        <Store size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-800">{business.nome}</h1>
                    <p className="text-neutral-500 text-sm mt-1">Agendamento Online</p>
                </div>

                {oldBooking && !bookingSuccess && (
                    <div className="bg-blue-50 border border-blue-200 rounded-clay-sm p-4 flex items-start gap-3 animate-in fade-in">
                        <RefreshCw className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                        <div>
                            <p className="font-bold text-blue-800">Reagendamento</p>
                            <p className="text-sm text-blue-600">
                                Você está alterando seu agendamento de {format(new Date(oldBooking.dataHora), "dd/MM 'às' HH:mm")}.
                                O horário anterior será liberado após a confirmação.
                            </p>
                        </div>
                    </div>
                )}

                {bookingSuccess ? (
                    <ClayCard className="text-center py-12 animate-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                            <Check size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                            {rescheduleId ? 'Reagendamento Confirmado!' : 'Agendamento Confirmado!'}
                        </h2>
                        <p className="text-neutral-600 mb-8">
                            Obrigado, {clientData.name}. Seu {rescheduleId ? 'novo ' : ''}horário está reservado.
                        </p>
                        <ClayButton onClick={() => window.location.href = `/b/${slug}`}>
                            Fazer outro agendamento
                        </ClayButton>
                    </ClayCard>
                ) : (
                    <ClayCard>
                        {/* Step 1: Services */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in slide-in-from-right-4">
                                <h2 className="text-lg font-bold text-neutral-800 mb-4">Selecione um Serviço</h2>
                                {services.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedService(service)
                                            setStep(2)
                                        }}
                                        className={`w-full text-left p-4 rounded-xl transition-all border-2 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300
                                            ${selectedService?.id === service.id
                                                ? 'bg-primary-600 border-primary-600 shadow-lg'
                                                : 'bg-white hover:bg-neutral-50 hover:shadow-md border-neutral-200 hover:border-primary-400'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={`font-bold ${selectedService?.id === service.id ? 'text-white' : 'text-neutral-800 group-hover:text-primary-700'}`}>
                                                {service.nome}
                                            </span>
                                            <span className={`font-bold ${selectedService?.id === service.id ? 'text-white' : 'text-primary-600'}`}>
                                                {(service.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs ${selectedService?.id === service.id ? 'text-white/90' : 'text-neutral-500'}`}>
                                            <Clock size={12} />
                                            {service.duracaoMin} min
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Step 2: Date & Time */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => setStep(1)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300">
                                        <ChevronLeft size={20} className="text-neutral-700" />
                                    </button>
                                    <h2 className="text-lg font-bold text-neutral-800">Data e Horário</h2>
                                </div>

                                {/* Date Picker (Simple Horizontal) */}
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                                        const date = addDays(new Date(), offset)
                                        const isSelected = selectedDate && isSameDay(date, selectedDate)
                                        return (
                                            <button
                                                key={offset}
                                                onClick={() => {
                                                    setSelectedDate(date)
                                                    setSelectedTime(null)
                                                }}
                                                className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-all font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300
                                                    ${isSelected
                                                        ? 'bg-primary-700 text-white shadow-lg scale-105'
                                                        : 'bg-white text-neutral-700 hover:bg-neutral-50 hover:shadow-md border-2 border-neutral-200 hover:border-primary-400'
                                                    }`}
                                            >
                                                <span className="text-xs font-medium uppercase">{format(date, 'EEE', { locale: ptBR })}</span>
                                                <span className="text-xl font-bold">{format(date, 'd')}</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Time Slots */}
                                {selectedDate && (
                                    <div className="grid grid-cols-3 gap-3">
                                        {availableSlots.length > 0 ? (
                                            availableSlots.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => {
                                                        setSelectedTime(time)
                                                        setStep(3)
                                                    }}
                                                    className={`py-3 px-4 rounded-xl font-semibold transition-all text-sm focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300
                                                        ${selectedTime === time
                                                            ? 'bg-primary-700 text-white shadow-lg scale-105'
                                                            : 'bg-white border-2 border-neutral-200 text-neutral-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 hover:shadow-md'
                                                        }`}
                                                >
                                                    {time}
                                                </button>
                                            ))
                                        ) : (
                                            <div className="col-span-3 text-center py-8 text-neutral-500 text-sm">
                                                Nenhum horário disponível para esta data.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: Details */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => setStep(2)} className="p-2 hover:bg-neutral-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300">
                                        <ChevronLeft size={20} className="text-neutral-700" />
                                    </button>
                                    <h2 className="text-lg font-bold text-neutral-800">Seus Dados</h2>
                                </div>

                                <div className="bg-primary-50 p-4 rounded-clay-md mb-6">
                                    <p className="font-bold text-neutral-800">{selectedService?.nome}</p>
                                    <p className="text-sm text-neutral-600 flex items-center gap-2 mt-1">
                                        <Calendar size={14} />
                                        {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: ptBR })} às {selectedTime}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <ClayInput
                                        label="Seu Nome"
                                        placeholder="Como você gostaria de ser chamado?"
                                        value={clientData.name}
                                        onChange={e => setClientData({ ...clientData, name: e.target.value })}
                                    />
                                    <ClayInput
                                        label="Seu WhatsApp"
                                        placeholder="(11) 99999-9999"
                                        value={clientData.whatsapp}
                                        onChange={e => setClientData({ ...clientData, whatsapp: e.target.value })}
                                    />
                                </div>

                                <ClayButton
                                    onClick={handleBooking}
                                    isLoading={isSubmitting}
                                    className="w-full mt-4"
                                    disabled={!clientData.name || !clientData.whatsapp}
                                >
                                    {rescheduleId ? 'Confirmar Reagendamento' : 'Confirmar Agendamento'}
                                </ClayButton>
                            </div>
                        )}
                    </ClayCard>
                )}
            </div>
        </div>
    )
}
