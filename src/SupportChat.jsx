import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useAccount } from './Account'
import Icon from './components/Icon.jsx'
import './chat.css'

const initials = name => name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toLocaleUpperCase('id')
const fullDate = value => new Date(value).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })
const time = value => new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
function dayLabel(value) {
 const date = new Date(value), today = new Date(), yesterday = new Date()
 yesterday.setDate(today.getDate() - 1)
 return date.toDateString() === today.toDateString() ? 'Hari ini' : date.toDateString() === yesterday.toDateString() ? 'Kemarin' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function Conversation({ linkId, name, subtitle, onBack, headingRef }) {
 const { accountApi, session } = useAccount(), api = useRef(accountApi)
 api.current = accountApi
 const [messages, setMessages] = useState([]), [body, setBody] = useState('')
 const [readError, setReadError] = useState(''), [sendError, setSendError] = useState(''), [olderError, setOlderError] = useState('')
 const [sending, setSending] = useState(false), [loading, setLoading] = useState(true), [loadingOlder, setLoadingOlder] = useState(false)
 const [older, setOlder] = useState(false), [available, setAvailable] = useState(false), [newMessages, setNewMessages] = useState(false), [revision, setRevision] = useState(0), [notice, setNotice] = useState('')
 const request = useRef(null), pending = useRef(false), mounted = useRef(false), olderBusy = useRef(false), initialized = useRef(false)
 const history = useRef(null), input = useRef(null), currentMessages = useRef([]), nearBottom = useRef(true), scrollChange = useRef(null), focusAfterSend = useRef(false)
 const helperId = useId()
 const readHistory = result => {
  if (!Array.isArray(result?.messages)) throw new Error('Pesan belum dapat dimuat. Coba perbarui percakapan.')
  return result
 }
 const merge = (items, kind = 'poll') => {
  const element = history.current
  if (kind === 'older') scrollChange.current = { height: element?.scrollHeight || 0, top: element?.scrollTop || 0 }
  else if (kind === 'sent' || !initialized.current || nearBottom.current) scrollChange.current = { bottom: true }
  else if (items.some(item => !currentMessages.current.some(message => message.id === item.id))) setNewMessages(true)
  setMessages(previous => [...new Map([...previous, ...items].map(message => [message.id, message])).values()].sort((a, b) => BigInt(a.id) < BigInt(b.id) ? -1 : 1))
 }
 useEffect(() => {
  mounted.current = true
  let active = true, timer
  const controller = new AbortController()
  const poll = async () => {
   try {
    const data = readHistory(await api.current('/support/chat/' + linkId, undefined, { signal: controller.signal }))
    if (active) {
     merge(data.messages)
     if (!initialized.current) { setOlder(data.hasOlder); initialized.current = true }
     setAvailable(true); setReadError('')
    }
   } catch (error) {
    if (active) { setReadError(error.message); setAvailable(false); setMessages([]); setNewMessages(false); initialized.current = false }
   } finally { if (active) { setLoading(false); timer = setTimeout(poll, 5000) } }
  }
  poll()
  return () => { active = false; mounted.current = false; clearTimeout(timer); controller.abort() }
 }, [linkId, revision])
 useLayoutEffect(() => {
  currentMessages.current = messages
  const element = history.current, change = scrollChange.current
  if (element && change) {
   if (change.bottom) { element.scrollTop = element.scrollHeight; nearBottom.current = true; setNewMessages(false) }
   else element.scrollTop = change.top + element.scrollHeight - change.height
  }
  scrollChange.current = null
 }, [messages])
 useLayoutEffect(() => {
  if (input.current) { input.current.style.height = 'auto'; input.current.style.height = Math.min(input.current.scrollHeight, 144) + 'px' }
 }, [body])
 useEffect(() => {
  if (typeof ResizeObserver === 'undefined' || !history.current) return
  const observer = new ResizeObserver(() => {
   if (nearBottom.current && history.current) history.current.scrollTop = history.current.scrollHeight
  })
  observer.observe(history.current)
  return () => observer.disconnect()
 }, [])
 useEffect(() => {
  if (!sending && focusAfterSend.current) { input.current?.focus({ preventScroll: true }); focusAfterSend.current = false }
 }, [sending])
 const send = async event => {
  event.preventDefault()
  if (pending.current || !body.trim() || !available) return
  const text = body.trim()
  if (request.current?.body !== text) request.current = { body: text, requestId: crypto.randomUUID() }
  pending.current = true; setSending(true); setSendError(''); setNotice('')
  try {
   const result = await api.current('/support/chat/' + linkId, request.current, { method: 'POST' })
   if (mounted.current) { merge([result], 'sent'); setBody(''); request.current = null; setNotice('Pesan terkirim.'); focusAfterSend.current = true }
  } catch (error) { if (mounted.current) setSendError(error.message) }
  finally { pending.current = false; if (mounted.current) setSending(false) }
 }
 const loadOlder = async () => {
  if (olderBusy.current || !messages.length) return
  olderBusy.current = true; setLoadingOlder(true); setOlderError('')
  try {
   const result = readHistory(await api.current('/support/chat/' + linkId + '?before=' + messages[0].id))
   if (mounted.current) { merge(result.messages, 'older'); setOlder(result.hasOlder) }
  } catch (error) { if (mounted.current) setOlderError(error.message) }
  finally { olderBusy.current = false; if (mounted.current) setLoadingOlder(false) }
 }
 const jumpToLatest = () => {
  history.current?.scrollTo({ top: history.current.scrollHeight, behavior: 'auto' })
  nearBottom.current = true; setNewMessages(false); history.current?.focus({ preventScroll: true })
 }
 return <div className="dm-thread">
  <header className="dm-thread-header">
   <button type="button" className="dm-icon-button dm-back" onClick={onBack} aria-label="Kembali ke daftar percakapan"><Icon name="arrowLeft"/></button>
   <span className="dm-avatar" aria-hidden="true">{initials(name)}</span>
   <div className="dm-contact"><h3 ref={headingRef} tabIndex={-1}>{name}</h3><p>{subtitle || 'Pendamping belajar'}</p></div>
   <button type="button" className="dm-icon-button" onClick={() => setRevision(value => value + 1)} aria-label="Perbarui percakapan" title="Perbarui percakapan"><Icon name="refresh" size={20}/></button>
  </header>
  <div className="dm-privacy"><Icon name="lock" size={14}/><span>Percakapan pribadi untuk mendampingi belajar.</span></div>
  {readError && <div className="dm-alert" role="alert"><span>{readError}</span><button type="button" onClick={() => setRevision(value => value + 1)}>Coba lagi</button></div>}
  <div className="dm-history-wrap">
   <div ref={history} className="dm-history" role="log" aria-label={'Percakapan dengan ' + name} aria-live="polite" aria-relevant="additions" tabIndex={0} onScroll={() => {
    const element = history.current
    nearBottom.current = element.scrollHeight - element.scrollTop - element.clientHeight < 64
    if (nearBottom.current) setNewMessages(false)
   }}>
    {older && available && <button type="button" className="dm-load-older" disabled={loadingOlder} onClick={loadOlder}>{loadingOlder ? 'Memuat pesan sebelumnya…' : 'Muat pesan sebelumnya'}</button>}
    {olderError && <p className="dm-inline-error" role="alert">{olderError}</p>}
    {loading && <div className="dm-empty" role="status"><span className="dm-empty-icon"><Icon name="message" size={30}/></span><p>Memuat percakapanmu…</p></div>}
    {!messages.length && !loading && available && <div className="dm-empty"><span className="dm-empty-icon"><Icon name="message" size={32}/></span><h4>Mulai cerita belajarmu</h4><p>Tanyakan materi yang belum dipahami atau bagikan kemajuanmu dengan {name}.</p></div>}
    {!messages.length && !loading && !available && <div className="dm-empty"><span className="dm-empty-icon"><Icon name="message" size={32}/></span><h4>Percakapan belum tersedia</h4><p>Periksa koneksi atau pastikan hubungan pendampingan masih aktif.</p></div>}
    {messages.map((message, index) => {
     const mine = message.sender_id === session?.user.id, previous = messages[index - 1]
     const newDay = !previous || new Date(previous.created_at).toDateString() !== new Date(message.created_at).toDateString()
     const grouped = !newDay && previous.sender_id === message.sender_id
     return <div className="dm-message-block" key={message.id}>
      {newDay && <div className="dm-day-marker">{dayLabel(message.created_at)}</div>}
      <article className={'dm-message-row' + (mine ? ' mine' : '') + (grouped ? ' grouped' : '')}>
       {!mine && <span className={'dm-message-avatar' + (grouped ? ' invisible' : '')} aria-hidden="true">{initials(name)}</span>}
       <div className="dm-bubble"><span className="sr-only">{mine ? 'Kamu' : name}: </span><p>{message.body}</p><time dateTime={message.created_at} title={fullDate(message.created_at)} aria-label={fullDate(message.created_at)}>{time(message.created_at)}</time></div>
      </article>
     </div>
    })}
   </div>
   {newMessages && <button type="button" className="dm-new-messages" onClick={jumpToLatest}>Pesan baru<Icon name="arrow" size={16}/></button>}
  </div>
  <form className="dm-composer" onSubmit={send}>
   {sendError && <p className="dm-send-error" role="alert"><Icon name="info" size={17}/><span>{sendError} Pesanmu masih tersimpan di kolom ini. Coba kirim lagi.</span></p>}
   <div className="dm-compose-box"><label className="sr-only" htmlFor={helperId + '-input'}>Pesan</label><textarea ref={input} id={helperId + '-input'} value={body} onChange={event => { setBody(event.target.value); setSendError(''); setNotice('') }} maxLength={2000} rows={1} disabled={sending || !available} placeholder={'Tulis pesan untuk ' + name + '…'} aria-describedby={helperId} onKeyDown={event => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && !window.matchMedia?.('(pointer: coarse)').matches) send(event)
   }}/><button type="submit" className="dm-send" disabled={sending || !available || !body.trim()} aria-label={sending ? 'Mengirim pesan' : sendError ? 'Coba kirim lagi' : 'Kirim pesan'} title="Kirim pesan"><Icon name="send" size={21}/></button></div>
   <div className="dm-compose-footer" id={helperId}><span className="dm-keyboard-hint">Enter untuk kirim · Shift+Enter untuk baris baru</span><span className="dm-touch-hint">Pesan teks · Maks. 2.000 karakter</span><span className={body.length >= 1800 ? 'dm-character-warning' : ''}>{body.length}/2000</span></div>
   <p className="sr-only" role="status">{sending ? 'Mengirim pesan…' : notice}</p>
  </form>
 </div>
}

export default function SupportChat({ linkId, name = '', subtitle = '', conversations = [], onSelect }) {
 const [search, setSearch] = useState(''), [mobileThread, setMobileThread] = useState(!!linkId)
 const heading = useRef(null), searchInput = useRef(null)
 const contacts = conversations.length ? conversations : linkId ? [{ id: linkId, name, subtitle }] : []
 const filtered = contacts.filter(contact => (contact.name + ' ' + (contact.subtitle || '')).toLocaleLowerCase('id').includes(search.toLocaleLowerCase('id')))
 useEffect(() => { if (linkId) setMobileThread(true) }, [linkId])
 const select = contact => {
  onSelect?.(contact.id); setMobileThread(true)
  requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }))
 }
 return <section id="support-messages" className={'support-section dm-inbox' + (mobileThread && linkId ? ' dm-mobile-thread' : '')} aria-label="Pesan pendampingan" tabIndex={-1}>
  <aside className="dm-sidebar" aria-label="Daftar percakapan">
   <div className="dm-inbox-heading"><span className="dm-inbox-icon"><Icon name="message" size={25}/></span><div><h2>Pesan</h2><p>Belajar, berbagi, bertumbuh.</p></div><span className="dm-contact-count" aria-label={contacts.length + ' percakapan'}>{contacts.length}</span></div>
   <label className="dm-search"><Icon name="search" size={19}/><span className="sr-only">Cari percakapan</span><input ref={searchInput} type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari percakapan…"/></label>
   <nav className="dm-contacts" aria-label="Pilih percakapan">{filtered.map(contact => <button type="button" key={contact.id} className={'dm-contact-button' + (contact.id === linkId ? ' selected' : '')} aria-current={contact.id === linkId ? 'true' : undefined} onClick={() => select(contact)}><span className="dm-avatar" aria-hidden="true">{initials(contact.name)}</span><span className="dm-contact-copy"><strong>{contact.name}</strong><span>{contact.subtitle || 'Pendamping belajar'}</span><small>{contact.id === linkId ? 'Percakapan dipilih' : 'Buka percakapan'}</small></span><Icon name="chevron" size={17}/></button>)}</nav>
   {!filtered.length && <p className="dm-no-results">{search ? 'Nama belum ditemukan. Coba nama lain.' : 'Percakapan muncul setelah kamu terhubung dengan pendamping.'}</p>}
   <p className="dm-sidebar-note"><Icon name="hand" size={19}/><span>Saling mendukung, satu pesan setiap kali.</span></p>
  </aside>
  {linkId ? <Conversation key={linkId} linkId={linkId} name={name} subtitle={subtitle} headingRef={heading} onBack={() => { setMobileThread(false); requestAnimationFrame(() => searchInput.current?.focus({ preventScroll: true })) }}/> : <div className="dm-placeholder"><span className="dm-empty-icon"><Icon name="message" size={38}/></span><h3>Pesan belajarmu</h3><p>Pilih nama di daftar untuk bertanya, berbagi kemajuan, atau menyapa pendampingmu.</p></div>}
 </section>
}
