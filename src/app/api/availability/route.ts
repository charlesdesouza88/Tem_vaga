import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { google } from "googleapis"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const businessId = searchParams.get("businessId")
    const dateStr = searchParams.get("date") // YYYY-MM-DD or ISO
    const durationStr = searchParams.get("duration")

    if (!businessId || !dateStr || !durationStr) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const duration = parseInt(durationStr)
    const date = new Date(dateStr)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString()
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString()

    try {
        // 1. Fetch Business
        const { data: business } = await supabaseAdmin
            .from('Business')
            .select('*')
            .eq('id', businessId)
            .single()

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 })
        }

        // Fetch Hours separately
        const { data: horarios } = await supabaseAdmin
            .from('HorarioAtendimento')
            .select('*')
            .eq('businessId', businessId)
            .eq('ativo', true)

        // 2. Generate Potential Slots
        const dayOfWeek = new Date(dateStr).getDay() // 0=Sun
        const horario = horarios?.find((h: any) => h.diaSemana === dayOfWeek)

        if (!horario) {
            return NextResponse.json({ slots: [] }) // Closed
        }

        const potentialSlots: { start: Date, end: Date }[] = []
        let currentMin = horario.inicioMin
        const endMin = horario.fimMin

        while (currentMin + duration <= endMin) {
            const slotStart = new Date(dateStr)
            slotStart.setHours(Math.floor(currentMin / 60), currentMin % 60, 0, 0)

            const slotEnd = new Date(slotStart.getTime() + duration * 60000)

            potentialSlots.push({ start: slotStart, end: slotEnd })
            currentMin += duration
        }

        // 3. Fetch Existing Bookings (Supabase)
        const { data: bookings } = await supabaseAdmin
            .from('Booking')
            .select('dataHora, servico:Servico(duracaoMin)')
            .eq('businessId', businessId)
            .gte('dataHora', startOfDay)
            .lte('dataHora', endOfDay)
            .neq('status', 'CANCELADO')

        // 4. Fetch Google Calendar Busy Times
        let googleBusy: { start: Date, end: Date }[] = []

        if (business.googleRefreshToken && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
            try {
                const oauth2Client = new google.auth.OAuth2(
                    process.env.GOOGLE_CLIENT_ID,
                    process.env.GOOGLE_CLIENT_SECRET
                )
                oauth2Client.setCredentials({ refresh_token: business.googleRefreshToken })

                const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

                const response = await calendar.freebusy.query({
                    requestBody: {
                        timeMin: startOfDay,
                        timeMax: endOfDay,
                        items: [{ id: business.googleCalendarId || 'primary' }]
                    }
                })

                const busy = response.data.calendars?.[business.googleCalendarId || 'primary']?.busy
                if (busy) {
                    googleBusy = busy.map((b: any) => ({
                        start: new Date(b.start!),
                        end: new Date(b.end!)
                    }))
                }
            } catch (error) {
                console.error("Google Calendar FreeBusy Error:", error)
                // Continue without Google data if error
            }
        }

        // 5. Filter Slots
        const availableSlots = potentialSlots.filter(slot => {
            // Check Supabase Bookings
            const overlapBooking = bookings?.some((b: any) => {
                const bStart = new Date(b.dataHora)
                const bEnd = new Date(bStart.getTime() + b.servico.duracaoMin * 60000)
                return (slot.start < bEnd && slot.end > bStart)
            })
            if (overlapBooking) return false

            // Check Google Busy
            const overlapGoogle = googleBusy.some(b => {
                return (slot.start < b.end && slot.end > b.start)
            })
            if (overlapGoogle) return false

            return true
        })

        // Format for frontend
        const formattedSlots = availableSlots.map(s =>
            `${s.start.getHours().toString().padStart(2, '0')}:${s.start.getMinutes().toString().padStart(2, '0')}`
        )

        return NextResponse.json({ slots: formattedSlots })

    } catch (error) {
        console.error("Availability API Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
