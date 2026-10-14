import { createClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY
if (!url || !key) throw new Error('Isi SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY pada server/.env')
const app = createApp(token => createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } }))
app.listen(Number(process.env.PORT || 3001), '127.0.0.1', () => console.log('BahasaKita API siap'))
