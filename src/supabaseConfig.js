export function readSupabaseConfig(urlValue, keyValue) {
 const url = typeof urlValue === 'string' ? urlValue.trim() : ''
 const key = typeof keyValue === 'string' ? keyValue.trim() : ''
 if (!url || !key || /YOUR_PROJECT|YOUR_PUBLISHABLE_KEY/.test(`${url} ${key}`)) return { error: 'Supabase belum dikonfigurasi. Isi URL proyek dan publishable key di .env.local.' }
 let endpoint
 try { endpoint = new URL(url) } catch { return { error: 'URL Supabase tidak valid. Gunakan Project URL dari dashboard Supabase.' } }
 const local = ['localhost', '127.0.0.1', '[::1]'].includes(endpoint.hostname)
 if ((endpoint.protocol !== 'https:' && !(local && endpoint.protocol === 'http:')) || endpoint.username || endpoint.password || endpoint.pathname !== '/' || endpoint.search || endpoint.hash) return { error: 'Gunakan URL dasar proyek Supabase, misalnya https://nama-proyek.supabase.co.' }
 if (key.startsWith('sb_secret_')) return { error: 'Secret key tidak boleh dipakai di aplikasi browser. Gunakan publishable key atau anon public.' }
 if (!key.startsWith('sb_publishable_')) {
  try {
   const payload = key.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
   const claims = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')))
   if (claims.role !== 'anon') return { error: 'Gunakan anon public, bukan service role, untuk koneksi aplikasi.' }
  } catch { return { error: 'Format key tidak valid. Gunakan publishable key atau anon public dari proyek yang sama.' } }
 }
 return { url: endpoint.origin, key }
}
