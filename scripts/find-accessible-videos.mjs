import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { request } = require('C:/Users/Faris Daffa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const api = await request.newContext()
try {
 for (const query of process.argv.slice(2)) {
  const response = await api.get('https://www.youtube.com/results?search_query=' + encodeURIComponent(query), { timeout: 20000 })
  const html = await response.text()
  const match = html.match(/var ytInitialData = (.*?);<\/script>/s)
  if (!match) { console.log('No search data: ' + query); continue }
  const found = []
  const visit = value => {
   if (!value || typeof value !== 'object') return
   if (value.videoRenderer) {
    const video = value.videoRenderer
    found.push({ id: video.videoId, title: video.title?.runs?.map(x => x.text).join(''), creator: video.ownerText?.runs?.map(x => x.text).join(''), description: video.detailedMetadataSnippets?.[0]?.snippetText?.runs?.map(x => x.text).join('') })
   }
   for (const child of Object.values(value)) visit(child)
  }
  visit(JSON.parse(match[1])); console.log(JSON.stringify({ query, videos: found.slice(0, 12) }, null, 2))
 }
} finally { await api.dispose() }
