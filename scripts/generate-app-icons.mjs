// Derive deployment icons from the existing brand artwork, without redrawing it.
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'

const executablePath = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(path => path && existsSync(path))
const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) })
try {
 const page = await browser.newPage()
 const source = await readFile(new URL('../public/images/logo-bahasa-kita.png', import.meta.url))
 const icons = await page.evaluate(async data => {
  const image = new Image()
  image.src = 'data:image/png;base64,' + data
  await image.decode()
  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = image.width; sourceCanvas.height = image.height
  const sourceContext = sourceCanvas.getContext('2d')
  sourceContext.drawImage(image, 0, 0)
  const pixels = sourceContext.getImageData(0, 0, image.width, image.height).data
  // The symbol ends before x=234; the horizontal wordmark starts at x=239.
  let left = 234, top = image.height, right = 0, bottom = 0
  for (let y = 0; y < image.height; y++) for (let x = 0; x < 234; x++) {
   if (pixels[(y * image.width + x) * 4 + 3] < 8) continue
   left = Math.min(left, x); top = Math.min(top, y)
   right = Math.max(right, x); bottom = Math.max(bottom, y)
  }
  const width = right - left + 1, height = bottom - top + 1
  const variants = [
   ['favicon-16x16.png', 16, .92, false], ['favicon-32x32.png', 32, .92, false],
   ['favicon-48x48.png', 48, .92, false], ['favicon-256x256.png', 256, .92, false],
   ['icons/app-192.png', 192, .78, true], ['icons/app-512.png', 512, .78, true],
   // Fit inside the central safe-zone circle even when launchers crop the icon.
   ['icons/app-maskable-512.png', 512, .56, true], ['apple-touch-icon.png', 180, .78, true],
  ]
  return variants.map(([name, size, ratio, opaque]) => {
   const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = size
   const context = canvas.getContext('2d')
   if (opaque) { context.fillStyle = '#f5f3ff'; context.fillRect(0, 0, size, size) }
   const scale = size * ratio / Math.max(width, height)
   context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high'
   context.drawImage(image, left, top, width, height, (size - width * scale) / 2, (size - height * scale) / 2, width * scale, height * scale)
   return { name, size, data: canvas.toDataURL('image/png').split(',')[1] }
  })
 }, source.toString('base64'))
 await mkdir(new URL('../public/icons/', import.meta.url), { recursive: true })
 for (const icon of icons.filter(icon => ![16, 48, 256].includes(icon.size))) {
  await writeFile(new URL('../public/' + icon.name, import.meta.url), Buffer.from(icon.data, 'base64'))
 }
 // ICO supports embedded PNG frames; retain small and large sizes for browsers/OS.
 const frames = icons.filter(icon => [16, 32, 48, 256].includes(icon.size))
 const header = Buffer.alloc(6 + frames.length * 16)
 header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4)
 let offset = header.length
 const buffers = frames.map((icon, index) => {
  const png = Buffer.from(icon.data, 'base64'), entry = 6 + index * 16
  header[entry] = icon.size % 256; header[entry + 1] = icon.size % 256
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(png.length, entry + 8); header.writeUInt32LE(offset, entry + 12)
  offset += png.length
  return png
 })
 await writeFile(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([header, ...buffers]))
 console.log('Generated favicon, Apple touch icon, and 192/512/maskable app icons from the BahasaKita logo.')
} finally { await browser.close() }
