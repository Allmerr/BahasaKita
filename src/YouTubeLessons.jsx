import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './components/Icon.jsx'
import { useStore } from './learning.jsx'
import { videosForGrade, youtubeEmbedUrl, youtubeWatchUrl } from './youtubeMaterials.js'

function GradeVideos({ grade }) {
 const videos = videosForGrade(grade)
 const [selected, setSelected] = useState(null)
 const playerRef = useRef(null)
 const [loadError, setLoadError] = useState(false)
 const choose = video => { setSelected(video); setLoadError(false); requestAnimationFrame(() => playerRef.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' })) }
 return <>
  {selected && <section ref={playerRef} className="youtube-player panel" aria-label="Pemutar video pembelajaran">
   <div className="section-heading"><div><span className="tag">{grade} · {selected.topic}</span><h3>{selected.title}</h3></div><button type="button" className="icon-btn" onClick={() => setSelected(null)} aria-label="Tutup video pembelajaran"><Icon name="close"/></button></div>
   <div className="youtube-frame"><iframe key={selected.id} src={youtubeEmbedUrl(selected.id)} title={`Video ${grade}: ${selected.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={() => setLoadError(true)}/></div>
   <p>{selected.description}</p>
   {loadError && <p role="alert">Video belum dapat dimuat. Periksa koneksi internetmu.</p>}
   <p className="muted">Aktifkan CC jika subtitle tersedia.</p>
  </section>}
  <div className="youtube-lessons-grid">{videos.map((video, index) => <article className="panel youtube-lesson" key={video.id}>
   <div className="youtube-lesson-art" aria-hidden="true"><span className="youtube-art-number">0{index + 1}</span><div className="youtube-art-play"><Icon name="play" size={28}/></div><span>{grade} · {video.topic}</span></div>
   <div className="youtube-lesson-copy">
   <h3>{video.title}</h3><p>{video.description}</p>
   <button type="button" className={`btn ${selected?.id === video.id ? 'secondary' : ''}`} aria-label={`Putar video ${video.title}`} aria-pressed={selected?.id === video.id} onClick={() => choose(video)}><Icon name="play" size={18}/>{selected?.id === video.id ? 'Video dipilih' : 'Putar di aplikasi'}</button></div>
  </article>)}</div>
 </>
}

export default function YouTubeLessons() {
 const { state } = useStore()
 const grade = state.profile?.grade || 'SD'
 return <section className="youtube-section" aria-labelledby="youtube-lessons-title">
  <div className="section-heading"><div><h2 id="youtube-lessons-title">Video pembelajaran Tuli/tunarungu</h2><p>{videosForGrade(grade).length ? `Materi ${grade} sesuai jenjang belajar. Amati isyarat dan visualnya, lalu kenali kosakatanya.` : 'Materi dengan dukungan visual atau isyarat dipilih sesuai jenjang belajar pada profilmu.'}</p></div>{videosForGrade(grade).length > 0 && <span className="dictionary-section-mark"><Icon name="play" size={18}/>{videosForGrade(grade).length} video untukmu</span>}</div>
  {!videosForGrade(grade).length ? <div className="notice"><p>Pilih jenjang SD, SMP, atau SMA pada profil untuk melihat video pembelajaran.</p><Link className="btn" to="/settings">Lengkapi profil</Link></div> : <GradeVideos key={grade} grade={grade}/>}
 </section>
}
