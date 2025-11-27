"use client"

import { useState, useEffect } from "react"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { ClayInput } from "@/components/ui/clay-input"
import { supabase } from "@/lib/supabase"
import { Copy, Check, MessageSquare, Calendar } from "lucide-react"

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [business, setBusiness] = useState<any>(null)
    const [copied, setCopied] = useState(false)
    const [formData, setFormData] = useState({
        nome: "",
        telefoneWhats: "",
        slug: "",
        autoReplyEnabled: false
    })

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('Business')
                .select('*')
                .eq('ownerId', user.id)
                .single()

            if (data) {
                setBusiness(data)
                setFormData({
                    nome: data.nome,
                    telefoneWhats: data.telefoneWhats,
                    slug: data.slug,
                    autoReplyEnabled: data.autoReplyEnabled
                })
            }
        } catch (error) {
            console.error("Error fetching settings:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const { error } = await supabase
                .from('Business')
                .update({
                    nome: formData.nome,
                    telefoneWhats: formData.telefoneWhats,
                    autoReplyEnabled: formData.autoReplyEnabled
                })
                .eq('id', business.id)

            if (error) throw error
            alert("Configurações salvas com sucesso!")
        } catch (error) {
            console.error("Error saving settings:", error)
            alert("Erro ao salvar configurações")
        } finally {
            setIsSaving(false)
        }
    }

    const copyLink = () => {
        const url = `${window.location.origin}/b/${business.slug}`
        navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (isLoading) return <div>Carregando...</div>

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800">Configurações</h1>
                <p className="text-neutral-500">Gerencie seu negócio e integrações</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <ClayCard>
                    <h2 className="text-xl font-bold text-neutral-800 mb-6">Dados do Negócio</h2>
                    <form onSubmit={handleSave} className="space-y-4">
                        <ClayInput
                            label="Nome do Negócio"
                            value={formData.nome}
                            onChange={e => setFormData({ ...formData, nome: e.target.value })}
                        />
                        <ClayInput
                            label="WhatsApp Principal"
                            value={formData.telefoneWhats}
                            onChange={e => setFormData({ ...formData, telefoneWhats: e.target.value })}
                        />

                        <div className="pt-4">
                            <label className="flex items-center gap-3 p-4 bg-neutral-50 rounded-clay-md cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.autoReplyEnabled}
                                    onChange={e => setFormData({ ...formData, autoReplyEnabled: e.target.checked })}
                                    className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                />
                                <div>
                                    <span className="block font-medium text-neutral-800">Resposta Automática</span>
                                    <span className="text-xs text-neutral-500">Enviar mensagem no WhatsApp ao confirmar agendamento</span>
                                </div>
                            </label>
                        </div>

                        <div className="pt-4">
                            <ClayButton type="submit" isLoading={isSaving} className="w-full">
                                Salvar Alterações
                            </ClayButton>
                        </div>
                    </form>
                </ClayCard>

                <div className="space-y-6">
                    {/* Public Link */}
                    <ClayCard className="bg-primary-50 border-2 border-primary-100">
                        <h2 className="text-xl font-bold text-primary-900 mb-2">Link de Agendamento</h2>
                        <p className="text-sm text-primary-700 mb-4">Compartilhe este link com seus clientes</p>

                        <div className="flex gap-2">
                            <div className="flex-1 bg-white px-4 py-3 rounded-clay-md text-neutral-600 text-sm truncate border border-primary-200">
                                {typeof window !== 'undefined' ? `${window.location.origin}/b/${business.slug}` : `.../b/${business.slug}`}
                            </div>
                            <ClayButton onClick={copyLink} variant="secondary" className="min-w-[100px]">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                <span className="ml-2">{copied ? "Copiado" : "Copiar"}</span>
                            </ClayButton>
                        </div>
                    </ClayCard>

                    {/* Integrations */}
                    <ClayCard>
                        <h2 className="text-xl font-bold text-neutral-800 mb-6">Integrações</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-clay-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-800">WhatsApp</p>
                                        <p className="text-xs text-neutral-500">Conectado como {formData.telefoneWhats}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Ativo</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-clay-md opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-neutral-800">Google Calendar</p>
                                        <p className="text-xs text-neutral-500">Sincronizar agenda</p>
                                    </div>
                                </div>
                                <ClayButton size="sm" variant="secondary" disabled>Em breve</ClayButton>
                            </div>
                        </div>
                    </ClayCard>
                </div>
            </div>
        </div>
    )
}
