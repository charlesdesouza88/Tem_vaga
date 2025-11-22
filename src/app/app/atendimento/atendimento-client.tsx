"use client"

import { useState } from "react"
import { Business } from "@prisma/client"
import { Save } from "lucide-react"

export default function AtendimentoClient({ business }: { business: Business }) {
    const [enabled, setEnabled] = useState(business.autoReplyEnabled)
    const [endereco, setEndereco] = useState(business.endereco || "")
    const [config, setConfig] = useState<any>(business.autoReplyConfig || {
        price: true,
        availability: true,
        location: true,
        cancellation: true,
        reschedule: true,
        defaultPrice: 0,
    })
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
        <div className="max-w-2xl">
            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Respostas Automáticas</h2>
                        <p className="text-sm text-slate-500">O sistema responderá perguntas comuns no WhatsApp.</p>
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

                <div className={`space-y-6 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Endereço do Negócio</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Rua Exemplo, 123"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Preço Padrão (R$)</label>
                        <input
                            type="number"
                            value={config.defaultPrice}
                            onChange={(e) => setConfig({ ...config, defaultPrice: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Responder automaticamente sobre:</label>
                        <div className="space-y-2">
                            <Checkbox
                                label="Horários disponíveis"
                                checked={config.availability}
                                onChange={(c) => setConfig({ ...config, availability: c })}
                            />
                            <Checkbox
                                label="Preço dos serviços"
                                checked={config.price}
                                onChange={(c) => setConfig({ ...config, price: c })}
                            />
                            <Checkbox
                                label="Como chegar (Endereço)"
                                checked={config.location}
                                onChange={(c) => setConfig({ ...config, location: c })}
                            />
                            <Checkbox
                                label="Política de Cancelamento"
                                checked={config.cancellation}
                                onChange={(c) => setConfig({ ...config, cancellation: c })}
                            />
                            <Checkbox
                                label="Remarcação"
                                checked={config.reschedule}
                                onChange={(c) => setConfig({ ...config, reschedule: c })}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? "Salvando..." : "Salvar Configurações"}
                    </button>
                </div>
            </div>
        </div>
    )
}

function Checkbox({ label, checked, onChange }: { label: string, checked: boolean, onChange: (c: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">{label}</span>
        </label>
    )
}
