import { createClient } from '@supabase/supabase-js'

// The anon key is public by design; env vars override these defaults.
const URL = import.meta.env.VITE_SUPABASE_URL || 'https://jvcnurdlveephjjoogin.supabase.co'
const KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2Y251cmRsdmVlcGhqam9vZ2luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwOTgxMDMsImV4cCI6MjEwNzY3NDEwM30.14VzAbv_cts9ff7N8WMHqshBpqGpHtcpLwvWWIEKz40'

export const BUCKET = 'posters'
export const supabase = createClient(URL, KEY)
