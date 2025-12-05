"use client"

import { useState, useEffect } from "react"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { Database } from "@/types/supabase"
import { Clock, Save } from "lucide-react"

type WorkingHour = Database['public']['Tables']['HorarioAtendimento']['Row']

const DAYS = [
    { id: 0, label: "Domingo" },
    { id: 1, label: "Segunda-feira" },
    { id: 2, label: "Terça-feira" },
    { id: 3, label: "Quarta-feira" },
    { id: 4, label: "Quinta-feira" },
    { id: 5, label: "Sexta-feira" },
    { id: 6, label: "Sábado" },
]

export default function HoursPage() {
    const [hours, setHours] = useState<WorkingHour[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchHours()
    }, [])

    const fetchHours = async () => {
        try {
            // TODO: Create API route for working hours
            // For now, set default hours
            const defaultHours = DAYS.map(day => ({
                businessId: '',
                diaSemana: day.id,
                inicioMin: 9 * 60,
                fimMin: 18 * 60,
                ativo: day.id >= 1 && day.id <= 5 // Monday to Friday active by default
            } as WorkingHour))
            setHours(defaultHours)
        } catch (error) {
            console.error("Error fetching hours:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // TODO: Create API route for working hours
            alert("Funcionalidade em desenvolvimento")
        } catch (error) {
            console.error("Error saving hours:", error)
            alert("Erro ao salvar horários")
        } finally {
            setIsSaving(false)
        }
    }

    const updateHour = (index: number, field: keyof WorkingHour, value: any) => {
        const newHours = [...hours]
        newHours[index] = { ...newHours[index], [field]: value }
        setHours(newHours)
    }

    const minToTime = (min: number) => {
        const h = Math.floor(min / 60).toString().padStart(2, '0')
        const m = (min % 60).toString().padStart(2, '0')
        return `${h}:${m}`
    }

    const timeToMin = (time: string) => {
        const [h, m] = time.split(':').map(Number)
        return h * 60 + m
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Horários de Atendimento</h1>
                    <p className="text-neutral-500">Defina sua disponibilidade semanal</p>
                </div>
                <ClayButton onClick={handleSave} isLoading={isSaving}>
                    <Save className="mr-2 h-5 w-5" />
                    Salvar Alterações
                </ClayButton>
            </div>

            <ClayCard className="space-y-6">
                {DAYS.map((day, index) => {
                    const hour = hours.find(h => h.diaSemana === day.id)
                    if (!hour) return null

                    return (
                        <div key={day.id} className="flex items-center gap-4 p-4 rounded-clay-md hover:bg-neutral-50 transition-colors">
                            <div className="flex items-center gap-3 w-40">
                                <input
                                    type="checkbox"
                                    checked={hour.ativo}
                                    onChange={e => updateHour(index, 'ativo', e.target.checked)}
                                    className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                />
                                <span className={`font-medium ${hour.ativo ? 'text-neutral-800' : 'text-neutral-400'}`}>
                                    {day.label}
                                </span>
                            </div>

                            {hour.ativo ? (
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-neutral-400" />
                                        <input
                                            type="time"
                                            value={minToTime(hour.inicioMin)}
                                            onChange={e => updateHour(index, 'inicioMin', timeToMin(e.target.value))}
                                            className="px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
                                        />
                                    </div>
                                    <span className="text-neutral-400">até</span>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-neutral-400" />
                                        <input
                                            type="time"
                                            value={minToTime(hour.fimMin)}
                                            onChange={e => updateHour(index, 'fimMin', timeToMin(e.target.value))}
                                            className="px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <span className="text-neutral-400 italic text-sm">Fechado</span>
                            )}
                        </div>
                    )
                })}
            </ClayCard>
        </div>
    )
}
