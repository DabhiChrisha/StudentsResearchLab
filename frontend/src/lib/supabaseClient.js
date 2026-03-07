import { createClient } from '@supabase/supabase-js'

// Using descriptive placeholders that won't crash the app initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

// Initialize the client. If placeholders are used, actual requests will fail gracefully
// but the app will still load correctly.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * NOTE TO USER:
 * To make the Join Us system work, please create a .env file in your root directory with:
 * VITE_SUPABASE_URL=your_actual_supabase_url
 * VITE_SUPABASE_ANON_KEY=your_actual_anon_key
 */
