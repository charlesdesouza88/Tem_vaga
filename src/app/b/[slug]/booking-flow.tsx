"use client"

import { useState, useEffect } from "react"
import { Database } from "@/types/supabase"
import { format, setHours, setMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Check, ChevronRight, ChevronLeft, Clock, MapPin } from "lucide-react"

type Business = Database['public']['Tables']['Business']['Row']
type Servico = Database['public']['Tables']['Servico']['Row']
type HorarioAtendimento = Database['public']['Tables']['HorarioAtendimento']['Row']

type BookingFlowProps = {
    business: Business & {
        servicos: Servico[]
        horarios: HorarioAtendimento[]
    }
}

export default function BookingFlow({ business }: BookingFlowProps) {
    const [step, setStep] = useState(1)
    const [selectedService, setSelectedService] = useState<Servico | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        nome: "",
        whatsapp: "",
        obs: "",
        waitlist: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState<any>(null)

    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)

    useEffect(() => {
        const fetchSlots = async () => {
            if (!selectedDate || !selectedService) return

            setIsLoadingSlots(true)
            setAvailableSlots([])

            try {
                const dateStr = format(selectedDate, 'yyyy-MM-dd')
                const res = await fetch(`/api/availability?businessId=${business.id}&date=${dateStr}&duration=${selectedService.duracaoMin}`)

                if (res.ok) {
                    const data = await res.json()
                    setAvailableSlots(data.slots || [])
                }
            } catch (error) {
                console.error("Error fetching slots:", error)
            } finally {
                setIsLoadingSlots(false)
            }
        }

        fetchSlots()
    }, [selectedDate, selectedService, business.id])

    const handleServiceSelect = (service: Servico) => {
        setSelectedService(service)
        setStep(2)
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
        setStep(3)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedService || !selectedDate || !selectedTime) return

        setIsSubmitting(true)

        const [hours, minutes] = selectedTime.split(':').map(Number)
        const bookingDate = setMinutes(setHours(selectedDate, hours), minutes)

        try {
            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId: business.id,
                    servicoId: selectedService.id,
                    dataHora: bookingDate.toISOString(),
                    clienteNome: formData.nome,
                    clienteWhats: formData.whatsapp,
                    joinWaitlist: formData.waitlist,
                }),
            })

            if (!res.ok) throw new Error("Erro ao agendar")

            const data = await res.json()
            setBookingSuccess(data.booking)
            setStep(4)
        } catch (error) {
            alert("Erro ao realizar agendamento. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (step === 4 && bookingSuccess) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-100 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Agendamento Confirmado!</h2>
                <p className="text-neutral-600 mb-6">
                    Seu horário com <strong>{business.nome}</strong> está reservado.
                </p>

                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 text-left mb-6 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-neutral-600 text-sm font-medium">Serviço:</span>
                        <span className="font-semibold text-neutral-900">{selectedService?.nome}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-neutral-600 text-sm font-medium">Data:</span>
                        <span className="font-semibold text-neutral-900">
                            {format(new Date(bookingSuccess.dataHora), "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-neutral-600 text-sm font-medium">Cliente:</span>
                        <span className="font-semibold text-neutral-900">{bookingSuccess.clienteNome}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 py-3 px-4 bg-white border-2 border-neutral-300 text-neutral-700 font-medium text-sm rounded-xl hover:bg-neutral-50 hover:border-neutral-400 transition-colors">
                        Remarcar
                    </button>
                    <button
                        onClick={() => window.location.href = `/cancel/${bookingSuccess.id}`}
                        className="flex-1 py-3 px-4 bg-white border-2 border-red-300 text-red-600 font-medium text-sm rounded-xl hover:bg-red-50 hover:border-red-400 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 overflow-hidden max-w-md mx-auto">
            {/* Header */}
            <div className="bg-primary-600 p-6 text-white relative">
                {step > 1 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-primary-700 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
                <h1 className="text-xl font-bold text-center">{business.nome}</h1>
                <p className="text-primary-100 text-sm mt-1 text-center">Agende seu horário online</p>
            </div>

            {/* Progress */}
            <div className="flex gap-2 px-6 py-4 bg-neutral-50 border-b border-neutral-200">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`flex-1 h-2 rounded-full transition-all ${step >= s ? 'bg-primary-600' : 'bg-neutral-200'
                            }`}
                    />
                ))}
            </div>

            <div className="p-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-neutral-900 mb-4">Selecione um serviço</h2>
                        {business.servicos.map((servico) => (
                            <button
                                key={servico.id}
                                onClick={() => handleServiceSelect(servico)}
                                className="w-full text-left p-5 rounded-xl bg-white border-2 border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-semibold text-neutral-900 text-lg">{servico.nome}</span>
                                    <span className="text-primary-600 font-bold text-lg">
                                        {(servico.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-neutral-500 flex items-center gap-1">
                                        <Clock size={16} />
                                        {servico.duracaoMin} minutos
                                    </span>
                                    <ChevronRight size={20} className="text-neutral-400 group-hover:text-primary-600 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-neutral-900">Escolha data e horário</h2>

                        {/* Date Picker */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-3">Data</label>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[0, 1, 2, 3, 4].map((offset) => {
                                    const date = new Date()
                                    date.setDate(date.getDate() + offset)
                                    const isSelected = selectedDate?.toDateString() === date.toDateString()

                                    return (
                                        <button
                                            key={offset}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${isSelected
                                                    ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                                                    : 'bg-white border-neutral-200 text-neutral-700 hover:border-primary-300'
                                                }`}
                                        >
                                            <span className={`text-xs font-medium uppercase mb-1 ${isSelected ? 'text-primary-100' : 'text-neutral-500'
                                                }`}>
                                                {format(date, 'EEE', { locale: ptBR })}
                                            </span>
                                            <span className="text-2xl font-bold">{format(date, 'd')}</span>
                                            <span className={`text-xs ${isSelected ? 'text-primary-100' : 'text-neutral-500'
                                                }`}>
                                                {format(date, 'MMM', { locale: ptBR })}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-3">Horário</label>
                            <div className="grid grid-cols-3 gap-3">
                                {isLoadingSlots ? (
                                    <div className="col-span-3 text-center py-12">
                                        <Clock className="animate-spin mx-auto mb-3 text-primary-600" size={32} />
                                        <p className="text-sm text-neutral-500">Carregando horários...</p>
                                    </div>
                                ) : (
                                    <>
                                        {availableSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => handleTimeSelect(time)}
                                                className="py-3 px-4 rounded-xl bg-white border-2 border-neutral-200 text-neutral-700 font-semibold text-sm hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700 transition-all"
                                            >
                                                {time}
                                            </button>
                                        ))}
                                        {availableSlots.length === 0 && !isLoadingSlots && (
                                            <div className="col-span-3 text-center py-8 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-300">
                                                <p className="text-neutral-500 text-sm">Nenhum horário disponível</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold text-neutral-900">Seus dados</h2>

                        <div className="bg-primary-50 border border-primary-200 p-5 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-600 text-sm font-medium">Serviço:</span>
                                <span className="font-semibold text-neutral-900">{selectedService?.nome}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-600 text-sm font-medium">Data:</span>
                                <span className="font-semibold text-neutral-900">
                                    {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-neutral-600 text-sm font-medium">Valor:</span>
                                <span className="font-bold text-primary-700 text-lg">
                                    {(selectedService!.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Nome Completo *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    className="w-full px-4 py-3 bg-white text-neutral-900 border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full px-4 py-3 bg-white text-neutral-900 border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                    Observações (Opcional)
                                </label>
                                <textarea
                                    value={formData.obs}
                                    onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                                    className="w-full px-4 py-3 bg-white text-neutral-900 border-2 border-neutral-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-all resize-none"
                                    rows={3}
                                    placeholder="Alguma preferência ou observação?"
                                />
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                                <input
                                    type="checkbox"
                                    id="waitlist"
                                    checked={formData.waitlist}
                                    onChange={(e) => setFormData({ ...formData, waitlist: e.target.checked })}
                                    className="mt-1 w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-200"
                                />
                                <label htmlFor="waitlist" className="text-sm text-neutral-700">
                                    Quero entrar na fila de espera se abrir um horário mais cedo
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full px-6 py-4 bg-primary-600 text-white font-bold text-base rounded-xl hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
                            >
                                {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}
