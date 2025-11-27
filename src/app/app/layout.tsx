import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Calendar, MessageSquare, Users, Settings, LogOut, Store } from "lucide-react"
import { ClayCard } from "@/components/ui/clay-card"

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth/login")
    }

    return (
        <div className="min-h-screen bg-primary-50/50 flex flex-col md:flex-row font-sans">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-white/20 h-screen sticky top-0 shadow-clay-lg z-20">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-10 h-10 bg-primary-500 rounded-clay-sm flex items-center justify-center text-white shadow-clay-sm">
                            <Store size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-neutral-800 tracking-tight">Tem_vaga</h1>
                    </div>
                    <p className="text-xs text-neutral-500 ml-1">Painel do Profissional</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavLink href="/app/agenda" icon={<Calendar size={20} />} label="Agenda" />
                    <NavLink href="/app/servicos" icon={<Store size={20} />} label="Serviços" />
                    <NavLink href="/app/horarios" icon={<ClockIcon size={20} />} label="Horários" />
                    <NavLink href="/app/clientes" icon={<Users size={20} />} label="Clientes" />
                    <NavLink href="/app/configuracoes" icon={<Settings size={20} />} label="Configurações" />
                </nav>

                <div className="p-6 border-t border-neutral-100/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                            {session.user?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-neutral-800 truncate">{session.user?.name}</p>
                            <p className="text-xs text-neutral-500 truncate">{session.user?.email}</p>
                        </div>
                    </div>
                    <Link
                        href="/api/auth/signout"
                        className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-clay-md transition-all text-sm font-medium group"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Sair
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-neutral-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-clay-sm flex items-center justify-center text-white">
                        <Store size={16} />
                    </div>
                    <span className="font-bold text-neutral-800">Tem_vaga</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                    {session.user?.name?.charAt(0) || "U"}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-24 md:pb-8">
                <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 flex justify-around p-2 z-30 safe-area-pb shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <MobileNavLink href="/app/agenda" icon={<Calendar size={24} />} label="Agenda" />
                <MobileNavLink href="/app/servicos" icon={<Store size={24} />} label="Serviços" />
                <MobileNavLink href="/app/clientes" icon={<Users size={24} />} label="Clientes" />
                <MobileNavLink href="/app/configuracoes" icon={<Settings size={24} />} label="Config" />
            </nav>
        </div>
    )
}

function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-primary-50 hover:text-primary-600 hover:shadow-clay-sm rounded-clay-md transition-all duration-200 font-medium group"
        >
            <span className="group-hover:scale-110 transition-transform duration-200">{icon}</span>
            {label}
        </Link>
    )
}

function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center p-2 text-neutral-500 hover:text-primary-600 transition-colors"
        >
            {icon}
            <span className="text-[10px] mt-1 font-medium">{label}</span>
        </Link>
    )
}

function ClockIcon({ size }: { size: number }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    )
}
