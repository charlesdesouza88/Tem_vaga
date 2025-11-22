import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
// import { hash } from "bcryptjs"

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            )
        }

        // const passwordHash = await hash(password, 10)
        const passwordHash = password // TEMPORARY: Plain text for prototype

        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                // Create a default business for the user
                business: {
                    create: {
                        nome: `${name}'s Business`,
                        slug: name?.toLowerCase().replace(/\s+/g, '-') || email.split('@')[0],
                        telefoneWhats: "", // User needs to fill this
                    }
                }
            },
        })

        return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        )
    }
}
