import Link from "next/link"
import { MessageSquare } from "lucide-react"

export default function ConfiguracoesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href="/app/atendimento"
                    className="p-6 bg-white rounded-lg border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group"
                >
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <MessageSquare size={24} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Atendimento Automático</h2>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Configure as respostas automáticas do seu assistente virtual no WhatsApp.
                    </p>
                </Link>

                {/* Other settings placeholders */}
                <div className="p-6 bg-white rounded-lg border border-slate-100 opacity-60 cursor-not-allowed">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Perfil do Negócio</h2>
                    <p className="text-slate-500 text-sm">Editar informações da empresa (Em breve).</p>
                </div>

                <div className="p-6 bg-white rounded-lg border border-slate-100 opacity-60 cursor-not-allowed">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Serviços</h2>
                    <p className="text-slate-500 text-sm">Gerenciar serviços e preços (Em breve).</p>
                </div>

                <div className="p-6 bg-white rounded-lg border border-slate-100 opacity-60 cursor-not-allowed">
                    <h2 className="text-lg font-semibold text-slate-900 mb-2">Horários</h2>
                    <p className="text-slate-500 text-sm">Definir horário de funcionamento (Em breve).</p>
                </div>
            </div>
        </div>
    )
}
