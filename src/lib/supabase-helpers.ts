import { Database } from "@/types/supabase"

/**
 * Type-safe helper to create Supabase update objects
 * This helps avoid TypeScript's overly strict inference with Supabase updates
 * 
 * Note: Supabase's TypeScript inference can be overly strict with update operations.
 * These helpers use `any` to bypass this limitation while maintaining runtime safety.
 */

export function createBookingUpdate(
    update: Partial<Database['public']['Tables']['Booking']['Row']>
): any {
    return update
}

export function createWaitlistUpdate(
    update: Partial<Database['public']['Tables']['WaitlistEntry']['Row']>
): any {
    return update
}

export function createBusinessUpdate(
    update: Partial<Database['public']['Tables']['Business']['Row']>
): any {
    return update
}

export function createServiceUpdate(
    update: Partial<Database['public']['Tables']['Servico']['Row']>
): any {
    return update
}
