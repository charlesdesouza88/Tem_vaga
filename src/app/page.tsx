import Link from "next/link"

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
            <header className="border-b border-slate-100 py-4">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="font-bold text-xl text-blue-600">AgendamentoFácil</div>
                    <nav className="space-x-4">
                        <Link href="/auth/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                            Entrar
                        </Link>
                        <Link
                            href="/auth/register"
                            className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Criar conta
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
                        Agendamentos automáticos para profissionais do Brasil
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10">
                        Simplifique sua agenda. Deixe seus clientes marcarem horário pelo WhatsApp e foque no seu trabalho.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/app"
                            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Entrar no App
                        </Link>
                        <Link
                            href="/auth/register"
                            className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-semibold text-lg hover:bg-slate-50 transition-all"
                        >
                            Criar conta grátis
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="py-8 border-t border-slate-100 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} AgendamentoFácil. Feito para o Brasil 🇧🇷
            </footer>
        </div>
    )
}
