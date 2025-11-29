"use client"

import { useState } from "react"
import { Database } from "@/types/supabase"
import { Save, MessageSquare, MapPin, User, List } from "lucide-react"

type Business = Database['public']['Tables']['Business']['Row']

export default function AtendimentoClient({ business }: { business: Business }) {
    const [enabled, setEnabled] = useState(business.autoReplyEnabled)
    const [endereco, setEndereco] = useState(business.endereco || "")

    // Default templates if not present
    const defaultTemplates = {
        greeting: `Olá! Bem-vindo ao ${business.nome}. Como posso ajudar hoje?`,
        menu: "1. Agendar Horário\n2. Endereço\n3. Falar com Atendente",
        address_response: `Estamos localizados em: ${business.endereco || "[Endereço não configurado]"}`,
        human_response: "Um de nossos atendentes irá falar com você em breve. Por favor, aguarde um momento."
    }

    const [config, setConfig] = useState<any>(business.autoReplyConfig || defaultTemplates)
    const [saving, setSaving] = useState(false)

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch("/api/business/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    autoReplyEnabled: enabled,
                    autoReplyConfig: config,
                    endereco,
                }),
            })
            if (!res.ok) throw new Error("Erro ao salvar")
            alert("Configurações salvas com sucesso!")
        } catch (error) {
            alert("Erro ao salvar configurações")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="max-w-3xl">
            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Bot de Atendimento WhatsApp</h2>
                        <p className="text-sm text-slate-500">Configure os scripts que o bot usará para responder seus clientes.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={enabled}
                            onChange={(e) => setEnabled(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <hr className="border-slate-100" />

                <div className={`space-y-8 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>

                    {/* Endereço */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Endereço do Negócio</label>
                        <div className="flex gap-2">
                            <div className="p-2 bg-slate-100 rounded text-slate-500">
                                <MapPin size={20} />
                            </div>
                            <input
                                type="text"
                                value={endereco}
                                onChange={(e) => {
                                    setEndereco(e.target.value)
                                    // Auto-update address response if it contains the old address or placeholder
                                    if (config.address_response.includes("[Endereço não configurado]")) {
                                        setConfig({ ...config, address_response: `Estamos localizados em: ${e.target.value}` })
                                    }
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Rua Exemplo, 123"
                            />
                        </div>
                    </div>

                    {/* Scripts Section */}
                    <div className="space-y-6">
                        <h3 className="text-md font-medium text-slate-900 border-b pb-2">Scripts de Resposta</h3>

                        {/* Greeting */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <MessageSquare size={16} className="text-blue-600" />
                                Saudação Inicial
                            </label>
                            <textarea
                                rows={2}
                                value={config.greeting}
                                onChange={(e) => setConfig({ ...config, greeting: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Mensagem de boas-vindas..."
                            />
                            <p className="text-xs text-slate-500 mt-1">Enviada quando o cliente manda a primeira mensagem.</p>
                        </div>

                        {/* Menu */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <List size={16} className="text-blue-600" />
                                Menu de Opções
                            </label>
                            <textarea
                                rows={4}
                                value={config.menu}
                                onChange={(e) => setConfig({ ...config, menu: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                                placeholder="Lista de opções..."
                            />
                            <p className="text-xs text-slate-500 mt-1">Apresentado logo após a saudação.</p>
                        </div>

                        {/* Address Response */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-blue-600" />
                                Resposta de Endereço
                            </label>
                            <textarea
                                rows={2}
                                value={config.address_response}
                                onChange={(e) => setConfig({ ...config, address_response: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <p className="text-xs text-slate-500 mt-1">Enviada quando o cliente escolhe a opção de endereço ou pergunta "onde fica".</p>
                        </div>

                        {/* Human Handoff */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                                <User size={16} className="text-blue-600" />
                                Transbordo para Humano
                            </label>
                            <textarea
                                rows={2}
                                value={config.human_response}
                                onChange={(e) => setConfig({ ...config, human_response: e.target.value })}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <p className="text-xs text-slate-500 mt-1">Enviada quando o cliente pede para falar com atendente.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 w-full justify-center sm:w-auto"
                    >
                        <Save size={18} />
                        {saving ? "Salvando..." : "Salvar Configurações"}
                    </button>
                </div>
            </div>
        </div>
    )
}
