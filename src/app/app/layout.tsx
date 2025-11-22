import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Calendar, MessageSquare, Users, Settings, LogOut } from "lucide-react"

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
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-bold text-blue-600">AgendamentoFácil</h1>
                    <p className="text-xs text-slate-500 mt-1">Olá, {session.user?.name?.split(" ")[0]}</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <NavLink href="/app/agenda" icon={<Calendar size={20} />} label="Agenda" />
                    <NavLink href="/app/mensagens" icon={<MessageSquare size={20} />} label="Mensagens" />
                    <NavLink href="/app/clientes" icon={<Users size={20} />} label="Clientes" />
                    <NavLink href="/app/configuracoes" icon={<Settings size={20} />} label="Configurações" />
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <Link href="/api/auth/signout" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-md transition-colors text-sm font-medium">
                        <LogOut size={20} />
                        Sair
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-10">
                <div className="font-bold text-blue-600">AgendamentoFácil</div>
                <div className="text-sm text-slate-600">{session.user?.name?.split(" ")[0]}</div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-10 safe-area-pb">
                <MobileNavLink href="/app/agenda" icon={<Calendar size={24} />} label="Agenda" />
                <MobileNavLink href="/app/mensagens" icon={<MessageSquare size={24} />} label="Msgs" />
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
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors font-medium"
        >
            {icon}
            {label}
        </Link>
    )
}

function MobileNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center p-2 text-slate-600 hover:text-blue-600"
        >
            {icon}
            <span className="text-[10px] mt-1 font-medium">{label}</span>
        </Link>
    )
}
