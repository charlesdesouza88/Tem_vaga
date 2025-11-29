import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { Database } from "@/types/supabase"
import { offerSlotToWaitlist } from "@/lib/waitlist"
import { sendCancellationNotification, sendBookingConfirmation } from "@/lib/whatsapp"
import { createBookingUpdate } from "@/lib/supabase-helpers"

type Booking = Database['public']['Tables']['Booking']['Row']
type BookingInsert = Database['public']['Tables']['Booking']['Insert']

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { oldBookingId, newBooking } = body

        if (!oldBookingId || !newBooking) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // 1. Fetch old booking to verify it exists and get details
        const { data: oldBookingData, error: oldBookingError } = await supabaseAdmin
            .from('Booking')
            .select('*, business:Business(*)')
            .eq('id', oldBookingId)
            .single()

        if (oldBookingError || !oldBookingData) {
            return NextResponse.json({ error: "Old booking not found" }, { status: 404 })
        }

        const oldBooking = oldBookingData as unknown as Booking & { business: Database['public']['Tables']['Business']['Row'] }

        // 2. Verify phone number matches (Security check)
        // The user must provide the same phone number to authorize rescheduling
        if (newBooking.clienteWhats !== oldBooking.clienteWhats) {
            return NextResponse.json({ error: "Phone number mismatch. Please use the same phone number." }, { status: 403 })
        }

        // 3. Create new booking
        const { data: createdBookingData, error: createError } = await supabaseAdmin
            .from('Booking')
            .insert({
                ...newBooking,
                status: 'AGENDADO'
            })
            .select()
            .single()

        if (createError || !createdBookingData) {
            console.error("Error creating new booking:", createError)
            return NextResponse.json({ error: "Failed to create new booking" }, { status: 500 })
        }

        const createdBooking = createdBookingData as Booking

        // 4. Cancel old booking
        const { error: cancelError } = await supabaseAdmin
            .from('Booking')
            .update(createBookingUpdate({
                status: 'CANCELADO',
                cancellationReason: 'Reagendado pelo cliente',
                cancelledAt: new Date().toISOString()
            }))
            .eq('id', oldBookingId)

        if (cancelError) {
            console.error("Error cancelling old booking:", cancelError)
            // Note: We have a new booking but failed to cancel the old one. 
            // In a real app, we should alert admin or retry.
        } else {
            // 5. Trigger waitlist for the old slot
            await offerSlotToWaitlist(oldBooking.businessId, oldBooking)
        }

        // 6. Send notifications
        // Notify about new booking
        await sendBookingConfirmation(createdBooking, oldBooking.business)

        // We don't send cancellation notification for the old one to avoid spam, 
        // or we can send a specific "Rescheduled" message if we had a template.
        // For now, the confirmation of the new one is sufficient.

        return NextResponse.json({ success: true, booking: createdBooking })

    } catch (error) {
        console.error("Reschedule error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
