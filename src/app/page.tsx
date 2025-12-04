import Link from "next/link"

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
            {/* Header */}
            <header className="border-b border-neutral-200 bg-white py-4 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="font-bold text-2xl text-primary-600">Tem_vaga</div>
                    <nav className="flex items-center gap-4">
                        <Link
                            href="/auth/login"
                            className="text-sm font-bold text-neutral-800 hover:text-primary-700 transition-colors px-4 py-2 rounded-xl hover:bg-neutral-100"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/auth/register"
                            className="text-sm font-bold bg-primary-700 text-black px-5 py-2.5 rounded-xl hover:bg-primary-800 transition-all shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 active:scale-95"
                        >
                            Criar conta
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900 mb-6">
                        Agendamentos automáticos para profissionais do Brasil
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-600 mb-10 max-w-3xl mx-auto">
                        Simplifique sua agenda. Deixe seus clientes marcarem horário pelo WhatsApp e foque no seu trabalho.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 sm:mb-16">
                        <Link
                            href="/auth/register"
                            className="w-full sm:w-auto px-8 py-4 bg-primary-700 text-black rounded-xl font-bold text-lg hover:bg-primary-800 transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 active:scale-95 text-center"
                        >
                            Criar conta grátis
                        </Link>
                        <Link
                            href="/auth/login"
                            className="w-full sm:w-auto px-8 py-4 bg-neutral-800 text-white rounded-xl font-bold text-lg hover:bg-neutral-900 transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-400 active:scale-95 text-center"
                        >
                            Entrar no App
                        </Link>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mt-16">
                        <div className="bg-white p-8 rounded-2xl border-2 border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-primary-700 text-black rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Agenda Online</h3>
                            <p className="text-neutral-700">Seus clientes agendam direto pelo link, sem precisar ligar</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border-2 border-neutral-200 hover:border-accent-300 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-accent-700 text-black rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">WhatsApp Bot</h3>
                            <p className="text-neutral-700">Respostas automáticas para dúvidas frequentes dos clientes</p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl border-2 border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 bg-primary-700 text-black rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-2">Google Calendar</h3>
                            <p className="text-neutral-700">Sincronização automática com sua agenda do Google</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-8 border-t border-neutral-200 bg-white text-center">
                <p className="text-neutral-500 text-sm">
                    &copy; {new Date().getFullYear()} Tem_vaga. Feito para o Brasil 🇧🇷
                </p>
            </footer>
        </div>
    )
}
