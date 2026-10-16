import { createClient } from '@supabase/supabase-js'
import { createApp } from '../server/src/app.js'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY
if (!url || !key) throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY in Vercel.')

const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const admin = adminKey
  ? createClient(url, adminKey, { auth: { persistSession: false, autoRefreshToken: false } })
  : undefined

export default createApp(
  token => createClient(url, key, {
    global: { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    auth: { persistSession: false, autoRefreshToken: false },
  }),
  admin,
)
