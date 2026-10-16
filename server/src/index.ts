import { createClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY
if (!url || !key) throw new Error('Isi SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY pada server/.env')
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const admin = adminKey ? createClient(url, adminKey, { auth: { persistSession: false, autoRefreshToken: false } }) : undefined
const app = createApp(token => createClient(url, key, { global: { headers: token ? { Authorization: `Bearer ${token}` } : {} }, auth: { persistSession: false, autoRefreshToken: false } }), admin)
app.listen(Number(process.env.PORT || 3001), '127.0.0.1', () => console.log('BahasaKita API siap'))
