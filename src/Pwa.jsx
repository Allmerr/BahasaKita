import { createContext, useContext, useEffect, useRef, useState } from 'react'
import Icon from './components/Icon.jsx'

const PwaContext = createContext({ online: true, installed: false, canInstall: false, busy: false, registrationState: 'development', updateAvailable: false, message: '' })
const standalone = () => window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

export function PwaProvider({ children }) {
 const [online, setOnline] = useState(() => navigator.onLine)
 const [installed, setInstalled] = useState(standalone)
 const [canInstall, setCanInstall] = useState(false)
 const [busy, setBusy] = useState(false)
 const [message, setMessage] = useState('')
 const [updateAvailable, setUpdateAvailable] = useState(false)
 const [registrationState, setRegistrationState] = useState(import.meta.env.PROD ? 'registering' : 'development')
 const installEvent = useRef(null), registration = useRef(null), reloadRequested = useRef(false)

 useEffect(() => {
  const connected = () => setOnline(true), disconnected = () => setOnline(false)
  const installable = event => { event.preventDefault(); installEvent.current = event; setCanInstall(true) }
  const didInstall = () => { installEvent.current = null; setCanInstall(false); setInstalled(true); setMessage('BahasaKita sudah dipasang di perangkat ini.') }
  const displayMode = window.matchMedia?.('(display-mode: standalone)')
  const modeChanged = () => setInstalled(standalone())
  window.addEventListener('online', connected); window.addEventListener('offline', disconnected)
  window.addEventListener('beforeinstallprompt', installable); window.addEventListener('appinstalled', didInstall)
  displayMode?.addEventListener('change', modeChanged)
  return () => {
   window.removeEventListener('online', connected); window.removeEventListener('offline', disconnected)
   window.removeEventListener('beforeinstallprompt', installable); window.removeEventListener('appinstalled', didInstall)
   displayMode?.removeEventListener('change', modeChanged)
  }
 }, [])

 useEffect(() => {
  // Never install a worker over Vite's development server/HMR.
  if (!import.meta.env.PROD) return
  if (!window.isSecureContext || !('serviceWorker' in navigator)) { setRegistrationState('unsupported'); return }
  let disposed = false, currentRegistration
  const workerListeners = []
  const updateReady = () => {
   if (!disposed && currentRegistration?.waiting && navigator.serviceWorker.controller) setUpdateAvailable(true)
  }
  const watchInstalling = () => {
   const worker = currentRegistration.installing
   if (!worker) return
   const changed = () => {
    if (disposed) return
    if (worker.state === 'installed') updateReady()
    if (worker.state === 'redundant' && !currentRegistration.active) setRegistrationState('error')
   }
   worker.addEventListener('statechange', changed)
   workerListeners.push(() => worker.removeEventListener('statechange', changed))
  }
  const controllerChanged = () => {
   if (reloadRequested.current) { reloadRequested.current = false; window.location.reload() }
  }
  navigator.serviceWorker.addEventListener('controllerchange', controllerChanged)
  navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then(async result => {
   if (disposed) return
   registration.current = currentRegistration = result
   updateReady(); watchInstalling()
   result.addEventListener('updatefound', watchInstalling)
   await navigator.serviceWorker.ready
   if (!disposed) setRegistrationState('ready')
  }).catch(() => { if (!disposed) setRegistrationState('error') })
  return () => {
   disposed = true
   currentRegistration?.removeEventListener('updatefound', watchInstalling)
   workerListeners.forEach(remove => remove())
   navigator.serviceWorker.removeEventListener('controllerchange', controllerChanged)
  }
 }, [])

 async function install() {
  const event = installEvent.current
  if (!event || busy) return
  setBusy(true); setMessage('')
  try {
   await event.prompt()
   const choice = await event.userChoice
   setMessage(choice.outcome === 'accepted' ? 'Ikuti petunjuk browser untuk menyelesaikan pemasangan.' : 'Pemasangan dibatalkan. Kamu tetap bisa menggunakan BahasaKita di browser.')
  } catch { setMessage('Pemasangan belum dapat dimulai. Coba melalui menu browser.') }
  finally { installEvent.current = null; setCanInstall(false); setBusy(false) }
 }
 async function checkForUpdate() {
  if (!registration.current || busy) return
  setBusy(true); setMessage('')
  try {
   await registration.current.update()
   if (registration.current.waiting) setUpdateAvailable(true)
   setMessage('Pemeriksaan pembaruan selesai.')
  } catch { setMessage('Belum dapat memeriksa pembaruan. Periksa koneksi, lalu coba lagi.') }
  finally { setBusy(false) }
 }
 function applyUpdate() {
  const worker = registration.current?.waiting
  if (!worker) { setUpdateAvailable(false); setMessage('Versi terbaru sudah aktif. Buka kembali aplikasi untuk menggunakannya.'); return }
  reloadRequested.current = true
  worker.postMessage({ type: 'SKIP_WAITING' })
 }
 return <PwaContext.Provider value={{ online, installed, canInstall, busy, registrationState, updateAvailable, message, install, checkForUpdate, applyUpdate }}>
  {!online && <aside className="pwa-connection-notice" role="status"><Icon name="wifiOff"/><p><strong>Kamu sedang offline.</strong> Asesmen, chat, dan penyimpanan progres memerlukan internet. Periksa koneksi sebelum melanjutkan.</p></aside>}
  {children}
 </PwaContext.Provider>
}

export function PwaInstallCard() {
 const { online, installed, canInstall, busy, registrationState, updateAvailable, message, install, checkForUpdate, applyUpdate } = useContext(PwaContext)
 const ready = registrationState === 'ready'
 return <section className="panel pwa-install-card" aria-labelledby="pwa-heading">
  <div className="pwa-install-intro"><img src="/icons/app-192.png" width="64" height="64" alt=""/><div><h2 id="pwa-heading">BahasaKita di perangkatmu</h2><p>Buka ruang belajar langsung dari layar utama, seperti aplikasi.</p></div></div>
  <p className="pwa-install-status"><Icon name={installed || ready ? 'check' : 'info'} size={18}/>{installed ? 'Aplikasi sudah dipasang' : ready ? 'Dukungan aplikasi siap' : registrationState === 'registering' ? 'Menyiapkan dukungan aplikasi…' : registrationState === 'development' ? 'Instalasi tersedia pada versi aplikasi yang dipublikasikan.' : registrationState === 'unsupported' ? 'Gunakan koneksi aman dan browser yang mendukung pemasangan aplikasi.' : 'Dukungan offline belum siap. Periksa koneksi, lalu buka kembali aplikasi.'}</p>
  <p className="pwa-offline-note">Saat offline, tersedia halaman bantuan koneksi. Belajar, video, chat, dan penyimpanan data akun tetap memerlukan internet.</p>
  <div className="pwa-actions">
   {!installed && canInstall && ready && <button type="button" className="btn" disabled={busy || !online} onClick={install}><Icon name="download" size={18}/>{busy ? 'Menyiapkan…' : 'Pasang BahasaKita'}</button>}
   {ready && <button type="button" className="btn secondary" disabled={busy || !online} onClick={checkForUpdate}><Icon name="refresh" size={18}/>{busy ? 'Memproses…' : 'Periksa pembaruan'}</button>}
  </div>
  {!installed && <details className="pwa-install-help"><summary>Cara memasang melalui browser</summary><p>Di Android atau komputer, buka menu browser dan pilih <strong>Instal aplikasi</strong> atau <strong>Pasang BahasaKita</strong> jika tersedia.</p><p>Di iPhone atau iPad, buka di Safari, ketuk <strong>Bagikan</strong>, lalu <strong>Tambahkan ke Layar Utama</strong>.</p></details>}
  {updateAvailable && <div className="pwa-update-notice"><h3>Versi baru tersedia</h3><p>Selesaikan dan simpan aktivitasmu sebelum memperbarui. Tombol ini akan memuat ulang halaman.</p><button type="button" className="btn" disabled={!online} onClick={applyUpdate}>Perbarui dan muat ulang</button></div>}
  {message && <p className="pwa-message" role="status">{message}</p>}
 </section>
}
