// Replaced with a content version and an explicit public-asset list during build.
const VERSION = __PWA_VERSION__
const PUBLIC_ASSETS = __PWA_ASSETS__
const CACHE_PREFIX = 'bahasakita-public-'
const CACHE_NAME = CACHE_PREFIX + VERSION
const publicUrls = new Set(PUBLIC_ASSETS.map(path => new URL(path, self.location.origin).href))
const offlineUrl = new URL('/offline.html', self.location.origin).href

self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(
  [...publicUrls].map(url => new Request(url, { cache: 'reload', credentials: 'omit' }))
 )))
 // A new version waits until tabs close or the user explicitly requests it.
})

self.addEventListener('activate', event => {
 event.waitUntil((async () => {
  const names = await caches.keys()
  await Promise.all(names.filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME).map(name => caches.delete(name)))
  await self.clients.claim()
 })())
})

self.addEventListener('message', event => {
 if (event.data?.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting())
})

self.addEventListener('fetch', event => {
 const request = event.request, url = new URL(request.url)
 if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('authorization')) return
 // Never replace API/auth/storage responses with HTML, including direct navigation.
 if (/^\/(api(?:\/|$)|(?:auth|rest|storage|functions|realtime)\/v1(?:\/|$))/.test(url.pathname)) return
 if (request.mode === 'navigate') {
  event.respondWith((async () => {
   try { return await fetch(request) }
   catch {
    const cache = await caches.open(CACHE_NAME)
    return await cache.match(offlineUrl) || Response.error()
   }
  })())
 } else if (publicUrls.has(url.href)) {
  event.respondWith((async () => {
   const cache = await caches.open(CACHE_NAME)
   return await cache.match(request) || fetch(request)
  })())
 }
 // No runtime caching: private pages, API data, media and auth stay on the network.
})
