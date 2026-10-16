import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './components/Icon.jsx'
import { useAccount } from './Account.jsx'

function RecoveryCard({ title, description, children }) {
  return <div className="login-center"><section className="login-reference-card login-soft-card recovery-soft-card" aria-labelledby="recovery-heading">
    <img className="login-card-logo" src="/images/logo-bahasa-kita.png" alt="BahasaKita"/>
    <h1 id="recovery-heading">{title}</h1>
    <p className="login-card-description">{description}</p>
    {children}
    <div className="login-signup-bottom"><Link to="/signin" className="login-register-link">Kembali ke login</Link></div>
  </section></div>
}

export function ForgotPassword() {
  const { requestPasswordReset } = useAccount()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const submit = async event => {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await requestPasswordReset(email)
      setSent(true)
    } catch (cause) {
      setError(cause.message)
    } finally {
      setBusy(false)
    }
  }
  return <RecoveryCard title="Lupa kata sandi?" description="Masukkan email akunmu. Kami akan mengirim tautan untuk membuat kata sandi baru.">
    {sent ? <p className="recovery-notice" role="status">Jika email terdaftar, tautan reset telah dikirim. Periksa kotak masuk dan folder spam.</p> : <form onSubmit={submit}>
      <label className="soft-login-field"><span>Email</span><div className="soft-input-wrap"><Icon name="mail" size={21}/><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Alamat email" required maxLength={254} autoComplete="email"/></div></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="btn login-rounded-submit" type="submit" disabled={busy}>{busy ? 'Mengirim…' : 'Kirim tautan reset'}</button>
    </form>}
  </RecoveryCard>
}

export function ResetPassword() {
  const { session, loading, updatePassword } = useAccount()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const callbackError = new URLSearchParams(window.location.hash.slice(1)).has('error') || new URLSearchParams(window.location.search).has('error')
  const submit = async event => {
    event.preventDefault()
    if (busy) return
    if (password !== confirmation) { setError('Konfirmasi kata sandi belum cocok.'); return }
    setBusy(true)
    setError('')
    try {
      await updatePassword(password)
      setDone(true)
    } catch (cause) {
      setError(cause.message)
    } finally {
      setBusy(false)
    }
  }
  return <RecoveryCard title="Buat kata sandi baru" description="Gunakan minimal 8 karakter untuk melindungi akunmu.">
    {loading ? <p role="status">Memeriksa tautan reset…</p> : callbackError || !session ? <p className="login-error" role="alert">Tautan reset tidak berlaku atau sudah kedaluwarsa. Minta tautan baru dari halaman login.</p> : done ? <p className="recovery-notice" role="status">Kata sandi berhasil diubah. Kamu dapat kembali ke aplikasi.</p> : <form onSubmit={submit}>
      <label className="soft-login-field"><span>Kata sandi baru</span><div className="soft-input-wrap"><Icon name="lock" size={21}/><input type="password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Minimal 8 karakter" required minLength={8} maxLength={128} autoComplete="new-password"/></div></label>
      <label className="soft-login-field"><span>Konfirmasi kata sandi baru</span><div className="soft-input-wrap"><Icon name="lock" size={21}/><input type="password" value={confirmation} onChange={event => setConfirmation(event.target.value)} placeholder="Ulangi kata sandi" required minLength={8} maxLength={128} autoComplete="new-password"/></div></label>
      {error && <p className="login-error" role="alert">{error}</p>}
      <button className="btn login-rounded-submit" type="submit" disabled={busy}>{busy ? 'Menyimpan…' : 'Simpan kata sandi baru'}</button>
    </form>}
    {!session && !loading && <p className="recovery-secondary"><Link to="/forgot-password">Minta tautan reset baru</Link></p>}
    {done && <p className="recovery-secondary"><Link to="/">Buka beranda</Link></p>}
  </RecoveryCard>
}
