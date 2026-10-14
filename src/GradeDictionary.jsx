import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './components/Icon.jsx'
import { useStore } from './learning.jsx'
import { dictionaryForGrade, videoTime } from './gradeDictionary.js'
import { youtubeEmbedUrl, youtubeWatchUrl, videosForGrade } from './youtubeMaterials.js'

export function SourceWordModal({ entry, grade, onClose }) {
 const { state, clips } = useStore()
 const localSource = clips[`${state.settings.language}:${entry.word}`]
 const dialog = useRef(null)
 const [playing, setPlaying] = useState(false)
 useEffect(() => { const element = dialog.current; element.showModal(); return () => element.close() }, [])
 return <dialog ref={dialog} className="word-dialog source-word-dialog" aria-labelledby="source-word-title" onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose() }}>
  <button className="dialog-close icon-btn" onClick={onClose} aria-label="Tutup arti kata"><Icon name="close"/></button>
  <span className="tag">{grade} · {entry.category}</span><div className="dictionary-emoji" aria-hidden="true">{entry.emoji}</div><h2 id="source-word-title">{entry.word}</h2><p>{entry.meaning}</p><div className="reading-box">{entry.example}</div>
  <h3>Lihat kata dalam video</h3><p>{entry.video.title}</p><p className="muted">Mulai sekitar {videoTime(entry.start)} untuk melihat konteks kata dan gerakan dalam materi. Gunakan kontrol video untuk menjeda atau mengulang.</p>
  {playing ? localSource ? <video src={localSource} controls playsInline preload={state.settings.dataSaver ? 'none' : 'metadata'} onLoadedMetadata={event => { event.currentTarget.playbackRate = Number(state.settings.speed) }}/> : <div className="youtube-frame"><iframe src={youtubeEmbedUrl(entry.videoId, entry.start)} title={`Video kata ${entry.word} untuk ${grade}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div> : <button className="btn" onClick={() => setPlaying(true)}><Icon name="play" size={18}/>Putar bagian video</button>}
 </dialog>
}

export default function GradeDictionary({ grade, authorized, onOpenChange }) {
 const entries = dictionaryForGrade(grade)
 const [search, setSearch] = useState('')
 const [category, setCategory] = useState('Semua')
 const [videoId, setVideoId] = useState('Semua')
 const [open, setOpen] = useState(null)
 const categories = ['Semua', ...new Set(entries.map(entry => entry.category))]
 const filtered = entries.filter(entry => (category === 'Semua' || entry.category === category) && (videoId === 'Semua' || entry.videoId === videoId) && `${entry.word} ${entry.meaning}`.toLocaleLowerCase('id').includes(search.toLocaleLowerCase('id')))
 const close = () => { setOpen(null); onOpenChange(false) }
 return <section className="dictionary-word-section" aria-labelledby="grade-dictionary-title">
  <div className="section-heading"><div><h2 id="grade-dictionary-title">Arti kata dari video pembelajaran</h2><p>{entries.length ? `Kosakata ${grade} dari materi videomu. Pilih kata untuk melihat arti dan gerakannya.` : 'Kosakata ditampilkan sesuai video dan jenjang pada profilmu.'}</p></div>{entries.length > 0 && <span className="dictionary-section-mark"><Icon name="book" size={18}/>{entries.length} kata untuk dikenali</span>}</div>
  {!entries.length ? <div className="notice"><p>{authorized ? 'Lengkapi jenjang pada profil untuk melihat kosakata dari video pembelajaran.' : 'Masuk untuk melihat arti kata sesuai video jenjang belajarmu.'}</p><Link className="btn" to={authorized ? '/settings' : '/signin'}>{authorized ? 'Lengkapi profil' : 'Masuk'}</Link></div> : <>
   <div className="dictionary-toolbar"><div className="dictionary-search"><Icon name="search"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Cari kata, misalnya: ${entries[0].word.toLowerCase()}`} aria-label="Cari kata"/>{search && <button className="icon-btn" aria-label="Hapus pencarian" onClick={() => setSearch('')}><Icon name="close" size={18}/></button>}</div>
   <label className="field dictionary-source-filter">Video sumber<select value={videoId} onChange={event => setVideoId(event.target.value)}><option value="Semua">Semua video {grade}</option>{videosForGrade(grade).map(video => <option key={video.id} value={video.id}>{video.title}</option>)}</select></label></div>
   <div className="filter-tabs">{categories.map(value => <button key={value} aria-pressed={value === category} className={value === category ? 'active' : ''} onClick={() => setCategory(value)}>{value}</button>)}</div>
   <div className="dictionary-results-line"><p className="muted" role="status">Menampilkan <strong>{filtered.length}</strong> dari {entries.length} kata</p><span><Icon name="play" size={14}/>Terhubung ke video pembelajaran</span></div>
   <div className="dictionary-grid">{filtered.map((entry, index) => <button key={entry.word} className="panel dictionary-card" aria-label={`Lihat arti dan video kata ${entry.word}`} onClick={() => { setOpen(entry); onOpenChange(true) }}>
    <div className={`dictionary-image ${['purple', 'blue', 'pink', 'yellow'][index % 4]}`} aria-hidden="true"><span className="dictionary-card-emoji">{entry.emoji}</span><span className="dictionary-card-play"><Icon name="play" size={16}/></span></div><div className="dictionary-card-copy"><span className="tag neutral">{entry.category}</span><h2>{entry.word}</h2><p>{entry.meaning}</p><small className="dictionary-source"><Icon name="play" size={13}/><span>{entry.video.title}</span><b>{videoTime(entry.start)}</b></small><span className="text-link">Kenali kata ini<Icon name="arrow" size={16}/></span></div>
   </button>)}</div>
   {!filtered.length && <div className="empty-card"><h3>Kata belum ditemukan</h3><p>Coba kata lain atau tampilkan semua kategori dan video.</p><button className="btn secondary" onClick={() => { setSearch(''); setCategory('Semua'); setVideoId('Semua') }}>Lihat semua kata</button></div>}
  </>}
  {open && <SourceWordModal entry={open} grade={grade} onClose={close}/>}
 </section>
}
