import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccount } from './Account'
export default function DeleteAccount() {
 const { session, deleteAccount } = useAccount()
 const navigate = useNavigate()
 const [open, setOpen] = useState(false)
 const [confirmation, setConfirmation] = useState('')
 const [busy, setBusy] = useState(false)
 const [error, setError] = useState('')
 if (!session) return null
 return <section className="panel privacy-panel"><h2>Hapus akun permanen</h2><p>Akun, profil, foto, dan riwayat belajar Anda akan dihapus. Tindakan ini tidak dapat dibatalkan.</p>{!open ? <button className="btn secondary" onClick={() => setOpen(true)}>Hapus akun saya</button> : <form onSubmit={async event => {
  event.preventDefault(); if (busy || confirmation !== 'HAPUS AKUN') return
  setBusy(true); setError('')
  try { await deleteAccount(confirmation); navigate('/signin', { replace: true }) }
  catch (e) { setError(e.message); setBusy(false) }
 }}><label className="field">Ketik HAPUS AKUN untuk menghapus akun {session.user.email}<input autoComplete="off" value={confirmation} disabled={busy} onChange={e => setConfirmation(e.target.value)} /></label>{error && <p role="alert">{error}</p>}<div className="form-actions"><button type="button" className="btn secondary" disabled={busy} onClick={() => { setOpen(false); setConfirmation(''); setError('') }}>Batal</button><button className="btn" disabled={busy || confirmation !== 'HAPUS AKUN'}>{busy ? 'Menghapus akun…' : 'Hapus permanen'}</button></div></form>}</section>
}
