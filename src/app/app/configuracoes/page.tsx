import Link from "next/link"
import { MessageSquare, Calendar, CheckCircle2 } from "lucide-react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase-admin"
import WhatsAppTester from "./whatsapp-tester"

export default async function ConfiguracoesPage() {
    const session = await getServerSession(authOptions)

    let isGoogleConnected = false
    if (session?.user?.id) {
        const { data: business } = await supabaseAdmin
            .from('Business')
            .select('googleRefreshToken')
            .eq('ownerId', session.user.id)
            .single()

        if (business?.googleRefreshToken) {
            isGoogleConnected = true
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 shadow-sm">
                <h1 className="text-3xl font-bold text-neutral-900">Configurações</h1>
                <p className="text-neutral-600 mt-1">Gerencie as integrações e configurações do seu negócio</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WhatsApp Bot Card */}
                <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-400 hover:shadow-lg transition-all group">
                    <Link href="/app/atendimento" className="block">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-4 bg-primary-100 text-primary-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                <MessageSquare size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-900">Atendimento Automático</h2>
                                <p className="text-sm text-neutral-500">WhatsApp Bot</p>
                            </div>
                        </div>
                        <p className="text-neutral-600 text-sm leading-relaxed">
                            Configure as respostas automáticas do seu assistente virtual no WhatsApp.
                        </p>
                    </Link>

                    {/* Client Component for testing */}
                    <WhatsAppTester />
                </div>

                {/* Google Calendar Card */}
                <div className="bg-white p-6 rounded-2xl border-2 border-neutral-200 hover:border-primary-400 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-4 mb-3">
                        <div className={`p-4 rounded-xl transition-colors ${isGoogleConnected
                                ? 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white'
                                : 'bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                            }`}>
                            <Calendar size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-neutral-900">Google Calendar</h2>
                            <div className="flex items-center gap-2">
                                {isGoogleConnected ? (
                                    <>
                                        <CheckCircle2 size={14} className="text-green-600" />
                                        <span className="text-sm text-green-600 font-medium">Conectado</span>
                                    </>
                                ) : (
                                    <span className="text-sm text-orange-600 font-medium">Não conectado</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                        {isGoogleConnected
                            ? "Seus agendamentos estão sincronizados com o Google Calendar."
                            : "Sincronize seus agendamentos automaticamente com o Google Calendar."
                        }
                    </p>
                    {!isGoogleConnected && (
                        <Link
                            href="/api/auth/google/connect"
                            className="inline-block w-full text-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                        >
                            Conectar Conta
                        </Link>
                    )}
                    {isGoogleConnected && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                            <p className="text-green-700 text-sm font-medium">
                                ✓ Sincronização ativa
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
