"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
    const router = useRouter()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || "Erro ao criar conta")
            }

            // Auto login after register
            await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            router.push("/app/agenda")
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Crie sua conta</h1>
                    <p className="text-slate-600 mt-2">Comece a organizar seus agendamentos hoje</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Nome Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-300 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-300 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-300 transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-base hover:bg-[#128C7E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30 active:scale-95"
                    >
                        {loading ? "Criando conta..." : "Criar conta"}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    Já tem uma conta?{" "}
                    <Link href="/auth/login" className="text-blue-600 hover:underline">
                        Entrar
                    </Link>
                </div>
            </div>
        </div>
    )
}
