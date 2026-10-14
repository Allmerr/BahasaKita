import { createRequire } from 'node:module'
import { youtubeMaterials, youtubeEmbedUrl } from '../src/youtubeMaterials.js'
import { dictionaryForGrade } from '../src/gradeDictionary.js'
const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/Faris Daffa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
 const results = await Promise.all(['SD', 'SMP', 'SMA'].map(async grade => {
  const page = await browser.newPage()
  // Establish a local page origin so YouTube receives the same Referer as an app embed.
  await page.route('http://127.0.0.1:5181/check', route => route.fulfill({ contentType: 'text/html', body: '<html><body></body></html>' }))
  await page.goto('http://127.0.0.1:5181/check')
  const word = process.argv.includes('--words') ? dictionaryForGrade(grade)[0] : null
  const video = word ? { id: word.videoId } : youtubeMaterials[grade][0]
  const start = word?.start || 0
  await page.evaluate(src => { const iframe = document.createElement('iframe'); iframe.src = src; iframe.width = '800'; iframe.height = '450'; iframe.allow = 'autoplay; encrypted-media; fullscreen'; iframe.referrerPolicy = 'strict-origin-when-cross-origin'; document.body.append(iframe) }, youtubeEmbedUrl(video.id, start) + '&mute=1')
  try {
   const frame = page.frameLocator('iframe')
   await frame.locator('video').waitFor({ timeout: 20000 })
   const button = frame.locator('.ytp-large-play-button')
   if (await button.isVisible()) await button.click()
   await frame.locator('video').evaluate(video => Promise.race([video.play().catch(() => {}), new Promise(resolve => setTimeout(resolve, 5000))]))
   let played = false
   for (let i = 0; i < 10; i++) { if (await frame.locator('video').evaluate((video, start) => video.currentTime >= Math.max(1, start) && !video.paused, start)) { played = true; break } await page.waitForTimeout(1000) }
   if (!played) throw new Error('Playback did not advance')
   console.log(`PLAYING ${grade}: ${video.id} from ${start}s`); return true
  } catch (error) { console.log(`PLAYBACK UNVERIFIED ${grade}: ${error.message.split('\n')[0]}`); return false }
  finally { await page.close() }
 }))
 process.exitCode = results.every(Boolean) ? 0 : 1
} finally { await browser.close() }
