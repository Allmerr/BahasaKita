import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync, writeFileSync, unlinkSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
const require = createRequire(import.meta.url)
const runtime = process.env.PLAYWRIGHT_MODULE_PATH || join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')
const { chromium } = require(require.resolve('playwright', { paths: [process.cwd(), runtime] }))
const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(path => path && existsSync(path))
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })
const configPath = join(process.cwd(), '.check-profile-vite.mjs')
writeFileSync(configPath, "import original from './vite.config.js'; export default input => { const config = original(input); return { ...config, server: { ...config.server, port: 5190, strictPort: true, open: false } }; };", { flag: 'wx' })
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--config', configPath, '--host', '127.0.0.1'], { windowsHide: true, stdio: 'pipe', env: { ...process.env, VITE_SUPABASE_URL: 'https://profile-check.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_profile_test' } })
const preferences = { textSize: 'normal', theme: 'light', speed: '1', comfortable: true, contrast: false, language: 'default', dataSaver: false }
const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'dina@example.test', app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: { name: 'Dina', grade: 'SD', goal: 'Mengenal kata' }, created_at: new Date().toISOString() }
const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url')
const token = encoded({ alg: 'HS256', typ: 'JWT' }) + '.' + encoded({ sub: user.id, aud: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600, iat: Math.floor(Date.now() / 1000) }) + '.test'
const session = { user, access_token: token, refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600 }
const profile = { name: 'Dina', grade: 'SD', goal: 'Mengenal kata', email: user.email, avatar_path: null, avatar_url: null }
const errors = []
let failUpload = false
try {
 const imagePage = await browser.newPage({ viewport: { width: 80, height: 80 } })
 await imagePage.setContent('<html><body style="margin:0;background:#9f75dc;width:80px;height:80px"></body></html>')
 const photo = await imagePage.screenshot()
 await imagePage.close()
 const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
 page.on('pageerror', error => errors.push(error.message))
 await page.route('https://profile-check.supabase.co/**', route => {
  const path = new URL(route.request().url()).pathname
  return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(path.endsWith('/token') ? session : path.endsWith('/user') ? user : {}) })
 })
 await page.route('**/__profile-photo.png', route => route.fulfill({ contentType: 'image/png', body: photo }))
 await page.route('**/api/catalog', route => route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({lessons:[],basicMaterials:[]})}))
 await page.route('**/api/v1/me**', async route => {
  const request = route.request()
  assert.equal(request.headers().authorization, 'Bearer ' + token)
  const path = new URL(request.url()).pathname
  let response
  if (path.endsWith('/profile')) {
   const body = request.postDataJSON()
   assert.deepEqual(Object.keys(body).sort(), ['goal', 'grade', 'name'])
   Object.assign(profile, body)
   response = { ...profile, preferences }
  } else if (path.endsWith('/avatar')) {
   if (request.method() === 'PUT') {
    assert.equal(request.headers()['content-type'], 'image/png')
    if (failUpload) { await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Foto belum dapat diunggah. Coba kembali.' }) }); return }
    profile.avatar_path = `${user.id}/photo.png`
    profile.avatar_url = 'http://127.0.0.1:5190/__profile-photo.png'
   } else if (request.method() === 'DELETE') { profile.avatar_path = null; profile.avatar_url = null }
   response = { avatar_path: profile.avatar_path, avatar_url: profile.avatar_url }
  } else if(path.endsWith('/access')) response={isAdmin:false}
  else if(path.endsWith('/learning')) response={assessment:{kosakata:100,kalimat:100,bacaan:100,akademik:100},attempts:[{type:'assessment',grade:profile.grade,scores:{kosakata:100,kalimat:100,bacaan:100,akademik:100}}],mastered:[],legacy:{archived:true},activeAssessment:null,assessmentDraft:null}
  else response = { profile, preferences }
  await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(response) })
 })
 await page.addInitScript(({ preferences, userId }) => {
  if (location.origin !== 'http://127.0.0.1:5190') return
  localStorage.setItem('bahasakita-preferences', JSON.stringify(preferences))
  localStorage.setItem('bahasakita-learning-' + userId, JSON.stringify({ assessment: { kosakata: 100, kalimat: 100, bacaan: 100, akademik: 100 }, attempts: [], mastered: [], assessmentDraft: null }))
 }, { preferences, userId: user.id })
 let connected = false
 for (let i = 0; i < 40; i++) {
  try { await page.goto('http://127.0.0.1:5190'); connected = true; break }
  catch { await new Promise(resolve => setTimeout(resolve, 200)) }
 }
 assert.ok(connected, 'Test frontend starts')
 const route = path => page.evaluate(path => { history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')) }, path)
 await page.getByRole('heading', { name: 'Caramu belajar, cerita hebatmu.' }).waitFor()
 await route('/signin')
 const login = async () => {
  await page.getByLabel('Email', { exact: true }).fill(user.email)
  await page.getByLabel('Kata sandi', { exact: true }).fill('ProfileTest123!')
  await page.getByRole('button', { name: 'Masuk dan lanjutkan', exact: true }).click()
  await page.getByRole('heading', { name: 'Halo, ' + profile.name + '!', exact: true }).waitFor()
 }
 await login()
 await page.getByRole('link', { name: 'Privasi & pengaturan', exact: true }).click()
 await page.getByLabel('Nama panggilan', { exact: true }).fill(' Dina Baru ')
 await page.locator('select[name="grade"]').selectOption('SMP')
 await page.locator('select[name="goal"]').selectOption('Memahami cerita')
 await page.getByRole('button', { name: 'Simpan profil', exact: true }).click()
 await page.getByText('Nama, jenjang, dan tujuan belajar berhasil disimpan.', { exact: true }).waitFor()
 await page.waitForFunction(() => document.querySelector('input[name="name"]').value === 'Dina Baru')
 assert.equal(profile.name, 'Dina Baru'); assert.equal(profile.grade, 'SMP'); assert.equal(profile.goal, 'Memahami cerita')
 await page.getByLabel('Pilih foto profil', { exact: true }).setInputFiles({ name: 'photo.png', mimeType: 'image/png', buffer: photo })
 await page.getByRole('button', { name: 'Simpan foto', exact: true }).click()
 await page.getByText('Foto profil berhasil disimpan.', { exact: true }).waitFor()
 await page.locator('.topbar .avatar img').waitFor()
 assert.equal(await page.locator('.profile-card-avatar img').count(), 1)
 await page.screenshot({ path: join(tmpdir(), 'bahasakita-profile-settings-desktop.png'), fullPage: true })
 await route('/profile')
 await page.getByRole('heading', { name: 'Profil saya', exact: true }).waitFor()
 for (const value of ['Dina Baru', 'SMP', 'Memahami cerita']) assert.ok((await page.locator('.profile-details').innerText()).includes(value))
 assert.equal(await page.locator('.profile-overview img').count(), 1)
 await page.setViewportSize({ width: 390, height: 844 })
 assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Profile has no mobile overflow')
 await page.screenshot({ path: join(tmpdir(), 'bahasakita-profile-mobile.png'), fullPage: true })
 await page.reload()
 await page.getByRole('heading', { name: 'Halo, Dina Baru!', exact: true }).waitFor()
 assert.equal(await page.locator('.topbar .avatar img').count(), 1, 'Photo persists after reload')
 await route('/settings')
 assert.equal(await page.locator('input[name="name"]').inputValue(), 'Dina Baru')
 assert.equal(await page.locator('select[name="grade"]').inputValue(), 'SMP')
 assert.equal(await page.locator('select[name="goal"]').inputValue(), 'Memahami cerita')
 await page.getByLabel('Pilih foto profil', { exact: true }).setInputFiles({ name: 'invalid.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg></svg>') })
 await page.getByText('Pilih foto JPG, PNG, atau WebP dengan ukuran maksimal 2 MB.', { exact: true }).waitFor()
 failUpload = true
 await page.getByLabel('Pilih foto profil', { exact: true }).setInputFiles({ name: 'retry.png', mimeType: 'image/png', buffer: photo })
 await page.getByRole('button', { name: 'Simpan foto', exact: true }).click()
 await page.getByText('Foto belum dapat diunggah. Coba kembali.', { exact: true }).waitFor()
 assert.equal(await page.locator('.topbar .avatar img').count(), 1, 'Upload errors retain saved photo')
 await page.getByRole('button', { name: 'Keluar akun', exact: true }).click()
 await page.getByRole('heading', { name: 'Caramu belajar, cerita hebatmu.' }).waitFor()
 assert.equal(await page.locator('.topbar .avatar img').count(), 0, 'Guest never displays account photo')
 await route('/signin'); await login(); await route('/settings')
 assert.equal(await page.locator('.topbar .avatar img').count(), 1, 'Photo persists after a new login')
 await page.getByRole('button', { name: 'Hapus foto', exact: true }).click()
 await page.getByText('Foto profil berhasil dihapus.', { exact: true }).waitFor()
 assert.equal(await page.locator('.topbar .avatar img').count(), 0)
 assert.equal(profile.name, 'Dina Baru'); assert.equal(profile.grade, 'SMP'); assert.equal(profile.goal, 'Memahami cerita')
 assert.deepEqual(errors, [])
 console.log('PASS: profile edits/reload, avatar preview/upload/errors/delete, account isolation, login persistence and mobile layout (mocked Auth/API).')
} finally {
 await browser.close()
 server.kill()
 try { unlinkSync(configPath) } catch {}
}
