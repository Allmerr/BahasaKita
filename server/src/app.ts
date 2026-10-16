import express from 'express'
import helmet from 'helmet'
import { randomUUID } from 'node:crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { profileInput, preferencesInput } from './validation.js'
import { AVATAR_BUCKET, AVATAR_LIMIT, avatarExtension, ownsAvatar } from './avatar.js'
import { installLearningRoutes } from './learning-routes.js'
import { installSupportRoutes } from './support-routes.js'
import { installAdminUsers } from './admin-users.js'

export function createApp(clientForToken: (token: string) => SupabaseClient, adminClient?: SupabaseClient) {
  const app = express()
  app.use(helmet())
  app.use(express.json({ limit: '128kb' }))
  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
  app.use('/api/v1/me', async (req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1]
    if (!token) { res.status(401).json({ error: 'Silakan masuk terlebih dahulu.' }); return }
    const client = clientForToken(token)
    const { data, error } = await client.auth.getUser(token)
    if (error && (error.status === 0 || error.status === 429 || (error.status ?? 0) >= 500 || error.name === 'AuthRetryableFetchError')) {
      res.status(503).json({ error: 'Layanan akun belum dapat dihubungi. Periksa koneksi lalu coba lagi.' }); return
    }
    if (error || !data.user) { res.status(401).json({ error: 'Sesi tidak valid. Silakan masuk kembali.' }); return }
    res.locals.client = client
    res.locals.user = data.user
    next()
  })

  app.delete('/api/v1/me/account', async (req, res) => {
    if (req.body?.confirmation !== 'HAPUS AKUN') { res.status(400).json({ error: 'Ketik HAPUS AKUN untuk mengonfirmasi.' }); return }
    if (!adminClient) { res.status(503).json({ error: 'Penghapusan akun belum dikonfigurasi oleh pengelola.' }); return }
    const id = res.locals.user.id
    // Remove owned files through Storage API before Auth deletion; never delete storage metadata with SQL.
    while (true) {
      const listed = await adminClient.storage.from(AVATAR_BUCKET).list(id, { limit: 100 })
      if (listed.error) { res.status(503).json({ error: 'Foto akun belum dapat dibersihkan. Coba lagi.' }); return }
      const paths = (listed.data || []).filter(file => file.id).map(file => `${id}/${file.name}`)
      if (!paths.length) break
      const removed = await adminClient.storage.from(AVATAR_BUCKET).remove(paths)
      if (removed.error) { res.status(503).json({ error: 'Foto akun belum dapat dibersihkan. Coba lagi.' }); return }
    }
    const { error } = await adminClient.auth.admin.deleteUser(id)
    if (error) { res.status(503).json({ error: 'Akun belum berhasil dihapus. Coba lagi. Foto profil mungkin sudah dibersihkan.' }); return }
    res.json({ deleted: true })
  })

  async function avatarData(res: express.Response, path: unknown) {
    if (!ownsAvatar(path, res.locals.user.id)) return { avatar_path: null, avatar_url: null }
    const { data, error } = await res.locals.client.storage.from(AVATAR_BUCKET).createSignedUrl(path, 3600)
    return { avatar_path: path, avatar_url: error ? null : data.signedUrl }
  }
  async function discardAvatar(res: express.Response, path: unknown) {
    if (ownsAvatar(path, res.locals.user.id)) await res.locals.client.storage.from(AVATAR_BUCKET).remove([path]).catch(() => {})
  }
  async function readProfile(res: express.Response) {
    return res.locals.client.from('learner_profiles').select('*').eq('user_id', res.locals.user.id).single()
  }
  function saveError(res: express.Response, error: { code?: string } | null, avatar = false) {
    const migrationMissing = error?.code === '42703' || error?.code === 'PGRST204'
    res.status(error?.code === '23514' ? 400 : 503).json({ error: migrationMissing && avatar
      ? 'Penyimpanan foto profil belum dikonfigurasi.'
      : error?.code === '23514' ? 'Perubahan belum tersimpan. Jenjang ini belum didukung oleh pengaturan akun saat ini.'
      : 'Perubahan belum tersimpan. Coba kembali.' })
  }
  app.get('/api/v1/me', async (_req, res) => {
    const { data, error } = await readProfile(res)
    if (error) { res.status(503).json({ error: 'Profil belum dapat dimuat. Periksa konfigurasi database.' }); return }
    const avatar = await avatarData(res, data.avatar_path)
    res.json({ profile: { name: data.name, grade: data.grade, goal: data.goal, email: res.locals.user.email, ...avatar }, preferences: data.preferences })
  })
  for (const kind of ['profile', 'preferences']) app.patch(`/api/v1/me/${kind}`, async (req, res) => {
    let patch
    try { patch = kind === 'profile' ? profileInput(req.body) : { preferences: preferencesInput(req.body) } }
    catch (error) { res.status(400).json({ error: (error as Error).message }); return }
    const { data, error } = await res.locals.client.from('learner_profiles').update(patch).eq('user_id', res.locals.user.id).select('*').single()
    if (error) { saveError(res, error); return }
    res.json({ name: data.name, grade: data.grade, goal: data.goal, preferences: data.preferences })
  })
  app.get('/api/v1/me/avatar', async (_req, res) => {
    const { data, error } = await readProfile(res)
    if (error) { saveError(res, error, true); return }
    res.json(await avatarData(res, data.avatar_path))
  })
  app.put('/api/v1/me/avatar', express.raw({ type: ['image/jpeg', 'image/png', 'image/webp'], limit: AVATAR_LIMIT }), async (req, res) => {
    let extension
    try { extension = avatarExtension(req.headers['content-type'] || '', req.body) }
    catch (error) { res.status(400).json({ error: (error as Error).message }); return }
    const current = await readProfile(res)
    if (current.error) { saveError(res, current.error, true); return }
    if (!Object.hasOwn(current.data, 'avatar_path')) { res.status(503).json({ error: 'Penyimpanan foto profil belum dikonfigurasi.' }); return }
    const path = `${res.locals.user.id}/${randomUUID()}.${extension}`
    const contentType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`
    const upload = await res.locals.client.storage.from(AVATAR_BUCKET).upload(path, req.body, { contentType, cacheControl: '3600', upsert: false })
    if (upload.error) { res.status(503).json({ error: 'Foto belum dapat diunggah. Periksa penyimpanan foto atau coba kembali.' }); return }
    const saved = await res.locals.client.from('learner_profiles').update({ avatar_path: path }).eq('user_id', res.locals.user.id).select('*').single()
    if (saved.error) { await discardAvatar(res, path); saveError(res, saved.error, true); return }
    await discardAvatar(res, current.data.avatar_path)
    res.json(await avatarData(res, path))
  })
  app.delete('/api/v1/me/avatar', async (_req, res) => {
    const current = await readProfile(res)
    if (current.error) { saveError(res, current.error, true); return }
    const saved = await res.locals.client.from('learner_profiles').update({ avatar_path: null }).eq('user_id', res.locals.user.id).select('*').single()
    if (saved.error) { saveError(res, saved.error, true); return }
    await discardAvatar(res, current.data.avatar_path)
    res.json({ avatar_path: null, avatar_url: null })
  })
  installLearningRoutes(app, clientForToken)
  installSupportRoutes(app)
  installAdminUsers(app, adminClient)
  app.use((error: { status?: number }, req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = error.status === 400 || error.status === 413 ? error.status : 500
    res.status(status).json({ error: status === 413 ? req.path.endsWith('/avatar')?'Berkas terlalu besar. Foto profil maksimal 2 MB.':'Permintaan terlalu besar.' : 'Permintaan belum dapat diproses.' })
  })
  return app
}
