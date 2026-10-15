import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './learning.jsx'
import './workspace.css'

export default function WorkspaceMode(){
 const {isAdmin,studentPreview,startPreview,stopPreview,state,saveProfile}=useStore()
 const navigate=useNavigate(),[busy,setBusy]=useState(false),[error,setError]=useState('')
 if(!isAdmin)return null
 const run=async(action,to)=>{setBusy(true);setError('');try{await action();navigate(to)}catch(e){setError(e.message)}finally{setBusy(false)}}
 return <section className={`workspace-mode ${studentPreview?'student-preview':'admin-workspace'}`} aria-label={studentPreview?'Mode pratinjau siswa':'Mode admin'}><div><strong>{studentPreview?'Pratinjau siswa':'Mode admin'}</strong><p>{studentPreview?'Jawaban, nilai, dan perubahan profil di sini adalah data uji sementara.':'Kelola materi dan soal. Coba pengalaman belajar melalui pratinjau siswa.'}</p></div>{studentPreview?<><label className="preview-grade">Jenjang pratinjau<select data-public-navigation value={state.profile.grade} disabled={busy} onChange={e=>{const grade=e.target.value;run(()=>saveProfile({name:state.profile.name,goal:state.profile.goal,grade}),'/')}}>{['SD','SMP','SMA'].map(grade=><option key={grade}>{grade}</option>)}</select></label><button data-public-navigation className="btn secondary" disabled={busy} onClick={()=>run(stopPreview,'/admin')}>{busy?'Memproses…':'Kembali ke admin'}</button></>:<button data-public-navigation className="btn" disabled={busy} onClick={()=>run(()=>startPreview(),'/')}>{busy?'Menyiapkan…':'Lihat sebagai siswa'}</button>}{error&&<p className="workspace-error" role="alert">{error}</p>}</section>
}
