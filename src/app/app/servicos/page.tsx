"use client"

import { useState, useEffect } from "react"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { ClayInput } from "@/components/ui/clay-input"
import { supabase } from "@/lib/supabase"
import { Database } from "@/types/supabase"
import { Plus, Trash2, Edit2, Clock, DollarSign } from "lucide-react"

type Service = Database['public']['Tables']['Servico']['Row']

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [formData, setFormData] = useState({
        nome: "",
        preco: "",
        duracaoMin: "60"
    })

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: business } = await supabase
                .from('Business')
                .select('id')
                .eq('ownerId', user.id)
                .single()

            if (business) {
                const { data } = await supabase
                    .from('Servico')
                    .select('*')
                    .eq('businessId', business.id)
                    .order('nome')

                if (data) setServices(data)
            }
        } catch (error) {
            console.error("Error fetching services:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: business } = await supabase
                .from('Business')
                .select('id')
                .eq('ownerId', user.id)
                .single()

            if (!business) return

            const serviceData = {
                businessId: business.id,
                nome: formData.nome,
                preco: Math.round(parseFloat(formData.preco.replace(',', '.')) * 100), // Convert to cents
                duracaoMin: parseInt(formData.duracaoMin),
                ativo: true
            }

            if (editingService) {
                await supabase
                    .from('Servico')
                    .update(serviceData)
                    .eq('id', editingService.id)
            } else {
                await supabase
                    .from('Servico')
                    .insert(serviceData)
            }

            setIsModalOpen(false)
            setEditingService(null)
            setFormData({ nome: "", preco: "", duracaoMin: "60" })
            fetchServices()
        } catch (error) {
            console.error("Error saving service:", error)
            alert("Erro ao salvar serviço")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este serviço?")) return

        try {
            await supabase.from('Servico').delete().eq('id', id)
            fetchServices()
        } catch (error) {
            console.error("Error deleting service:", error)
            alert("Erro ao excluir serviço")
        }
    }

    const openEdit = (service: Service) => {
        setEditingService(service)
        setFormData({
            nome: service.nome,
            preco: (service.preco / 100).toFixed(2),
            duracaoMin: service.duracaoMin.toString()
        })
        setIsModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-800">Serviços</h1>
                    <p className="text-neutral-500">Gerencie os serviços oferecidos pelo seu negócio</p>
                </div>
                <ClayButton onClick={() => {
                    setEditingService(null)
                    setFormData({ nome: "", preco: "", duracaoMin: "60" })
                    setIsModalOpen(true)
                }}>
                    <Plus className="mr-2 h-5 w-5" />
                    Novo Serviço
                </ClayButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <ClayCard key={service.id} variant="hover" className="relative group">
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => openEdit(service)}
                                className="p-2 bg-white rounded-full shadow-sm hover:text-primary-600 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => handleDelete(service.id)}
                                className="p-2 bg-white rounded-full shadow-sm hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <h3 className="text-xl font-bold text-neutral-800 mb-4">{service.nome}</h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
                                    <DollarSign size={16} />
                                </div>
                                <span className="font-semibold">
                                    {(service.preco / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-600">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                    <Clock size={16} />
                                </div>
                                <span>{service.duracaoMin} minutos</span>
                            </div>
                        </div>
                    </ClayCard>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-md">
                        <ClayCard>
                            <h2 className="text-2xl font-bold mb-6">
                                {editingService ? "Editar Serviço" : "Novo Serviço"}
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <ClayInput
                                    label="Nome do Serviço"
                                    value={formData.nome}
                                    onChange={e => setFormData({ ...formData, nome: e.target.value })}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <ClayInput
                                        label="Preço (R$)"
                                        type="number"
                                        step="0.01"
                                        value={formData.preco}
                                        onChange={e => setFormData({ ...formData, preco: e.target.value })}
                                        required
                                    />
                                    <ClayInput
                                        label="Duração (min)"
                                        type="number"
                                        value={formData.duracaoMin}
                                        onChange={e => setFormData({ ...formData, duracaoMin: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <ClayButton
                                        type="button"
                                        variant="secondary"
                                        className="flex-1"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancelar
                                    </ClayButton>
                                    <ClayButton
                                        type="submit"
                                        className="flex-1"
                                        isLoading={isLoading}
                                    >
                                        Salvar
                                    </ClayButton>
                                </div>
                            </form>
                        </ClayCard>
                    </div>
                </div>
            )}
        </div>
    )
}
