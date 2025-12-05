import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const searchParams = request.nextUrl.searchParams
        const date = searchParams.get('date')

        let query = supabaseAdmin
            .from('Booking')
            .select('*')
            .eq('userId', session.user.id)
            .order('startTime', { ascending: true })

        if (date) {
            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)
            
            query = query
                .gte('startTime', startOfDay.toISOString())
                .lte('startTime', endOfDay.toISOString())
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching bookings:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ bookings: data || [] })
    } catch (error: any) {
        console.error('Error in bookings API:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
