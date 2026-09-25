import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://kgltgtkpftchosgpknjz.supabase.co',
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ZqKl-PamxFMMng1ji5Z5VQ_OvkL1KbC'
)
