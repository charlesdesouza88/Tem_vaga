import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"
import { sendBookingConfirmation } from "@/lib/whatsapp"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { businessId, servicoId, dataHora, clienteNome, clienteWhats, joinWaitlist } = body

        if (!businessId || !servicoId || !dataHora || !clienteNome || !clienteWhats) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        const bookingId = crypto.randomUUID()
        const bookingDate = new Date(dataHora)

        // Create Booking
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('Booking')
            .insert({
                id: bookingId,
                businessId,
                servicoId,
                clienteNome,
                clienteWhats,
                dataHora: bookingDate.toISOString(),
                status: "AGENDADO",
                updatedAt: new Date().toISOString(),
            })
            .select('*, business:Business(*), servico:Servico(*)')
            .single()

        if (bookingError) {
            console.error("Supabase Booking Create Error:", bookingError)
            throw bookingError
        }

        // Handle Waitlist
        if (joinWaitlist) {
            const waitlistId = crypto.randomUUID()
            const { error: waitlistError } = await supabaseAdmin
                .from('WaitlistEntry')
                .insert({
                    id: waitlistId,
                    businessId,
                    clienteNome,
                    clienteWhats,
                    dataDesejada: bookingDate.toISOString(),
                    bookingId: bookingId,
                    status: "ATIVO",
                    updatedAt: new Date().toISOString(),
                })

            if (waitlistError) {
                console.error("Supabase Waitlist Create Error:", waitlistError)
                // Log error but don't fail the booking
            }
        }

        // Send Confirmation
        // Note: booking.business might be an array or object depending on Supabase response.
        // We cast or check it.
        const businessData = Array.isArray(booking.business) ? booking.business[0] : booking.business

        if (businessData) {
            await sendBookingConfirmation(booking, businessData)

            // Sync to Google Calendar
            if (businessData.googleRefreshToken) {
                try {
                    const { google } = require('googleapis')
                    const oauth2Client = new google.auth.OAuth2(
                        process.env.GOOGLE_CLIENT_ID,
                        process.env.GOOGLE_CLIENT_SECRET
                    )

                    oauth2Client.setCredentials({
                        refresh_token: businessData.googleRefreshToken
                    })

                    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

                    const event = {
                        summary: `Agendamento: ${booking.servico.nome} - ${booking.clienteNome}`,
                        description: `Cliente: ${booking.clienteNome}\nWhatsApp: ${booking.clienteWhats}\nServiço: ${booking.servico.nome}`,
                        start: {
                            dateTime: booking.dataHora, // ISO string
                            timeZone: 'America/Sao_Paulo', // Ideally from business settings
                        },
                        end: {
                            dateTime: new Date(new Date(booking.dataHora).getTime() + booking.servico.duracaoMin * 60000).toISOString(),
                            timeZone: 'America/Sao_Paulo',
                        },
                    }

                    const calendarId = businessData.googleCalendarId || 'primary'

                    const { data: googleEvent } = await calendar.events.insert({
                        calendarId: calendarId,
                        resource: event,
                    })

                    if (googleEvent.id) {
                        await supabaseAdmin
                            .from('Booking')
                            .update({ googleEventId: googleEvent.id })
                            .eq('id', booking.id)
                    }
                } catch (googleError) {
                    console.error("Google Calendar Sync Error:", googleError)
                    // Don't fail the request, just log
                }
            }
        }

        return NextResponse.json({ booking })
    } catch (error) {
        console.error("Booking error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
