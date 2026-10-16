import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import { chromium } from 'playwright'
import { publicPwaAssets } from './pwa-plugin.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const useBuild = process.argv.includes('--built')
const temporary = useBuild ? null : await mkdtemp(join(tmpdir(), 'bahasakita-pwa-'))
const output = temporary || join(root, 'dist')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.ico': 'image/x-icon', '.svg': 'image/svg+xml' }
let context, profileDir, server, revision = 0
try {
 if (!useBuild) {
  process.env.VITE_SUPABASE_URL = 'https://pwa-check.supabase.co'
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_pwa_fixture'
  await build({ root, logLevel: 'warn', build: { outDir: output, emptyOutDir: true } })
 }
 server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost')
  if (url.pathname.startsWith('/api/')) {
   response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
   response.end(JSON.stringify(url.pathname === '/api/catalog' ? { lessons: [], basicMaterials: [] } : { privateProbe: 'never-cache-account-data' }))
   return
  }
  try {
   let path = resolve(output, '.' + decodeURIComponent(url.pathname))
   if (!path.startsWith(resolve(output) + sep)) path = join(output, 'index.html')
   if (!(await stat(path).catch(() => null))?.isFile()) {
    if (request.headers.accept?.includes('text/html')) path = join(output, 'index.html')
    else { response.writeHead(404); response.end(); return }
   }
   let data = await readFile(path)
   if (url.pathname === '/sw.js' && revision) data = Buffer.from(data.toString().replace(/const VERSION = "[^"]+"/, 'const VERSION = "pwa-test-updated"'))
   response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
   response.end(data)
  } catch { response.writeHead(500); response.end() }
 })
 await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
 const origin = 'http://127.0.0.1:' + server.address().port
 const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(path => path && existsSync(path))
 // Installability is intentionally disabled in incognito browser contexts.
 profileDir = await mkdtemp(join(tmpdir(), 'bahasakita-pwa-browser-'))
 context = await chromium.launchPersistentContext(profileDir, { headless: true, ...(executablePath ? { executablePath } : {}), viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
 // No calls to real Supabase, Figma, video providers or other external services.
 await context.route('**/*', route => {
  const url = new URL(route.request().url())
  if (url.origin === origin) return route.continue()
  if (url.hostname.endsWith('.supabase.co')) return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  return route.abort()
 })
 const page = await context.newPage(), errors = []
 page.on('pageerror', error => errors.push(error.message))
 const navigate = (page, path) => page.evaluate(path => { history.pushState({}, '', path); dispatchEvent(new PopStateEvent('popstate')) }, path)
 const settings = async page => { await navigate(page, '/settings'); await page.getByRole('heading', { name: 'BahasaKita di perangkatmu' }).waitFor() }
 await page.goto(origin)
 await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
 await page.getByRole('heading', { name: 'Halo, teman belajar!' }).waitFor()
 await settings(page)
 await page.getByText('Dukungan aplikasi siap', { exact: true }).waitFor()

 const cdp = await context.newCDPSession(page)
 const manifestResult = await cdp.send('Page.getAppManifest')
 assert.equal(manifestResult.url, origin + '/manifest.webmanifest')
 assert.deepEqual(manifestResult.errors, [])
 const manifest = JSON.parse(manifestResult.data)
 assert.equal(manifest.name, 'BahasaKita Learn')
 assert.equal(manifest.id, '/')
 assert.equal(manifest.start_url, '/')
 assert.equal(manifest.scope, '/')
 assert.equal(manifest.display, 'standalone')
 const installability = await cdp.send('Page.getInstallabilityErrors')
 assert.deepEqual(installability.installabilityErrors, [], 'Chrome should find no installability errors')
 for (const icon of [...manifest.icons, { src: '/apple-touch-icon.png', sizes: '180x180' }, { src: '/favicon-32x32.png', sizes: '32x32' }]) {
  const dimensions = await page.evaluate(async path => { const image = new Image(); image.src = path; await image.decode(); return `${image.naturalWidth}x${image.naturalHeight}` }, icon.src)
  assert.equal(dimensions, icon.sizes)
 }
 const ico = await readFile(join(output, 'favicon.ico'))
 assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 4)
 console.log('PASS: manifest, Chromium installability, logo favicon and app-icon dimensions')

 const privateResponse = await page.evaluate(() => fetch('/api/pwa-private-probe', { headers: { Authorization: 'Bearer fixture' } }).then(response => response.json()))
 assert.equal(privateResponse.privateProbe, 'never-cache-account-data')
 const cachedPaths = await page.evaluate(async () => {
  const result = []
  for (const name of await caches.keys()) for (const request of await (await caches.open(name)).keys()) result.push(new URL(request.url).pathname)
  return result.sort()
 })
 assert.deepEqual(cachedPaths, [...publicPwaAssets].sort())

 // A pending update must leave an in-progress page (and another tab) intact.
 const secondPage = await context.newPage()
 await secondPage.goto(origin)
 await secondPage.waitForFunction(() => navigator.serviceWorker.controller !== null)
 await secondPage.evaluate(() => { window.pwaUnsentDraft = 'keep-this-tab' })
 await page.evaluate(() => { window.pwaUnsentDraft = 'keep-until-update-click' })
 revision = 1
 await page.getByRole('button', { name: 'Periksa pembaruan', exact: true }).click()
 await page.getByRole('button', { name: 'Perbarui dan muat ulang' }).waitFor()
 assert.equal(await page.evaluate(() => window.pwaUnsentDraft), 'keep-until-update-click')
 assert.equal(await secondPage.evaluate(() => window.pwaUnsentDraft), 'keep-this-tab')
 await page.getByRole('button', { name: 'Perbarui dan muat ulang' }).click()
 await page.waitForFunction(() => window.pwaUnsentDraft === undefined)
 await page.waitForFunction(async () => {
  const names = (await caches.keys()).filter(name => name.startsWith('bahasakita-public-'))
  return names.length === 1 && names[0] === 'bahasakita-public-pwa-test-updated'
 })
 assert.equal(await secondPage.evaluate(() => window.pwaUnsentDraft), 'keep-this-tab', 'Other tabs must not reload automatically')
 console.log('PASS: explicit update, no forced reload of active/other tabs, old public cache removed')

 await page.getByRole('heading', { name: 'Halo, teman belajar!' }).waitFor()
 await settings(page)
 await context.setOffline(true)
 await page.getByText('Kamu sedang offline.', { exact: true }).waitFor()
 assert.equal(await page.getByRole('button', { name: 'Periksa pembaruan', exact: true }).isDisabled(), true)
 for (const url of ['/api/pwa-private-probe', '/auth/v1/user', '/icons/app-192.png?private=1']) {
  const result = await page.evaluate(async url => { try { await fetch(url, { cache: 'no-store' }); return 'unexpected-response' } catch { return 'network-error' } }, url)
  assert.equal(result, 'network-error', url + ' must not fall back to cached HTML or private data')
 }
 const authenticatedAsset = await page.evaluate(async () => {
  try { await fetch('/icons/app-192.png', { cache: 'no-store', headers: { Authorization: 'Bearer fixture' } }); return 'unexpected-response' }
  catch { return 'network-error' }
 })
 assert.equal(authenticatedAsset, 'network-error', 'Authorized requests must bypass public cache')
 await page.goto(origin + '/lesson/sample-private-route?resume=true')
 await page.getByRole('heading', { name: 'Koneksi terputus? Kita jeda dulu.' }).waitFor()
 assert.equal(page.url(), origin + '/lesson/sample-private-route?resume=true')
 assert.equal(await page.locator('img').evaluate(image => image.complete && image.naturalWidth > 0), true)
 for (const width of [320, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 900 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Offline overflow at ' + width)
 }
 await page.getByRole('link', { name: 'Coba buka BahasaKita' }).focus()
 assert.equal(await page.getByRole('link', { name: 'Coba buka BahasaKita' }).evaluate(element => getComputedStyle(element).outlineStyle), 'solid')
 const screenshotDir = process.env.PWA_SCREENSHOT_DIR
 if (screenshotDir) {
  const { mkdir } = await import('node:fs/promises')
  await mkdir(screenshotDir, { recursive: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: join(screenshotDir, 'offline-mobile.png'), fullPage: true })
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.screenshot({ path: join(screenshotDir, 'offline-dark.png'), fullPage: true })
 }
 console.log('PASS: offline notice, uncached API/auth/private requests, offline navigation, 320–1440 px and keyboard focus')

 await context.setOffline(false)
 await page.getByRole('link', { name: 'Coba buka BahasaKita' }).click()
 await page.getByRole('heading', { name: 'Halo, teman belajar!' }).waitFor()
 await settings(page)
 for (const width of [320, 390, 768, 1440]) {
  await page.setViewportSize({ width, height: 1000 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Settings overflow at ' + width)
 }
 if (screenshotDir) {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: join(screenshotDir, 'settings-desktop.png'), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: join(screenshotDir, 'settings-mobile.png'), fullPage: true })
 }
 assert.deepEqual(errors, [])
 console.log('PASS: reconnect opens app normally; responsive installation settings; no runtime exceptions')
} finally {
 await context?.close()
 if (server) await new Promise(resolve => server.close(resolve))
 if (temporary) {
  // mkdtemp returned this exact task-owned directory; never derive a parent target.
  assert.equal(resolve(temporary).startsWith(resolve(tmpdir()) + sep + 'bahasakita-pwa-'), true)
  await rm(temporary, { recursive: true, force: true })
 }
 if (profileDir) {
  assert.equal(resolve(profileDir).startsWith(resolve(tmpdir()) + sep + 'bahasakita-pwa-browser-'), true)
  await rm(profileDir, { recursive: true, force: true })
 }
}
