import { createClient } from '@supabase/supabase-js'
import { readSupabaseConfig } from './supabaseConfig.js'
const config = readSupabaseConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY)
export const supabaseConfigError = config.error || ''
export const supabase = config.error ? null : createClient(config.url, config.key)
let pendingRefresh = null
const expiredSession = () => Object.assign(new Error('Sesi sudah berakhir. Silakan masuk kembali.'), { code: 'AUTH_SESSION_EXPIRED' })
async function clearExpiredSession() {
  // Clear this browser's session without signing out other devices.
  await supabase.auth.signOut({ scope: 'local' }).catch(() => {})
  throw expiredSession()
}
async function renewSession() {
  if (!pendingRefresh) pendingRefresh = supabase.auth.refreshSession().finally(() => { pendingRefresh = null })
  const { data, error } = await pendingRefresh
  if (error && (error.status === 0 || error.status === 429 || error.status >= 500 || error.name === 'AuthRetryableFetchError')) {
    throw new Error('Sesi belum dapat diperbarui. Periksa koneksi lalu coba lagi.')
  }
  if (error || !data?.session) return clearExpiredSession()
  return data.session
}
export async function fetchCatalog() {
 const response = await fetch('/api/catalog')
 const data = await response.json().catch(() => null)
 if (!response.ok || !Array.isArray(data?.lessons) || !Array.isArray(data?.basicMaterials)) throw new Error(data?.error || 'Materi belajar belum dapat dimuat. Coba kembali.')
 return data
}
export async function accountApi(path = '', body, options = {}) {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi. Isi file .env.local sesuai panduan setup.')
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !session) throw expiredSession()
  const binary = typeof Blob !== 'undefined' && body instanceof Blob
  const send = token => fetch(`/api/v1/me${path}`, {
    method: options.method || (body !== undefined ? 'PATCH' : 'GET'),
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': binary ? body.type : 'application/json' },
    ...(body !== undefined ? { body: binary ? body : JSON.stringify(body) } : {}),
    ...(options.signal ? { signal: options.signal } : {}),
  })
  let response = await send(session.access_token)
  if (response.status === 401) {
    const renewed = await renewSession()
    if (options.signal?.aborted) throw new DOMException('The request was aborted.', 'AbortError')
    response = await send(renewed.access_token)
    if (response.status === 401) return clearExpiredSession()
  }
  const data = await response.json().catch(() => null)
  if (!data) throw new Error('API server belum dapat diakses. Jalankan server API, lalu coba kembali.')
  if (!response.ok) throw new Error(data.error || 'Data belum dapat diproses.')
  return data
}
