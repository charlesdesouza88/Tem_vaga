import { supabaseAdmin } from "@/lib/supabase"
import { Database } from "@/types/supabase"
import { sendWaitlistOffer } from "./whatsapp"
import { createWaitlistUpdate } from "@/lib/supabase-helpers"

type Booking = Database['public']['Tables']['Booking']['Row']

export async function offerSlotToWaitlist(businessId: string, cancelledBooking: Booking) {
    console.log("Checking waitlist for business", businessId, "and date", cancelledBooking.dataHora)

    // Find the earliest WaitlistEntry with:
    // same businessId
    // status = ATIVO
    // dataDesejada same day as cancelledBooking.dataHora

    const startOfDay = new Date(cancelledBooking.dataHora)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(cancelledBooking.dataHora)
    endOfDay.setHours(23, 59, 59, 999)

    const { data, error } = await supabaseAdmin
        .from('WaitlistEntry')
        .select('*, business:Business(*)')
        .eq('businessId', businessId)
        .eq('status', 'ATIVO')
        .gte('dataDesejada', startOfDay.toISOString())
        .lte('dataDesejada', endOfDay.toISOString())
        .order('createdAt', { ascending: true })
        .limit(1)
        .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error("Error fetching waitlist entry:", error)
        return
    }

    // Explicitly cast to handle the join type correctly
    const entry = data as unknown as (Database['public']['Tables']['WaitlistEntry']['Row'] & { business: Database['public']['Tables']['Business']['Row'] }) | null

    if (entry) {
        console.log("Would notify", entry.clienteNome, "about new slot", cancelledBooking.dataHora)

        // Update entry status to OFERECIDO
        const { error: updateError } = await supabaseAdmin
            .from('WaitlistEntry')
            .update(createWaitlistUpdate({
                status: 'OFERECIDO'
            }))
            .eq('id', entry.id)

        if (updateError) {
            console.error("Error updating waitlist entry:", updateError)
            return
        }

        // Send notification
        // @ts-ignore - Supabase join returns business as array or object depending on query, but here it's single
        await sendWaitlistOffer(entry, cancelledBooking, entry.business)
    } else {
        console.log("No waitlist entries found for this slot.")
    }
}
