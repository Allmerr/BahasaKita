import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import Icon from './components/Icon.jsx'
import { useStore } from './learning.jsx'
import { useAccount } from './Account.jsx'
import { normalizeEmail, verifyCredential, createCredential } from './auth.js'

export function Splash({ onFinish }) {
 const { state } = useStore()
 const reduced = state.settings.comfortable || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
 useEffect(() => { const timer = window.setTimeout(onFinish, reduced ? 700 : 2400); return () => window.clearTimeout(timer) }, [onFinish, reduced])
 return <main className={`entry-splash ${reduced ? 'reduced' : ''}`} aria-label="Layar pembuka BahasaKita"><div className="splash-halo halo-one"/><div className="splash-halo halo-two"/><div className="splash-center"><div className="splash-logo"><img src="/images/logo-bahasa-kita.png" alt="BahasaKita"/></div><p className="splash-tagline">Belajar dengan caramu. Bertumbuh bersama.</p><div className="splash-loading" role="status" aria-label="Menyiapkan beranda"><i/><i/><i/></div></div></main>
}
export function AuthLayout() {
 const { pathname } = useLocation()
 return <div className="auth-backdrop soft-login-backdrop"><div className={`auth-shell auth-frame auth-login-page ${pathname === '/signup' ? 'soft-register-page' : ''}`}><main className="auth-content"><Outlet/></main></div></div>
}
export function Login({ onEnter }) {
 const { login } = useAccount(); const navigate = useNavigate(); const location = useLocation(); const [email, setEmail] = useState(() => { try { return localStorage.getItem('bahasakita-login-email') || '' } catch { return '' } }); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false); const [remember, setRemember] = useState(() => { try { return !!localStorage.getItem('bahasakita-login-email') } catch { return false } }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false); const heading = useRef(null)
 useEffect(() => { heading.current?.focus() }, [])
 const submit = async e => {
  e.preventDefault(); if (busy) return
  setBusy(true); setError('')
  try {
   const valid = normalizeEmail(email) === state.profile.email && await verifyCredential(password, state.profile.credential)
   if (!valid) { setError('Email atau kata sandi belum cocok. Periksa kembali.'); return }
   try { if (remember) localStorage.setItem('bahasakita-login-email', normalizeEmail(email)); else localStorage.removeItem('bahasakita-login-email') } catch {}
   onEnter(); navigate('/', { replace: true })
  } catch (error) { setError(error.message) }
  finally { setBusy(false) }
 }
 return <div className="login-center"><section className="login-reference-card login-soft-card" aria-labelledby="login-heading"><img className="login-card-logo" src="/images/logo-bahasa-kita.png" alt="BahasaKita"/><h1 id="login-heading" ref={heading} tabIndex={-1}>Selamat datang kembali</h1><p className="login-card-description">{location.state?.loginRequired ? 'Masuk untuk menggunakan fitur belajarmu.' : 'Masukkan email dan kata sandi untuk melanjutkan.'}</p><form onSubmit={submit}><label className="soft-login-field"><span>Email</span><div className="soft-input-wrap"><Icon name="mail" size={21}/><input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder="Alamat email" required maxLength={254} autoComplete="username" aria-describedby={error ? 'login-error' : undefined} aria-invalid={!!error}/></div></label><label className="soft-login-field"><span>Kata sandi</span><div className="soft-input-wrap"><Icon name="lock" size={21}/><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder="Masukkan kata sandi" required maxLength={128} autoComplete="current-password" aria-describedby={error ? 'login-error' : undefined} aria-invalid={!!error}/><button type="button" className="password-toggle" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}><Icon name={showPassword ? 'eye' : 'eyeOff'} size={20}/></button></div></label><label className="login-remember"><input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/><span>Ingat email saya</span></label>{error && <p className="login-error" id="login-error" role="alert">{error}</p>}<button className="btn login-rounded-submit" type="submit" disabled={busy}>{busy ? 'Sedang masuk…' : 'Masuk ke beranda'}</button></form><div className="login-line-divider"><span>ATAU</span></div><div className="social-login-options"><button type="button" disabled aria-describedby="social-login-status"><span className="google-letter" aria-hidden="true">G</span>Google</button><button type="button" disabled aria-describedby="social-login-status"><svg width="20" height="23" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 3c-1 0-3 1-4 3 2 0 4-2 4-3ZM20 17c-1 3-3 5-4 5s-2-1-4-1-3 1-4 1-4-4-5-8C2 9 4 6 7 6c2 0 3 1 5 1s3-1 5-1c2 0 3 1 4 2-4 2-4 7-1 9Z"/></svg>Apple</button></div><p className="social-login-status" id="social-login-status">Google dan Apple belum terhubung.</p><div className="login-signup-bottom"><span>Belum punya profil?</span><Link to="/signup" className="login-register-link">Register</Link></div></section></div>
}

export function Register({ onEnter }) {
 const { register } = useAccount(); const { state } = useStore(); const navigate = useNavigate(); const heading = useRef(null)
 const [name, setName] = useState(state.profile?.name || '')
 const [email, setEmail] = useState(state.profile?.email || '')
 const [password, setPassword] = useState(''); const [confirmation, setConfirmation] = useState(''); const [showPassword, setShowPassword] = useState(false)
 const [grade, setGrade] = useState('SD'); const goal = state.profile?.goal || 'Mengenal kata'
 const [error, setError] = useState(''); const [busy, setBusy] = useState(false)
 useEffect(() => { heading.current?.focus() }, [])
 const submit = async event => {
  event.preventDefault(); if (busy) return
  if (!name.trim()) { setError('Isi nama panggilanmu terlebih dahulu.'); return }
  if (!grade) { setError('Pilih jenjang belajarmu terlebih dahulu.'); return }
  if (password !== confirmation) { setError('Konfirmasi kata sandi belum cocok.'); return }
  setBusy(true); setError('')
  try {
   const credential = await createCredential(password)
   setState(previous => ({ ...previous, profile: { name: name.trim(), email: normalizeEmail(email), grade, goal, credential } }))
   onEnter(); navigate('/', { replace: true })
  } catch (error) { setError(error.message) }
  finally { setBusy(false) }
 }
 return <div className="login-center"><section className="login-reference-card login-soft-card register-soft-card" aria-labelledby="register-heading"><img className="login-card-logo" src="/images/logo-bahasa-kita.png" alt="BahasaKita"/><h1 id="register-heading" ref={heading} tabIndex={-1}>Mari kenalan dulu</h1><p className="login-card-description">Buat profil dan mulai perjalanan belajarmu.</p><form onSubmit={submit}>
 <label className="soft-login-field"><span>Nama panggilan</span><div className="soft-input-wrap"><Icon name="profile" size={21}/><input value={name} onChange={e => { setName(e.target.value); setError('') }} placeholder="Nama panggilanmu" required maxLength={30} autoComplete="nickname"/></div></label>
 <label className="soft-login-field"><span>Email</span><div className="soft-input-wrap"><Icon name="mail" size={21}/><input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder="Alamat email" required maxLength={254} autoComplete="username"/></div></label>
 <label className="soft-login-field"><span>Kata sandi</span><div className="soft-input-wrap"><Icon name="lock" size={21}/><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder="Minimal 8 karakter" required minLength={8} maxLength={128} autoComplete="new-password"/><button type="button" className="password-toggle" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}><Icon name={showPassword ? 'eye' : 'eyeOff'} size={20}/></button></div></label>
 <label className="soft-login-field"><span>Konfirmasi kata sandi</span><div className="soft-input-wrap"><Icon name="lock" size={21}/><input type={showPassword ? 'text' : 'password'} value={confirmation} onChange={e => { setConfirmation(e.target.value); setError('') }} placeholder="Ulangi kata sandi" required minLength={8} maxLength={128} autoComplete="new-password" aria-describedby={error ? 'register-error' : undefined}/></div></label>
 <label className="soft-login-field"><span>Jenjang belajar</span><div className="soft-input-wrap"><Icon name="book" size={21}/><select value={grade} onChange={e => { setGrade(e.target.value); setError('') }} required aria-describedby={error ? 'register-error' : undefined}><option value="" disabled>Pilih jenjang belajar</option><option value="SD">SD</option></select></div></label>
 {error && <p className="login-error" id="register-error" role="alert">{error}</p>}<button className="btn login-rounded-submit" type="submit" disabled={busy}>{busy ? 'Menyimpan…' : 'Register'}</button></form><div className="login-line-divider"><span>ATAU</span></div><div className="social-login-options"><button type="button" disabled aria-describedby="register-social-status"><span className="google-letter" aria-hidden="true">G</span>Google</button><button type="button" disabled aria-describedby="register-social-status"><svg width="20" height="23" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 3c-1 0-3 1-4 3 2 0 4-2 4-3ZM20 17c-1 3-3 5-4 5s-2-1-4-1-3 1-4 1-4-4-5-8C2 9 4 6 7 6c2 0 3 1 5 1s3-1 5-1c2 0 3 1 4 2-4 2-4 7-1 9Z"/></svg>Apple</button></div><p className="social-login-status" id="register-social-status">Google dan Apple belum terhubung.</p><div className="login-signup-bottom"><span>Sudah punya profil?</span><Link to="/signin" className="login-register-link">Login</Link></div></section></div>
}
