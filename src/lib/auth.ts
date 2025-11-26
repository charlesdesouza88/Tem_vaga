import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabaseAdmin as supabase } from "@/lib/supabase-admin"
import { verifyPassword } from "@/lib/password"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log("Auth failed: Missing credentials")
                    return null
                }

                const { data: user, error } = await supabase
                    .from('User')
                    .select('*')
                    .eq('email', credentials.email)
                    .single()

                if (error || !user) {
                    console.log("Auth failed: User not found", error)
                    return null
                }

                // Use bcrypt to verify password
                const isValid = await verifyPassword(
                    credentials.password,
                    user.passwordHash
                )

                if (!isValid) {
                    console.log("Auth failed: Invalid password")
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.sub as string
            }
            return session
        },
    },
}
