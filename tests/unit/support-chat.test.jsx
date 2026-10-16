import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ api: vi.fn() }))
vi.mock('../../src/Account', () => ({ useAccount: () => ({ session: { user: { id: 'student' } }, accountApi: mocks.api }) }))
import SupportChat from '../../src/SupportChat.jsx'

const message = (id, body, sender = 'teacher') => ({ id, body, sender_id: sender, created_at: '2026-10-16T03:00:00Z' })
const history = { messages: [message('2', 'Coba lihat contoh buah.'), message('3', 'Baik, Bu.', 'student')], hasOlder: false }
const mount = props => render(<SupportChat linkId="link-a" name="Bu Guru" subtitle="Guru" {...props}/>)
beforeEach(() => { mocks.api.mockReset(); mocks.api.mockResolvedValue(history) })

it('renders private message history without inventing read or online receipts', async () => {
 mount()
 expect(await screen.findByText('Coba lihat contoh buah.')).toBeInTheDocument()
 expect(within(screen.getByRole('log')).getByText('Baik, Bu.')).toBeInTheDocument()
 expect(screen.getByRole('textbox', { name: 'Pesan' })).toBeEnabled()
 expect(screen.queryByText(/online|dibaca/i)).not.toBeInTheDocument()
 expect(screen.getByRole('button', { name: 'Kirim pesan' })).toBeDisabled()
})

it('preserves the draft and request id when a send response is lost', async () => {
 let posts = 0
 const sent = message('4', 'Saya sudah paham.', 'student')
 mocks.api.mockImplementation(async (path, body, options) => {
  if (options?.method === 'POST') { if (++posts === 1) throw new Error('Koneksi terputus.'); return sent }
  return { messages: posts > 1 ? [...history.messages, sent] : history.messages, hasOlder: false }
 })
 mount(); const input = await screen.findByRole('textbox', { name: 'Pesan' })
 await waitFor(() => expect(input).toBeEnabled())
 fireEvent.change(input, { target: { value: '  Saya sudah paham.  ' } })
 fireEvent.click(screen.getByRole('button', { name: 'Kirim pesan' }))
 await screen.findByRole('alert'); expect(input).toHaveValue('  Saya sudah paham.  ')
 fireEvent.click(screen.getByRole('button', { name: 'Coba kirim lagi' }))
 await screen.findByText('Saya sudah paham.')
 const sends = mocks.api.mock.calls.filter(call => call[2]?.method === 'POST')
 expect(sends).toHaveLength(2); expect(sends[0][1]).toEqual(sends[1][1])
 expect(sends[0][1]).toEqual({ body: 'Saya sudah paham.', requestId: expect.any(String) })
 expect(input).toHaveValue(''); expect(input).toHaveFocus()
 fireEvent.click(screen.getByRole('button', { name: 'Perbarui percakapan' }))
 await waitFor(() => expect(screen.getAllByText('Saya sudah paham.')).toHaveLength(1))
})

it('does not send on Shift+Enter or an IME composition Enter', async () => {
 mocks.api.mockImplementation(async (path, body, options) => options?.method === 'POST' ? message('4', body.body, 'student') : history)
 mount(); const input = screen.getByRole('textbox', { name: 'Pesan' })
 await waitFor(() => expect(input).toBeEnabled())
 fireEvent.change(input, { target: { value: 'Terima kasih' } })
 fireEvent.keyDown(input, { key: 'Enter', shiftKey: true })
 fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
 expect(mocks.api.mock.calls.filter(call => call[2]?.method === 'POST')).toHaveLength(0)
 fireEvent.keyDown(input, { key: 'Enter' })
 await screen.findByText('Terima kasih')
 expect(mocks.api.mock.calls.filter(call => call[2]?.method === 'POST')).toHaveLength(1)
})

it('loads older history with the original before cursor and keeps message order', async () => {
 mocks.api.mockImplementation(async path => path.includes('?before=') ? { messages: [message('1', 'Pesan sebelumnya.'), history.messages[0]], hasOlder: false } : { ...history, hasOlder: true })
 mount(); fireEvent.click(await screen.findByRole('button', { name: 'Muat pesan sebelumnya' }))
 await screen.findByText('Pesan sebelumnya.')
 expect(mocks.api).toHaveBeenCalledWith('/support/chat/link-a?before=2')
 expect(within(screen.getByRole('log')).getAllByRole('article').map(element => element.textContent)).toEqual([
  expect.stringContaining('Pesan sebelumnya.'), expect.stringContaining('Coba lihat contoh buah.'), expect.stringContaining('Baik, Bu.')
 ])
 expect(screen.getAllByText('Coba lihat contoh buah.')).toHaveLength(1)
})

it('keeps the reader position when a new reply arrives above the bottom', async () => {
 let reads = 0
 mocks.api.mockImplementation(async () => ({ messages: ++reads > 1 ? [...history.messages, message('4', 'Ada contoh baru.')] : history.messages, hasOlder: false }))
 mount(); await screen.findByText('Coba lihat contoh buah.')
 const log = screen.getByRole('log')
 Object.defineProperties(log, { scrollHeight: { configurable: true, value: 1000 }, clientHeight: { configurable: true, value: 300 } })
 log.scrollTop = 100; fireEvent.scroll(log)
 fireEvent.click(screen.getByRole('button', { name: 'Perbarui percakapan' }))
 await screen.findByText('Ada contoh baru.'); expect(log.scrollTop).toBe(100)
 fireEvent.click(screen.getByRole('button', { name: 'Pesan baru' }))
 expect(log.scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: 'auto' }); expect(log).toHaveFocus()
})

it('removes private history and disables sending after access is denied', async () => {
 mount(); await screen.findByText('Coba lihat contoh buah.')
 mocks.api.mockRejectedValue(new Error('Hubungan pendampingan telah berakhir.'))
 fireEvent.click(screen.getByRole('button', { name: 'Perbarui percakapan' }))
 await screen.findByRole('alert')
 expect(screen.queryByText('Coba lihat contoh buah.')).not.toBeInTheDocument()
 expect(screen.getByRole('textbox', { name: 'Pesan' })).toBeDisabled()
 expect(screen.getByRole('button', { name: 'Kirim pesan' })).toBeDisabled()
})

it('an unexpected history response produces a recoverable error', async () => {
 mocks.api.mockResolvedValue({ ok: true }); mount()
 expect(await screen.findByRole('alert')).toHaveTextContent('Pesan belum dapat dimuat')
 mocks.api.mockResolvedValue(history); fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))
 expect(await screen.findByText('Coba lihat contoh buah.')).toBeInTheDocument()
})

it('switching conversations clears the old draft and ignores late responses', async () => {
 let finishSend
 mocks.api.mockImplementation(async (path, body, options) => options?.method === 'POST' ? new Promise(resolve => { finishSend = resolve }) : path.endsWith('link-b') ? { messages: [message('7', 'Pesan orang tua.', 'parent')], hasOlder: false } : history)
 const view = mount(); await screen.findByText('Coba lihat contoh buah.')
 fireEvent.change(screen.getByRole('textbox', { name: 'Pesan' }), { target: { value: 'Untuk Bu Guru' } })
 fireEvent.click(screen.getByRole('button', { name: 'Kirim pesan' }))
 view.rerender(<SupportChat linkId="link-b" name="Orang Tua" subtitle="Orang tua"/>)
 await screen.findByText('Pesan orang tua.')
 await act(async () => finishSend(message('5', 'Untuk Bu Guru', 'student')))
 expect(screen.queryByText('Untuk Bu Guru')).not.toBeInTheDocument()
 expect(screen.queryByText('Coba lihat contoh buah.')).not.toBeInTheDocument()
 expect(screen.getByRole('textbox', { name: 'Pesan' })).toHaveValue('')
})

it('searches existing contacts without requesting another user conversation', () => {
 const select = vi.fn()
 mount({ linkId: undefined, conversations: [{ id: 'link-a', name: 'Bu Guru', subtitle: 'Guru' }, { id: 'link-b', name: 'Ayah', subtitle: 'Orang tua' }], onSelect: select })
 fireEvent.change(screen.getByRole('searchbox', { name: 'Cari percakapan' }), { target: { value: 'Ayah' } })
 expect(screen.queryByRole('button', { name: /Bu Guru/ })).not.toBeInTheDocument()
 fireEvent.click(screen.getByRole('button', { name: /Ayah/ }))
 expect(select).toHaveBeenCalledWith('link-b'); expect(mocks.api).not.toHaveBeenCalled()
})
