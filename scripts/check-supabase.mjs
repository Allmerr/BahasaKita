import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { readSupabaseConfig } from '../src/supabaseConfig.js'
const root = fileURLToPath(new URL('../.env.local', import.meta.url))
if (existsSync(root)) process.loadEnvFile(root)
const config = readSupabaseConfig(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)
if (config.error) { console.error(config.error); process.exitCode = 1 }
else {
 const server = fileURLToPath(new URL('../server/.env', import.meta.url))
 if (existsSync(server)) {
  process.loadEnvFile(server)
  const api = readSupabaseConfig(process.env.SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY)
  if (api.error || api.url !== config.url || api.key !== config.key) { console.error('Konfigurasi frontend dan server berbeda atau belum valid. Periksa .env.local dan server/.env.'); process.exitCode = 1 }
 } else { console.error('server/.env belum ada. Jalankan npm run setup:supabase.'); process.exitCode = 1 }
 if (!process.exitCode) {
  try {
   const headers = { apikey: config.key }
   const auth = await fetch(`${config.url}/auth/v1/settings`, { headers, signal: AbortSignal.timeout(15000) })
   if (!auth.ok) throw new Error(`Supabase menolak koneksi (HTTP ${auth.status}). Periksa URL dan public key dari proyek yang sama.`)
   console.log('OK: Supabase Auth dapat diakses dengan public key.')
   const table = await fetch(`${config.url}/rest/v1/learner_profiles?select=user_id&limit=0`, { headers, signal: AbortSignal.timeout(15000) })
   const body = await table.json().catch(() => null)
   if (body?.code === '42501') console.log('OK: tabel learner_profiles terdeteksi dan akses tamu ditolak.')
   else if (body?.code === 'PGRST205' || body?.code === '42P01') throw new Error('Tabel learner_profiles belum tersedia. Jalankan migrasi supabase/migrations/001_accounts.sql.')
   else if (table.ok) throw new Error('Tabel dapat diakses tanpa login. Periksa kembali GRANT dan RLS pada migrasi sebelum menyimpan data pengguna.')
   else throw new Error(`Pemeriksaan tabel belum berhasil (HTTP ${table.status}). Periksa migrasi, Data API, dan izin akses.`)
   console.log('Pemeriksaan ini tidak menulis data. Login dan simpan profil/pengaturan untuk memverifikasi penyimpanan akun.')
  } catch (error) {
   // Never print request headers, tokens or raw server responses.
   console.error(error.name === 'TimeoutError' || error.message === 'fetch failed' ? 'Koneksi Supabase gagal atau melewati batas waktu. Periksa jaringan dan status proyek.' : error.message)
   process.exitCode = 1
  }
 }
}
