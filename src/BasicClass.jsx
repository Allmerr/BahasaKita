import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assessmentScore, useStore } from './learning.jsx'
import { basicForGrade, basicYoutubeId } from './basicContent.js'
import { youtubeEmbedUrl } from './youtubeMaterials.js'
import Icon from './components/Icon.jsx'

function BasicPlayer({ material, settings, grade }) {
 const [playing, setPlaying] = useState(false)
 const [failed, setFailed] = useState(false)
 const youtubeId = basicYoutubeId(material.videoSrc)
 return <section className="panel basic-player">
  <span className="tag">{grade} · MATERI ASESMEN AWAL</span><h2>{material.title}</h2>
  {material.description && <p>{material.description}</p>}
  {youtubeId ? <>
   {playing ? <div className="youtube-frame"><iframe src={youtubeEmbedUrl(youtubeId, material.start || 0)} title={`Video kelas dasar ${grade}: ${material.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div> : <button type="button" className="btn" onClick={() => setPlaying(true)}><Icon name="play" size={18}/>Putar video pembelajaran</button>}
  </> : <>
   <video controls playsInline preload={settings.dataSaver ? 'none' : 'metadata'} aria-label={`Video pembelajaran ${material.title}`} onLoadedMetadata={e => { e.currentTarget.playbackRate = Number(settings.speed) }} onError={() => setFailed(true)}><source src={material.videoSrc}/>Browsermu belum mendukung video. Baca penjelasan di bawah.</video>
   {failed && <p role="alert">Video belum dapat diputar. Materi lengkap tersedia pada teks penjelasan berikut.</p>}
  </>}
  <h3>Ringkasan dan latihan pendamping</h3>
  <p className="muted">Contoh kalimat, bacaan, dan hitungan berikut dibuat oleh BahasaKita sesuai topik video untuk persiapan asesmen awal.</p>
  {material.slides.map(([title, ...lines]) => <div className="reading-box" key={title}><h4>{title}</h4>{lines.map(line => <p key={line}>{line}</p>)}</div>)}
 </section>
}

export default function BasicClass() {
 const { state, basicMaterials, contentError, reloadCatalog } = useStore()
 const [selected, setSelected] = useState('')
 const grade = state.profile?.grade
 const materials = basicForGrade(basicMaterials, grade)
 const material = materials.find(m => m.id === selected) || materials[0]
 if (!material) return <div className="panel" role="status"><p>{contentError || (basicMaterials.length ? `Materi kelas dasar untuk ${grade || 'jenjangmu'} belum tersedia.` : 'Memuat kelas dasar…')}</p>{contentError && <button className="btn" onClick={() => reloadCatalog().catch(() => {})}>Coba lagi</button>}</div>
 return <>
  <div className="page-heading"><div><p className="eyebrow">PENGUATAN ASESMEN AWAL · {grade}</p><h1>Kelas belajar dasar</h1><p>Belajar melalui video untuk peserta didik Tuli/tunarungu sesuai jenjangmu, lalu pelajari latihan pendampingnya.</p></div><span className="tag">Nilai asesmen: {assessmentScore(state)}/100</span></div>
  <div className="notice"><p>Nilaimu belum mencapai 80. Fitur belajar lainnya akan terbuka setelah kamu lulus asesmen ulang dengan nilai minimal 80.</p></div>
  <div className="basic-layout">
   <nav className="panel basic-materials" aria-label="Materi kelas dasar"><h2>Materi dasar {grade}</h2>{materials.map((m, i) => <button type="button" key={m.id} className={`answer-option ${material.id === m.id ? 'selected' : ''}`} aria-pressed={material.id === m.id} onClick={() => setSelected(m.id)}><span>{i + 1}</span>{m.title}</button>)}</nav>
   <BasicPlayer key={`${grade}:${material.id}:${material.videoSrc}`} material={material} settings={state.settings} grade={grade}/>
  </div>
  <section className="panel basic-retry"><h2>Sudah siap mencoba lagi?</h2><p>Ulangi asesmen untuk membuka semua fitur belajar. Kamu bisa mencoba lagi tanpa batas.</p><Link className="btn" to="/assessment">Ulangi asesmen awal</Link></section>
 </>
}
