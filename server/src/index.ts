import express from 'express'
import helmet from 'helmet'
import { createClient } from '@supabase/supabase-js'
import { profileInput, preferencesInput } from './validation.js'
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY
if (!url || !key) throw new Error('Isi SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY pada server/.env')
const app = express()
app.use(helmet())
app.use(express.json({ limit: '16kb' }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/v1/me', async (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
  if (!token) { res.status(401).json({ error: 'Silakan masuk terlebih dahulu.' }); return }
  const client = createClient(url, key, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await client.auth.getUser(token)
  if (error || !data.user) { res.status(401).json({ error: 'Sesi tidak valid. Silakan masuk kembali.' }); return }
  res.locals.client = client
  res.locals.user = data.user
  next()
})
app.get('/api/v1/me', async (_req, res) => {
  const { data, error } = await res.locals.client.from('learner_profiles').select('name,grade,goal,preferences').eq('user_id', res.locals.user.id).single()
  if (error) { res.status(503).json({ error: 'Profil belum dapat dimuat. Periksa konfigurasi database.' }); return }
  res.json({ profile: { name: data.name, grade: data.grade, goal: data.goal, email: res.locals.user.email }, preferences: data.preferences })
})
for (const kind of ['profile', 'preferences']) app.patch(`/api/v1/me/${kind}`, async (req, res) => {
  let patch
  try { patch = kind === 'profile' ? profileInput(req.body) : { preferences: preferencesInput(req.body) } }
  catch (e) { res.status(400).json({ error: (e as Error).message }); return }
  const { data, error } = await res.locals.client.from('learner_profiles').update(patch).eq('user_id', res.locals.user.id).select('name,grade,goal,preferences').single()
  if (error) { res.status(503).json({ error: 'Perubahan belum tersimpan. Coba kembali.' }); return }
  res.json(data)
})
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(err.status === 400 || err.status === 413 ? err.status : 500).json({ error: 'Permintaan belum dapat diproses.' })
})
app.listen(Number(process.env.PORT || 3001), '127.0.0.1', () => console.log('BahasaKita API siap'))
