import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { youtubeEmbedUrl } from '../src/youtubeMaterials.js'
const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/Faris Daffa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
 await Promise.all(process.argv.slice(2).filter(id => /^[a-zA-Z0-9_-]{11}$/.test(id)).map(async id => {
  const page = await browser.newPage({ viewport: { width: 1000, height: 650 } })
  await page.route('http://127.0.0.1:5181/check', route => route.fulfill({ contentType: 'text/html', body: '<html><body></body></html>' }))
  await page.goto('http://127.0.0.1:5181/check')
  await page.evaluate(src => { const iframe = document.createElement('iframe'); iframe.src = src; iframe.width = '960'; iframe.height = '540'; iframe.allow = 'autoplay; encrypted-media; fullscreen'; iframe.referrerPolicy = 'strict-origin-when-cross-origin'; document.body.append(iframe) }, youtubeEmbedUrl(id) + '&mute=1')
  try {
   const video = page.frameLocator('iframe').locator('video')
   await video.waitFor({ timeout: 25000 }); await video.evaluate(v => Promise.race([v.play().catch(() => {}), new Promise(resolve => setTimeout(resolve, 5000))]))
   for (const seconds of (process.argv.find(arg => arg.startsWith('--times='))?.slice(8).split(',').map(Number).filter(v => Number.isFinite(v) && v >= 0) || [30, 90, 300])) {
    await video.evaluate((v, seconds) => new Promise(resolve => { const timer = setTimeout(resolve, 8000); v.addEventListener('seeked', () => { clearTimeout(timer); resolve() }, { once: true }); v.currentTime = seconds }), seconds)
    const path = join(tmpdir(), `accessible-${id}-${seconds}.png`)
    await page.screenshot({ path }); console.log(path)
   }
  } catch (error) { console.log(`${id}: ${error.message.split('\n')[0]}`) }
  finally { await page.close() }
 }))
} finally { await browser.close() }
