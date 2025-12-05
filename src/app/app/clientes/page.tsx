"use client"

import { useState, useEffect } from "react"
import { ClayCard } from "@/components/ui/clay-card"
import { User, Phone, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

type Client = {
    nome: string
    whatsapp: string
    lastBooking: string
    totalBookings: number
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchClients()
    }, [])

    const fetchClients = async () => {
        try {
            // TODO: Create API route for clients
            // For now, show empty state
            setClients([])
        } catch (error) {
            console.error("Error fetching clients:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800">Clientes</h1>
                <p className="text-neutral-500">Lista de clientes que já agendaram com você</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client, index) => (
                    <ClayCard key={index} variant="hover">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                                {client.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-medium text-neutral-600">
                                {client.totalBookings} agendamentos
                            </div>
                        </div>

                        <h3 className="text-lg font-bold text-neutral-800 mb-1">{client.nome}</h3>

                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <Phone size={14} />
                                <span>{client.whatsapp}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                                <Calendar size={14} />
                                <span>Última vez: {format(new Date(client.lastBooking), "d 'de' MMM", { locale: ptBR })}</span>
                            </div>
                        </div>
                    </ClayCard>
                ))}

                {clients.length === 0 && !isLoading && (
                    <div className="col-span-full text-center py-12 bg-white rounded-clay-lg border-2 border-dashed border-neutral-200">
                        <User className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                        <p className="text-neutral-500">Nenhum cliente encontrado ainda.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
