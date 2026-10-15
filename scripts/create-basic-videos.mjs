import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
import { basicMaterials } from '../content/legacy-basic.js'
const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/Faris Daffa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
mkdirSync('public/videos', { recursive: true })
try {
 await Promise.all(basicMaterials.map(async material => {
  const page = await browser.newPage()
  const data = await page.evaluate(async ({ title, slides }) => {
   const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 720
   const ctx = canvas.getContext('2d'); const stream = canvas.captureStream(10)
   const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8', videoBitsPerSecond: 800000 })
   const chunks = []; recorder.ondataavailable = e => chunks.push(e.data)
   const complete = new Promise(resolve => { recorder.onstop = resolve }); recorder.start()
   // Keep emitting frames while each slide remains visible, including the final slide.
   const frames = setInterval(() => { ctx.fillStyle = '#f7f5ff'; ctx.fillRect(1279, 719, 1, 1) }, 100)
   for (let i = 0; i < slides.length; i++) {
    ctx.fillStyle = '#f7f5ff'; ctx.fillRect(0, 0, 1280, 720)
    ctx.fillStyle = '#7451cc'; ctx.fillRect(0, 0, 1280, 12)
    ctx.font = 'bold 26px Arial'; ctx.fillText('BahasaKita  /  Kelas belajar dasar', 80, 90)
    ctx.fillStyle = '#6a6478'; ctx.font = '26px Arial'; ctx.fillText(title, 80, 155)
    ctx.fillStyle = '#2c2440'; ctx.font = 'bold 48px Arial'; ctx.fillText(slides[i][0], 80, 270)
    ctx.font = '32px Arial'; slides[i].slice(1).forEach((line, j) => ctx.fillText(line, 80, 365 + j * 65))
    ctx.fillStyle = '#7451cc'; ctx.fillRect(80, 600, 1120 * (i + 1) / slides.length, 8)
    ctx.font = '24px Arial'; ctx.fillText(`Materi ${i + 1} dari ${slides.length}  /  Jeda untuk membaca kembali`, 80, 660)
    await new Promise(resolve => setTimeout(resolve, 6000))
   }
   clearInterval(frames); recorder.stop(); await complete; stream.getTracks().forEach(track => track.stop())
   const bytes = new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer())
   return Array.from(bytes)
  }, material)
  writeFileSync(`public/videos/basic-${material.id}.webm`, Buffer.from(data)); await page.close()
  console.log(`Created video: ${material.id}`)
 }))
} finally { await browser.close() }
