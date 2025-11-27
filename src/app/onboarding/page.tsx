"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { ClayInput } from "@/components/ui/clay-input"
import { supabase } from "@/lib/supabase"
import { Check, ChevronRight, Store, Clock, Calendar } from "lucide-react"

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        businessName: "",
        whatsapp: "",
        slug: "",
    })

    const handleNext = async () => {
        if (step === 1) {
            if (!formData.businessName || !formData.whatsapp) return
            // Basic slug generation
            const slug = formData.businessName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000)
            setFormData(prev => ({ ...prev, slug }))
            setStep(2)
        } else if (step === 2) {
            setStep(3)
        } else if (step === 3) {
            await finishOnboarding()
        }
    }

    const finishOnboarding = async () => {
        setIsLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("No user found")

            // 1. Create Business
            const { data: business, error: businessError } = await supabase
                .from('Business')
                .insert({
                    ownerId: user.id,
                    nome: formData.businessName,
                    slug: formData.slug,
                    telefoneWhats: formData.whatsapp,
                    autoReplyEnabled: false
                })
                .select()
                .single()

            if (businessError) throw businessError

            // 2. Create Default Service
            await supabase.from('Servico').insert({
                businessId: business.id,
                nome: "Atendimento Padrão",
                preco: 10000, // R$ 100,00
                duracaoMin: 60,
                ativo: true
            })

            // 3. Create Default Hours (Mon-Fri, 9-18)
            const hours = [1, 2, 3, 4, 5].map(day => ({
                businessId: business.id,
                diaSemana: day,
                inicioMin: 9 * 60, // 09:00
                fimMin: 18 * 60,   // 18:00
                ativo: true
            }))
            await supabase.from('HorarioAtendimento').insert(hours)

            router.push('/app/agenda')
        } catch (error) {
            console.error("Onboarding error:", error)
            alert("Erro ao criar negócio. Tente novamente.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary-900">Bem-vindo ao Tem_vaga!</h1>
                    <p className="text-primary-600 mt-2">Vamos configurar seu negócio em poucos passos.</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2 w-16 rounded-full transition-all ${step >= i ? 'bg-primary-500' : 'bg-primary-200'}`} />
                    ))}
                </div>

                <ClayCard>
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                    <Store size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-neutral-800">Sobre seu Negócio</h2>
                            </div>

                            <ClayInput
                                label="Nome do Negócio"
                                placeholder="Ex: Barbearia do Silva"
                                value={formData.businessName}
                                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                            />

                            <ClayInput
                                label="WhatsApp Principal"
                                placeholder="(11) 99999-9999"
                                value={formData.whatsapp}
                                onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                    <Clock size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-neutral-800">Serviço Inicial</h2>
                                <p className="text-sm text-neutral-500 mt-2">Criaremos um serviço padrão para você começar.</p>
                            </div>

                            <div className="bg-neutral-50 p-4 rounded-clay-md border border-neutral-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-neutral-800">Atendimento Padrão</span>
                                    <span className="text-primary-600 font-bold">R$ 100,00</span>
                                </div>
                                <div className="text-sm text-neutral-500 flex items-center gap-1">
                                    <Clock size={14} />
                                    60 minutos
                                </div>
                            </div>

                            <p className="text-xs text-center text-neutral-400">Você poderá editar e adicionar mais serviços depois.</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                    <Calendar size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-neutral-800">Horários</h2>
                                <p className="text-sm text-neutral-500 mt-2">Definiremos um horário comercial padrão.</p>
                            </div>

                            <div className="bg-neutral-50 p-4 rounded-clay-md border border-neutral-200 text-center">
                                <p className="font-bold text-neutral-800">Segunda a Sexta</p>
                                <p className="text-primary-600 font-medium mt-1">09:00 às 18:00</p>
                            </div>

                            <p className="text-xs text-center text-neutral-400">Você poderá personalizar seus horários no painel.</p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-end">
                        <ClayButton
                            onClick={handleNext}
                            isLoading={isLoading}
                            className="w-full sm:w-auto"
                        >
                            {step === 3 ? "Concluir Setup" : "Continuar"}
                            {step !== 3 && <ChevronRight className="ml-2 h-4 w-4" />}
                        </ClayButton>
                    </div>
                </ClayCard>
            </div>
        </div>
    )
}
