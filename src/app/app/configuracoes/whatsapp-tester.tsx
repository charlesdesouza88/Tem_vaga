"use client"

import { useState } from "react"
import { Send } from "lucide-react"

export default function WhatsAppTester() {
    const [phone, setPhone] = useState("")
    const [sending, setSending] = useState(false)

    const handleTest = async () => {
        if (!phone) return
        setSending(true)
        try {
            const res = await fetch("/api/whatsapp/test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone }),
            })
            if (!res.ok) throw new Error("Failed")
            alert("Mensagem de teste enviada!")
        } catch (error) {
            alert("Erro ao enviar mensagem")
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="mt-4 pt-4 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">Testar Integração WhatsApp</label>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="5511999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
                <button
                    onClick={handleTest}
                    disabled={sending || !phone}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                    <Send size={16} />
                    {sending ? "Enviando..." : "Testar"}
                </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
                Use um número verificado no painel da Meta (ex: seu próprio número).
            </p>
        </div>
    )
}
