import { createClient } from '@supabase/supabase-js'
import { readSupabaseConfig } from './supabaseConfig.js'
const config = readSupabaseConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)
export const supabaseConfigError = config.error || ''
export const supabase = config.error ? null : createClient(config.url, config.key)
export async function accountApi(path = '', body) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi. Isi file .env.local sesuai panduan setup.')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Silakan masuk kembali.')
  const response = await fetch(`/api/v1/me${path}`, {
    method: body ? 'PATCH' : 'GET',
    headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await response.json().catch(() => null)
  if (!data) throw new Error('API server belum dapat diakses. Jalankan server API, lalu coba kembali.')
  if (!response.ok) throw new Error(data.error || 'Data belum dapat diproses.')
  return data
}
