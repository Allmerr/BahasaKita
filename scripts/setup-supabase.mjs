import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { readSupabaseConfig } from '../src/supabaseConfig.js'
const root = fileURLToPath(new URL('../.env.local', import.meta.url))
const server = fileURLToPath(new URL('../server/.env', import.meta.url))
if (!existsSync(root)) {
 writeFileSync(root, readFileSync(new URL('../.env.example', import.meta.url)), { flag: 'wx' })
 console.log('Dibuat: .env.local. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY, lalu jalankan setup lagi.')
}
process.loadEnvFile(root)
const config = readSupabaseConfig(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY)
if (config.error) { console.log(config.error); process.exitCode = 1 }
else {
 if (!existsSync(server)) {
  writeFileSync(server, `SUPABASE_URL=${config.url}\nSUPABASE_PUBLISHABLE_KEY=${config.key}\nPORT=3001\n`, { flag: 'wx' })
  console.log('Dibuat: server/.env dengan URL dan public key yang sama. Nilai key tidak ditampilkan.')
 } else console.log('server/.env sudah ada dan tidak diubah. Pemeriksaan koneksi akan memeriksa kecocokannya.')
 console.log('Selanjutnya: jalankan migrasi 001_accounts.sql lalu 002_learning_grades.sql di SQL Editor proyek, lalu npm run check:supabase.')
}
