import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { autoReplyEnabled, autoReplyConfig, endereco } = body

        const user = await prisma.user.findUnique({
            where: { id: session.user.id as string },
            include: { business: true },
        })

        if (!user?.business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 })
        }

        await prisma.business.update({
            where: { id: user.business.id },
            data: {
                autoReplyEnabled,
                autoReplyConfig,
                endereco,
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Settings update error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
