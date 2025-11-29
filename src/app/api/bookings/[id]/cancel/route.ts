import { supabaseAdmin } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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

        // Cast to handle the join
        const booking = bookingData as unknown as Booking & { business: Business }

        // 2. Verify ownership
        // Check if the session user owns the business associated with the booking
        const { data: business, error: businessError } = await supabaseAdmin
            .from('Business')
            .select('*')
            .eq('ownerId', session.user.id as string)
            .eq('id', booking.businessId)
            .single()

        if (businessError || !business) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        // 3. Update booking
        const { data: updatedBookingData, error: updateError } = await supabaseAdmin
            .from('Booking')
            .update(createBookingUpdate({
                status: "CANCELADO",
                cancelledAt: new Date().toISOString(),
            }))
            .eq('id', bookingId)
            .select()
            .single()

        if (updateError || !updatedBookingData) {
            throw updateError || new Error("Failed to update booking")
        }

        const updatedBooking = updatedBookingData as Booking

        // 4. Trigger waitlist logic
        await offerSlotToWaitlist(updatedBooking.businessId, updatedBooking)

        // 5. Notify customer
        await sendCancellationNotification(updatedBooking, booking.business)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Cancellation error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
