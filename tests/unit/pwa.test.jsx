import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { PwaProvider, PwaInstallCard } from '../../src/Pwa.jsx'

let registration, serviceWorker
beforeEach(() => {
 vi.stubEnv('PROD', true)
 vi.stubGlobal('isSecureContext', true)
 vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })))
 registration = Object.assign(new EventTarget(), { active: {}, waiting: null, installing: null, update: vi.fn().mockResolvedValue(undefined) })
 serviceWorker = Object.assign(new EventTarget(), { controller: {}, register: vi.fn().mockResolvedValue(registration), ready: Promise.resolve(registration) })
 vi.stubGlobal('navigator', { onLine: true, serviceWorker })
})
afterEach(() => vi.unstubAllEnvs())
const open = () => render(<PwaProvider><PwaInstallCard/></PwaProvider>)
const ready = () => screen.findByText('Dukungan aplikasi siap')
function offerInstall(outcome = 'dismissed') {
 const event = new Event('beforeinstallprompt', { cancelable: true })
 event.prompt = vi.fn().mockResolvedValue(undefined)
 event.userChoice = Promise.resolve({ outcome })
 act(() => window.dispatchEvent(event))
 return event
}

it('only opens the installation prompt after a user action and handles cancellation', async () => {
 open(); await ready()
 const event = offerInstall()
 expect(event.defaultPrevented).toBe(true)
 expect(event.prompt).not.toHaveBeenCalled()
 fireEvent.click(screen.getByRole('button', { name: 'Pasang BahasaKita' }))
 expect(await screen.findByText(/Pemasangan dibatalkan/)).toBeInTheDocument()
 expect(event.prompt).toHaveBeenCalledTimes(1)
 expect(screen.queryByRole('button', { name: 'Pasang BahasaKita' })).not.toBeInTheDocument()
})
it('reflects a completed installation and hides browser installation instructions', async () => {
 open(); await ready(); offerInstall('accepted')
 act(() => window.dispatchEvent(new Event('appinstalled')))
 expect(screen.getByText('Aplikasi sudah dipasang')).toBeInTheDocument()
 expect(screen.queryByText('Cara memasang melalui browser')).not.toBeInTheDocument()
})
it('announces offline state and disables network-dependent PWA actions until reconnection', async () => {
 open(); await ready(); offerInstall()
 act(() => window.dispatchEvent(new Event('offline')))
 expect(screen.getByRole('status')).toHaveTextContent('Kamu sedang offline.')
 expect(screen.getByRole('button', { name: 'Pasang BahasaKita' })).toBeDisabled()
 expect(screen.getByRole('button', { name: 'Periksa pembaruan' })).toBeDisabled()
 act(() => window.dispatchEvent(new Event('online')))
 expect(screen.queryByText('Kamu sedang offline.')).not.toBeInTheDocument()
 expect(screen.getByRole('button', { name: 'Periksa pembaruan' })).toBeEnabled()
})
it('waits for explicit update action rather than replacing an active learning session', async () => {
 const postMessage = vi.fn()
 registration.waiting = { postMessage }
 open(); await ready()
 const button = screen.getByRole('button', { name: 'Perbarui dan muat ulang' })
 expect(screen.getByText(/Selesaikan dan simpan aktivitasmu/)).toBeInTheDocument()
 expect(postMessage).not.toHaveBeenCalled()
 fireEvent.click(button)
 expect(postMessage).toHaveBeenCalledExactlyOnceWith({ type: 'SKIP_WAITING' })
})
it('shows a recoverable registration failure without claiming offline support', async () => {
 serviceWorker.register.mockRejectedValue(new Error('unavailable'))
 open()
 expect(await screen.findByText(/Dukungan offline belum siap/)).toBeInTheDocument()
 expect(screen.queryByRole('button', { name: 'Periksa pembaruan' })).not.toBeInTheDocument()
})
it('does not register a production service worker during development', () => {
 vi.stubEnv('PROD', false); open()
 expect(serviceWorker.register).not.toHaveBeenCalled()
 expect(screen.getByText(/Instalasi tersedia pada versi aplikasi/)).toBeInTheDocument()
})
