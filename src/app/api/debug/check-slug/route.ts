import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")
    const mode = searchParams.get("mode") // 'all', 'servicos', 'horarios', 'none'

    if (!slug) return NextResponse.json({ error: "Missing slug" })

    let selectQuery = '*'
    if (mode === 'servicos') selectQuery = '*, servicos:Servico(*)'
    else if (mode === 'horarios') selectQuery = '*, horarios:HorarioAtendimento(*)'
    else if (mode === 'all' || !mode) selectQuery = '*, servicos:Servico(*), horarios:HorarioAtendimento(*)'

    try {
        const { data, error } = await supabaseAdmin
            .from('Business')
            .select(selectQuery)
            .eq('slug', slug)
            .single()

        if (error) {
            return NextResponse.json({ error })
        }

        return NextResponse.json({ data })
    } catch (e) {
        return NextResponse.json({ error: "Exception", details: e })
    }
}
