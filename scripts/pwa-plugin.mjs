import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const publicPwaAssets = [
 '/offline.html', '/manifest.webmanifest', '/favicon.ico', '/favicon-32x32.png',
 '/apple-touch-icon.png', '/icons/app-192.png', '/icons/app-512.png', '/icons/app-maskable-512.png',
]

// Keep the existing Vite stack: this small build hook needs no PWA dependency.
export function bahasaKitaPwa() {
 let publicDir
 return {
  name: 'bahasakita-pwa', apply: 'build', enforce: 'post',
  configResolved(config) { publicDir = config.publicDir },
  generateBundle(options, bundle) {
   const template = readFileSync(new URL('../pwa/service-worker.js', import.meta.url), 'utf8')
   const hash = createHash('sha256').update(template)
   for (const path of publicPwaAssets) hash.update(path).update(readFileSync(resolve(publicDir, path.slice(1))))
   for (const [name, output] of Object.entries(bundle).sort(([a], [b]) => a.localeCompare(b))) {
    hash.update(name).update(output.type === 'chunk' ? output.code : output.source)
   }
   const source = template.replace('__PWA_VERSION__', JSON.stringify(hash.digest('hex').slice(0, 16)))
    .replace('__PWA_ASSETS__', JSON.stringify(publicPwaAssets))
   this.emitFile({ type: 'asset', fileName: 'sw.js', source })
  },
 }
}
