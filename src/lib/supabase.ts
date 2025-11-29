import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for client-side usage (uses anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    db: { schema: 'public' }
})

// Admin client for server-side usage (uses service role key)
// WARNING: Only use this on the server side!
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    },
    db: { schema: 'public' }
})
