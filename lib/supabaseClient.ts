
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug log for environment variables (Helpful for browser-side debugging)
if (typeof window !== 'undefined') {
    console.log('Supabase Initialization:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        urlPrefix: supabaseUrl?.substring(0, 10)
    })
}

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') console.error('Supabase configuration is missing!')
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
