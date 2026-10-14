import { createClient } from '@supabase/supabase-js'
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const supabase = url && key ? createClient(url, key) : null
export async function accountApi(path = '', body) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi. Isi file .env.local sesuai panduan setup.')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Silakan masuk kembali.')
  const response = await fetch(`/api/v1/me${path}`, {
    method: body ? 'PATCH' : 'GET',
    headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Data belum dapat diproses.')
  return data
}
