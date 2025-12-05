"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogIn } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError("Email ou senha inválidos")
            } else {
                router.push("/app/agenda")
                router.refresh()
            }
        } catch (err) {
            setError("Ocorreu um erro ao entrar")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-bold text-primary-600 mb-2">Tem_vaga</h1>
                    </Link>
                    <p className="text-neutral-700">Gerencie seus agendamentos com facilidade</p>
                </div>

                {/* Login Card */}
                <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-neutral-200">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-neutral-900">Bem-vindo de volta</h2>
                        <p className="text-neutral-700 mt-1">Entre na sua conta para continuar</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-300 transition-all"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-neutral-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-none focus:border-primary-600 focus:ring-4 focus:ring-primary-300 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-base hover:bg-[#128C7E] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/30 active:scale-95"
                        >
                            {loading ? (
                                "Entrando..."
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Entrar
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-neutral-600">
                            Não tem uma conta?{" "}
                            <Link href="/auth/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                                Cadastre-se grátis
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Back to home */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-800 transition-colors">
                        ← Voltar para o início
                    </Link>
                </div>
            </div>
        </div>
    )
}
