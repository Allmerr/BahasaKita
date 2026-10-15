import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assessmentScore, useStore } from './learning.jsx'


export default function BasicClass() {
 const { state, basicMaterials, contentError, reloadCatalog } = useStore()
 const [selected, setSelected] = useState('')
 const [failedVideo, setFailedVideo] = useState(null)
 const material = basicMaterials.find(m => m.id === selected) || basicMaterials[0]
 if(!material)return <div className="panel" role="status"><p>{contentError || "Memuat kelas dasar…"}</p>{contentError&&<button className="btn" onClick={()=>reloadCatalog().catch(()=>{})}>Coba lagi</button>}</div>
 return <>
  <div className="page-heading"><div><p className="eyebrow">PENGUATAN ASESMEN AWAL</p><h1>Kelas belajar dasar</h1><p>Pelajari kembali dasar kosakata, kalimat, bacaan, dan matematika sesuai ritmemu.</p></div><span className="tag">Nilai asesmen: {assessmentScore(state)}/100</span></div>
  <div className="notice"><p>Nilaimu belum mencapai 80. Fitur belajar lainnya akan terbuka setelah kamu lulus asesmen ulang dengan nilai minimal 80.</p></div>
  <div className="basic-layout">
   <nav className="panel basic-materials" aria-label="Materi kelas dasar"><h2>Video pembelajaran</h2>{basicMaterials.map((m, i) => <button type="button" key={m.id} className={`answer-option ${material.id === m.id ? 'selected' : ''}`} aria-pressed={material.id === m.id} onClick={() => setSelected(m.id)}><span>{i + 1}</span>{m.title}</button>)}</nav>
   <section className="panel basic-player"><span className="tag">MATERI ASESMEN AWAL</span><h2>{material.title}</h2><video key={material.id} controls playsInline preload={state.settings.dataSaver ? 'none' : 'metadata'} aria-label={`Video pembelajaran ${material.title}`} onLoadedMetadata={e => { e.currentTarget.playbackRate = Number(state.settings.speed) }} onError={() => setFailedVideo(material.id)}><source src={material.videoSrc}/>Browsermu belum mendukung video. Baca penjelasan di bawah.</video><p className="muted">Video penjelasan visual dengan teks, tanpa suara. Kamu bisa menjeda dan mengulang kapan saja.</p>{failedVideo === material.id && <p role="alert">Video belum dapat diputar. Materi lengkap tersedia pada teks penjelasan berikut.</p>}<h3>Teks penjelasan video</h3>{material.slides.map(([title, ...lines]) => <div className="reading-box" key={title}><h4>{title}</h4>{lines.map(line => <p key={line}>{line}</p>)}</div>)}</section>
  </div>
  <section className="panel basic-retry"><h2>Sudah siap mencoba lagi?</h2><p>Ulangi asesmen untuk membuka semua fitur belajar. Kamu bisa mencoba lagi tanpa batas.</p><Link className="btn" to="/assessment">Ulangi asesmen awal</Link></section>
 </>
}
