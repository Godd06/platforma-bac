import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const env = typeof import.meta !== 'undefined' ? import.meta.env : undefined
const supabaseUrl = env?.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL : '') || ''
const supabasePublishableKey =
  env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
  env?.VITE_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process.env?.VITE_SUPABASE_ANON_KEY : '') ||
  ''

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    '[Supabase] Warning: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is missing in environment variables. Client initialized with fallback placeholders.'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key'
)

