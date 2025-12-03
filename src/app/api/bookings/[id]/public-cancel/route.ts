import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { offerSlotToWaitlist } from "@/lib/waitlist"
import { sendCancellationNotification } from "@/lib/whatsapp"
import { Database } from "@/types/supabase"
import { createBookingUpdate } from "@/lib/supabase-helpers"

type Booking = Database['public']['Tables']['Booking']['Row']
type Business = Database['public']['Tables']['Business']['Row']

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: bookingId } = await params

    try {
        // 1. Fetch booking with business
        const { data: bookingData, error: bookingError } = await supabaseAdmin
            .from('Booking')
            .select('*, business:Business(*)')
            .eq('id', bookingId)
            .single()

        if (bookingError || !bookingData) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 })
        }

        const booking = bookingData as unknown as Booking & { business: Business }

        // 2. Update booking
        const { data: updatedBookingData, error: updateError } = await (supabaseAdmin.from('Booking') as any)
            .update(createBookingUpdate({
                status: "CANCELADO" as const,
                cancelledAt: new Date().toISOString(),
            }))
            .eq('id', bookingId)
            .select()
            .single()

        if (updateError || !updatedBookingData) {
            throw updateError || new Error("Failed to update booking")
        }

        const updatedBooking = updatedBookingData as Booking

        // 3. Trigger waitlist logic
        await offerSlotToWaitlist(updatedBooking.businessId, updatedBooking)

        // 4. Notify customer
        await sendCancellationNotification(updatedBooking, booking.business)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Cancellation error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
