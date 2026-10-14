import { createRequire } from 'node:module'
import { youtubeMaterials } from '../src/youtubeMaterials.js'
const require = createRequire(import.meta.url)
const { request } = require('C:/Users/Faris Daffa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const api = await request.newContext()
try {
 const videos = [...new Map(Object.values(youtubeMaterials).flat().map(v => [v.id, v])).values()]
 const results = await Promise.all(videos.map(async video => {
  const url = new URL('https://www.youtube.com/oembed')
  url.searchParams.set('url', `https://www.youtube.com/watch?v=${video.id}`)
  url.searchParams.set('format', 'json')
  try {
   const response = await api.get(url.href, { timeout: 20000 })
   if (!response.ok()) throw new Error(`HTTP ${response.status()}`)
   const data = await response.json()
   if (data.type !== 'video' || !data.html?.includes(video.id)) throw new Error('No embeddable player returned')
   console.log(`VERIFIED ${video.id}: ${data.title} — ${data.author_name}`)
   return true
  } catch (error) { console.log(`UNVERIFIED ${video.id}: ${error.message.split('\n')[0]}`); return false }
 }))
 process.exitCode = results.every(Boolean) ? 0 : 1
} finally { await api.dispose() }
