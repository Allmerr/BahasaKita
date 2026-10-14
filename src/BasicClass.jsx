import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assessmentScore, useStore } from './learning.jsx'
import { basicMaterials } from './basicMaterials.js'

export default function BasicClass() {
 const { state, update } = useStore()
 const [selected, setSelected] = useState(basicMaterials[0].id)
 const [failedVideo, setFailedVideo] = useState(null)
 const material = basicMaterials.find(m => m.id === selected)
 return <>
  <div className="page-heading"><div><p className="eyebrow">PENGUATAN ASESMEN AWAL</p><h1>Kelas belajar dasar</h1><p>Pelajari kembali dasar kosakata, kalimat, bacaan, dan matematika sesuai ritmemu.</p></div><span className="tag">Nilai asesmen: {assessmentScore(state)}/100</span></div>
  <div className="notice"><p>Nilaimu belum mencapai 80. Fitur belajar lainnya akan terbuka setelah kamu lulus asesmen ulang dengan nilai minimal 80.</p></div>
  <div className="basic-layout">
   <nav className="panel basic-materials" aria-label="Materi kelas dasar"><h2>Video pembelajaran</h2>{basicMaterials.map((m, i) => <button type="button" key={m.id} className={`answer-option ${selected === m.id ? 'selected' : ''}`} aria-pressed={selected === m.id} onClick={() => setSelected(m.id)}><span>{i + 1}</span>{m.title}</button>)}</nav>
   <section className="panel basic-player"><span className="tag">MATERI ASESMEN AWAL · 24 DETIK</span><h2>{material.title}</h2><video key={material.id} controls playsInline preload={state.settings.dataSaver ? 'none' : 'metadata'} aria-label={`Video pembelajaran ${material.title}`} onLoadedMetadata={e => { e.currentTarget.playbackRate = Number(state.settings.speed) }} onError={() => setFailedVideo(material.id)}><source src={`/videos/basic-${material.id}.webm`} type="video/webm"/>Browsermu belum mendukung video. Baca penjelasan di bawah.</video><p className="muted">Video penjelasan visual dengan teks, tanpa suara. Kamu bisa menjeda dan mengulang kapan saja.</p>{failedVideo === material.id && <p role="alert">Video belum dapat diputar. Materi lengkap tersedia pada teks penjelasan berikut.</p>}<h3>Teks penjelasan video</h3>{material.slides.map(([title, ...lines]) => <div className="reading-box" key={title}><h4>{title}</h4>{lines.map(line => <p key={line}>{line}</p>)}</div>)}</section>
  </div>
  <section className="panel basic-retry"><h2>Sudah siap mencoba lagi?</h2><p>Ulangi asesmen untuk membuka semua fitur belajar. Kamu bisa mencoba lagi tanpa batas.</p><Link className="btn" to="/assessment" onClick={() => update({ assessmentDraft: null })}>Ulangi asesmen awal</Link></section>
 </>
}
