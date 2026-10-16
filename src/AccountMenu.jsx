import { useEffect, useId, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAccount } from './Account.jsx'
import { ProfileAvatar } from './AccountProfile.jsx'
import Icon from './components/Icon.jsx'
import { displayName } from './displayName.js'

export default function AccountMenu({ profile, authorized, variant = 'header', subtitle }) {
 const { logout } = useAccount()
 const { pathname } = useLocation()
 const navigate = useNavigate()
 const [open, setOpen] = useState(false)
 const [busy, setBusy] = useState(false)
 const [error, setError] = useState('')
 const container = useRef(null)
 const trigger = useRef(null)
 const dropdownId = useId()
 const sidebar = variant === 'sidebar'

 useEffect(() => { setOpen(false); setError('') }, [pathname])
 useEffect(() => {
  if (!open) return
  const outside = event => { if (!container.current?.contains(event.target)) setOpen(false) }
  const escape = event => {
   if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current?.focus() }
  }
  document.addEventListener('pointerdown', outside)
  document.addEventListener('keydown', escape)
  return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape) }
 }, [open])

 const signOut = async () => {
  if (busy) return
  setBusy(true); setError('')
  try { await logout(); setOpen(false); navigate('/signin', { replace: true }) }
  catch (error) { setError(error.message || 'Belum berhasil keluar. Coba lagi.'); setOpen(true) }
  finally { setBusy(false) }
 }

 if (!authorized && !sidebar) return <Link data-public-navigation to="/signin" className="avatar" aria-label="Masuk ke akun"><ProfileAvatar profile={null}/></Link>
 return <div className={`account-menu${sidebar ? ' account-menu-sidebar' : ''}`} ref={container} onBlur={event => {
  if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false)
 }}>
  {sidebar ? <div className="sidebar-profile account-menu-card">
   <Link data-assessment-navigation={authorized || undefined} data-public-navigation={!authorized || undefined} to={authorized ? '/profile' : '/signin'} className="account-menu-profile-link" onClick={() => setOpen(false)}>
    <span className="profile-card-avatar"><ProfileAvatar profile={authorized ? profile : null} size={23}/></span>
    <span className="sidebar-profile-copy"><strong>{profile?.name ? displayName(profile.name) : 'Profil saya'}</strong><small>{subtitle || (authorized ? profile?.grade || 'SD' : 'Lihat profilmu')}</small></span>
   </Link>
   {authorized ? <button data-assessment-navigation type="button" className="account-menu-arrow" ref={trigger} aria-label="Menu profil sidebar" aria-expanded={open} aria-controls={dropdownId} onClick={() => setOpen(value => !value)}><Icon name="chevron" size={17}/></button> : <Icon name="chevron" size={17}/>}
  </div> : <button data-assessment-navigation type="button" className="avatar account-menu-trigger" ref={trigger} aria-label="Menu profil" aria-expanded={open} aria-controls={dropdownId} onClick={() => setOpen(value => !value)}>
   <ProfileAvatar profile={profile}/>
  </button>}
  {authorized && open && <nav className="account-dropdown" id={dropdownId} aria-label={sidebar ? 'Menu akun sidebar' : 'Menu akun'}>
   <Link data-assessment-navigation to="/profile" onClick={() => setOpen(false)}><Icon name="profile" size={19}/>Profil</Link>
   <button data-assessment-navigation type="button" disabled={busy} onClick={signOut}><Icon name="logout" size={19}/>{busy ? 'Sedang keluar…' : 'Log out'}</button>
   {error && <p className="account-menu-error" role="alert">{error}</p>}
  </nav>}
 </div>
}
