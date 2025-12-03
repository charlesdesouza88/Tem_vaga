import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

async function test() {
    const supabaseAdmin = createClient<Database>('', '', {
        db: { schema: 'public' }
    })

    const payload: Database['public']['Tables']['Business']['Update'] = {
        googleRefreshToken: 'token',
        googleAccessToken: 'token',
        googleTokenExpiry: 123
    }

    // This matches the route code exactly
    await (supabaseAdmin
        .from('Business') as any)
        .update(payload)
        .eq('id', '1')
}
