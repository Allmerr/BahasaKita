import { useEffect, useRef, useState } from 'react'
import Icon from './components/Icon.jsx'
import { displayName } from './displayName.js'
import { useStore } from './learning.jsx'
import './profile.css'

export function ProfileAvatar({ profile, size = 24 }) {
 const [failed, setFailed] = useState(false)
 useEffect(() => { setFailed(false) }, [profile?.avatar_url])
 return profile?.avatar_url && !failed
  ? <img className="profile-photo" src={profile.avatar_url} alt={`Foto profil ${displayName(profile.name || 'pengguna')}`} onError={() => setFailed(true)}/>
  : profile?.name?.[0]?.toUpperCase() || <Icon name="profile" size={size}/>
}

export function ProfileEditor() {
 const { state, saveProfile,isSupporter } = useStore()
 const profile = state.profile
 const [fields, setFields] = useState(() => ({ name: displayName(profile?.name), grade: profile?.grade || 'SD', goal: profile?.goal || 'Mengenal kata' }))
 const [saving, setSaving] = useState(false)
 const [notice, setNotice] = useState('')
 const [error, setError] = useState('')
 useEffect(() => {
  setFields({ name: displayName(profile?.name), grade: profile?.grade || 'SD', goal: profile?.goal || 'Mengenal kata' })
 }, [profile?.name, profile?.grade, profile?.goal])
 const change = event => { setFields(previous => ({ ...previous, [event.target.name]: event.target.value })); setNotice(''); setError('') }
 const submit = async event => {
  event.preventDefault()
  if (saving) return
  setSaving(true); setNotice(''); setError('')
  try {
   const saved = await saveProfile({ ...fields, name: displayName(fields.name.trim()) })
   setFields({ name: displayName(saved.name), grade: saved.grade, goal: saved.goal })
   setNotice('Nama, jenjang, dan tujuan belajar berhasil disimpan.')
  } catch (error) { setError(error.message) }
  finally { setSaving(false) }
 }
 return <section className="panel"><h2>{isSupporter?'Profil pendamping':'Profil belajarmu'}</h2><form onSubmit={submit}>
  <label className="field">Nama panggilan<input name="name" required maxLength={30} value={fields.name} onChange={change} autoComplete="nickname" disabled={saving}/></label>
  {!isSupporter&&<><label className="field">Jenjang<select name="grade" value={fields.grade} onChange={change} disabled={saving}><option>SD</option><option>SMP</option><option>SMA</option></select></label>
  <label className="field">Tujuan belajar<select name="goal" value={fields.goal} onChange={change} disabled={saving}><option>Mengenal kata</option><option>Memahami cerita</option><option>Belajar matematika</option></select></label></>}
  <button className="btn" type="submit" disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan profil'}<Icon name="check" size={17}/></button>
  {!isSupporter&&<p className="muted">Materi dan kamus mengikuti jenjang belajarmu.</p>}
  {notice && <p role="status" className="save-notice">{notice}</p>}{error && <p role="alert" className="profile-error">{error}</p>}
 </form></section>
}

export function ProfilePhotoEditor() {
 const { state, uploadAvatar, removeAvatar } = useStore()
 const [file, setFile] = useState(null)
 const [preview, setPreview] = useState(null)
 const [busy, setBusy] = useState(false)
 const [notice, setNotice] = useState('')
 const [error, setError] = useState('')
 const input = useRef(null)
 useEffect(() => {
  if (!file) { setPreview(null); return }
  const url = URL.createObjectURL(file)
  setPreview(url)
  return () => URL.revokeObjectURL(url)
 }, [file])
 const select = event => {
  const next = event.target.files?.[0]
  setNotice(''); setError('')
  if (!next) { setFile(null); return }
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(next.type) || !next.size || next.size > 2 * 1024 * 1024) {
   setError('Pilih foto JPG, PNG, atau WebP dengan ukuran maksimal 2 MB.')
   event.target.value = ''; setFile(null); return
  }
  setFile(next)
 }
 const save = async event => {
  event.preventDefault()
  if (!file || busy) return
  setBusy(true); setNotice(''); setError('')
  try { await uploadAvatar(file); setFile(null); input.current.value = ''; setNotice('Foto profil berhasil disimpan.') }
  catch (error) { setError(error.message) }
  finally { setBusy(false) }
 }
 const remove = async () => {
  if (busy) return
  setBusy(true); setNotice(''); setError('')
  try { await removeAvatar(); setFile(null); input.current.value = ''; setNotice('Foto profil berhasil dihapus.') }
  catch (error) { setError(error.message) }
  finally { setBusy(false) }
 }
 return <section className="panel profile-photo-editor"><h2>Foto profil</h2><form onSubmit={save}>
  <div className="profile-photo-preview"><div className="profile-main-avatar"><ProfileAvatar profile={{ ...state.profile, ...(preview ? { avatar_url: preview } : {}) }} size={38}/></div><p>Gunakan foto JPG, PNG, atau WebP, maksimal 2 MB. Foto tersimpan di akunmu.</p></div>
  <label className="field">Pilih foto profil<input ref={input} type="file" accept="image/jpeg,image/png,image/webp" onChange={select} disabled={busy} aria-describedby="profile-photo-help"/></label>
  <p id="profile-photo-help" className="muted">Pratinjau foto terlebih dahulu, lalu tekan Simpan foto.</p>
  <div className="profile-photo-actions"><button className="btn" type="submit" disabled={busy || !file}>{busy ? 'Memproses…' : 'Simpan foto'}</button>{state.profile?.avatar_path && <button className="btn secondary" type="button" onClick={remove} disabled={busy}>Hapus foto</button>}</div>
  {notice && <p role="status" className="save-notice">{notice}</p>}{error && <p role="alert" className="profile-error">{error}</p>}
 </form></section>
}
