"use client"

import { useState } from "react"
import { Business, Servico, HorarioAtendimento } from "@prisma/client"
import { format, addMinutes, setHours, setMinutes } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Check, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react"

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

    // Mock slots generation based on HorarioAtendimento
    // For prototype: just generate 4-8 slots for the selected date
    const generateSlots = () => {
        if (!selectedDate) return []

        // Find operating hours for the day (0=Sun, 6=Sat)
        const dayOfWeek = selectedDate.getDay()
        const horario = business.horarios.find(h => h.diaSemana === dayOfWeek)

        if (!horario || !horario.ativo) return [] // Closed

        const slots = []
        let currentMin = horario.inicioMin
        const endMin = horario.fimMin
        const interval = selectedService ? selectedService.duracaoMin : 60

        // Limit to 8 slots for prototype simplicity
        let count = 0
        while (currentMin + interval <= endMin && count < 8) {
            const hour = Math.floor(currentMin / 60)
            const min = currentMin % 60
            const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
            slots.push(timeString)
            currentMin += interval
            count++
        }
        return slots
    }

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
            <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Agendamento Confirmado!</h2>
                <p className="text-slate-600 mb-6">
                    Seu horário com {business.nome} está reservado.
                </p>

                <div className="bg-slate-50 p-4 rounded-lg text-left mb-6 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-slate-500">Serviço:</span>
                        <span className="font-medium">{selectedService?.nome}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Data:</span>
                        <span className="font-medium">{format(new Date(bookingSuccess.dataHora), "dd/MM/yyyy 'às' HH:mm")}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-500">Cliente:</span>
                        <span className="font-medium">{bookingSuccess.clienteNome}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 py-2 border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50">
                        Remarcar
                    </button>
                    <button
                        onClick={() => window.location.href = `/cancel/${bookingSuccess.id}`}
                        className="flex-1 py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md mx-auto">
            {/* Header */}
            <div className="bg-blue-600 p-6 text-white">
                <h1 className="text-xl font-bold">{business.nome}</h1>
                <p className="text-blue-100 text-sm mt-1">Agende seu horário online</p>
            </div>

            {/* Progress */}
            <div className="flex border-b border-slate-100">
                {[1, 2, 3].map((s) => (
                    <div
                        key={s}
                        className={`flex-1 h-1 ${step >= s ? 'bg-blue-600' : 'bg-slate-200'}`}
                    />
                ))}
            </div>

            <div className="p-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Selecione um serviço</h2>
                        {business.servicos.map((servico) => (
                            <button
                                key={servico.id}
                                onClick={() => handleServiceSelect(servico)}
                                className="w-full text-left p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium text-slate-900">{servico.nome}</span>
                                    <span className="text-slate-600 font-semibold">
                                        {(servico.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-sm text-slate-500">{servico.duracaoMin} min</span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <button onClick={() => setStep(1)} className="hover:text-blue-600">Serviços</button>
                            <ChevronRight size={14} />
                            <span>Data e Hora</span>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Escolha o horário</h2>
                            {/* Simple Date Picker Mock */}
                            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                                {[0, 1, 2, 3, 4].map((offset) => {
                                    const date = new Date()
                                    date.setDate(date.getDate() + offset)
                                    const isSelected = selectedDate?.toDateString() === date.toDateString()

                                    return (
                                        <button
                                            key={offset}
                                            onClick={() => setSelectedDate(date)}
                                            className={`flex-shrink-0 w-16 h-20 rounded-lg flex flex-col items-center justify-center border ${isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                                                }`}
                                        >
                                            <span className="text-xs font-medium uppercase">{format(date, 'EEE', { locale: ptBR })}</span>
                                            <span className="text-xl font-bold">{format(date, 'd')}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {generateSlots().map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => handleTimeSelect(time)}
                                        className="py-2 px-4 rounded-md border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-slate-700 font-medium text-sm transition-colors"
                                    >
                                        {time}
                                    </button>
                                ))}
                                {generateSlots().length === 0 && (
                                    <div className="col-span-3 text-center text-slate-500 py-4 text-sm">
                                        Nenhum horário disponível para esta data.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <button onClick={() => setStep(2)} className="hover:text-blue-600">Voltar</button>
                            <ChevronRight size={14} />
                            <span>Seus dados</span>
                        </div>

                        <h2 className="text-lg font-semibold text-slate-900">Finalizar Agendamento</h2>

                        <div className="bg-slate-50 p-4 rounded-lg text-sm space-y-1">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Serviço:</span>
                                <span className="font-medium">{selectedService?.nome}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Data:</span>
                                <span className="font-medium">
                                    {selectedDate && format(selectedDate, "dd/MM/yyyy")} às {selectedTime}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Valor:</span>
                                <span className="font-medium">
                                    {(selectedService!.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nome}
                                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Observações (Opcional)</label>
                                <textarea
                                    value={formData.obs}
                                    onChange={(e) => setFormData({ ...formData, obs: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                            </div>

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="waitlist"
                                    checked={formData.waitlist}
                                    onChange={(e) => setFormData({ ...formData, waitlist: e.target.checked })}
                                    className="mt-1"
                                />
                                <label htmlFor="waitlist" className="text-sm text-slate-600">
                                    Quero entrar na fila se abrir horário mais cedo.
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md disabled:opacity-70"
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
