import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './components/Icon.jsx'
import { useStore } from './learning.jsx'
import { dictionaryForGrade, videoTime } from './gradeDictionary.js'
import { youtubeEmbedUrl, youtubeWatchUrl, videosForGrade } from './youtubeMaterials.js'
import { dictionaryRows, mergedDictionary } from './dictionaryStore.js'

export function SourceWordModal({ entry, grade, onClose }) {
 const { state, clips } = useStore()
 const localSource = clips[`${state.settings.language}:${entry.word}`]
 const dialog = useRef(null)
 const [playing, setPlaying] = useState(false)
 useEffect(() => { const element = dialog.current; element.showModal(); return () => element.close() }, [])
 return <dialog ref={dialog} className="word-dialog source-word-dialog" aria-labelledby="source-word-title" onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose() }}>
  <button className="dialog-close icon-btn" onClick={onClose} aria-label="Tutup arti kata"><Icon name="close"/></button>
  <span className="tag">{grade} · {entry.category}</span><div className="dictionary-emoji" aria-hidden="true">{entry.emoji}</div><h2 id="source-word-title">{entry.word}</h2><p>{entry.meaning}</p><div className="reading-box">{entry.example}</div>
  {entry.video || localSource ? <><h3>Lihat kata dalam video</h3><p>{entry.video?.title || "Video pratinjau lokal"}</p><p className="muted">{entry.video?.kind === 'hosted' ? 'Gunakan kontrol video untuk menjeda atau mengulang gerakan isyarat.' : `Mulai sekitar ${videoTime(entry.start || 0)} untuk melihat konteks kata dan gerakan dalam materi. Gunakan kontrol video untuk menjeda atau mengulang.`}</p>
  {playing ? localSource || entry.video?.kind === 'hosted' ? <video aria-label={`Video kata ${entry.word} untuk ${grade}`} src={localSource || entry.video.url} controls playsInline preload={state.settings.dataSaver ? 'none' : 'metadata'} onLoadedMetadata={event => { event.currentTarget.playbackRate = Number(state.settings.speed) }}/> : <div className="youtube-frame"><iframe src={youtubeEmbedUrl(entry.videoId, entry.start)} title={`Video kata ${entry.word} untuk ${grade}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div> : <button className="btn" onClick={() => setPlaying(true)}><Icon name="play" size={18}/>Putar bagian video</button>}{entry.video?.sourceUrl && <p className="muted">Sumber: <a href={entry.video.sourceUrl} target="_blank" rel="noopener noreferrer">Isyaratku / Balai Bahasa Jawa Timur</a></p>}</> : <p className="notice">Video isyarat untuk kata ini belum tersedia. Kamu bisa mempelajari arti dan contoh kalimatnya.</p>}
 </dialog>
}

export default function GradeDictionary({ grade, authorized, onOpenChange }) {
 const [remoteRows,setRemoteRows] = useState([])
 const [loadError,setLoadError] = useState('')
 useEffect(()=>{let active=true;setRemoteRows([]);dictionaryRows(grade).then(rows=>{if(active){setRemoteRows(rows);setLoadError('')}}).catch(error=>{if(active)setLoadError(error.message)});return()=>{active=false}},[grade])
 const entries = mergedDictionary(grade,remoteRows)
 const [search, setSearch] = useState('')
 const [category, setCategory] = useState('Semua')
 const [videoId, setVideoId] = useState('Semua')
 const [open, setOpen] = useState(null)
 const categories = ['Semua', ...new Set(entries.map(entry => entry.category))]
 const filtered = entries.filter(entry => (category === 'Semua' || entry.category === category) && (videoId === 'Semua' || (videoId === 'tanpa-video' ? !entry.video : videoId === 'balai-bahasa-jatim' ? entry.video?.kind === 'hosted' : entry.videoId === videoId)) && `${entry.word} ${entry.meaning}`.toLocaleLowerCase('id').includes(search.toLocaleLowerCase('id')))
 const close = () => { setOpen(null); onOpenChange(false) }
 return <section className="dictionary-word-section" aria-labelledby="grade-dictionary-title">
  {loadError&&<p className="notice" role="alert">{loadError} Kosakata bawaan tetap tersedia.</p>}
  <div className="section-heading"><div><h2 id="grade-dictionary-title">Kamus kata dan contoh kalimat</h2><p>{entries.length ? `Kosakata ${grade} untuk belajar sehari-hari. Pilih kata untuk melihat arti, contoh kalimat, dan video jika tersedia.` : 'Kosakata ditampilkan sesuai video dan jenjang pada profilmu.'}</p></div>{entries.length > 0 && <span className="dictionary-section-mark"><Icon name="book" size={18}/>{entries.length} kata untuk dikenali</span>}</div>
  {!entries.length ? <div className="notice"><p>{authorized ? 'Lengkapi jenjang pada profil untuk melihat kosakata dari video pembelajaran.' : 'Masuk untuk melihat arti kata sesuai video jenjang belajarmu.'}</p><Link className="btn" to={authorized ? '/settings' : '/signin'}>{authorized ? 'Lengkapi profil' : 'Masuk'}</Link></div> : <>
   <div className="dictionary-toolbar"><div className="dictionary-search"><Icon name="search"/><input value={search} onChange={event => setSearch(event.target.value)} placeholder={`Cari kata, misalnya: ${entries[0].word.toLowerCase()}`} aria-label="Cari kata"/>{search && <button className="icon-btn" aria-label="Hapus pencarian" onClick={() => setSearch('')}><Icon name="close" size={18}/></button>}</div>
   <label className="field dictionary-source-filter">Video sumber<select value={videoId} onChange={event => setVideoId(event.target.value)}><option value="Semua">Semua kata {grade}</option><option value="tanpa-video">Belum ada video</option>{entries.some(entry => entry.video?.kind === 'hosted') && <option value="balai-bahasa-jatim">Balai Bahasa Jawa Timur</option>}{videosForGrade(grade).map(video => <option key={video.id} value={video.id}>{video.title}</option>)}</select></label></div>
   <div className="filter-tabs">{categories.map(value => <button key={value} aria-pressed={value === category} className={value === category ? 'active' : ''} onClick={() => setCategory(value)}>{value}</button>)}</div>
   <div className="dictionary-results-line"><p className="muted" role="status">Menampilkan <strong>{filtered.length}</strong> dari {entries.length} kata</p><span><Icon name="play" size={14}/>{entries.filter(entry => entry.video).length} kata dilengkapi video</span></div>
   <div className="dictionary-grid">{filtered.map((entry, index) => <button key={entry.word} className="panel dictionary-card" aria-label={`Lihat arti${entry.video ? " dan video" : ""} kata ${entry.word}`} onClick={() => { setOpen(entry); onOpenChange(true) }}>
    <div className={`dictionary-image ${['purple', 'blue', 'pink', 'yellow'][index % 4]}`} aria-hidden="true"><span className="dictionary-card-emoji">{entry.emoji}</span>{entry.video && <span className="dictionary-card-play"><Icon name="play" size={16}/></span>}</div><div className="dictionary-card-copy"><span className="tag neutral">{entry.category}</span><h2>{entry.word}</h2><p>{entry.meaning}</p>{entry.video ? <small className="dictionary-source"><Icon name="play" size={13}/><span>{entry.video.title}</span>{entry.video.kind !== 'hosted' && <b>{videoTime(entry.start)}</b>}</small> : <small className="dictionary-source">Arti & contoh · Video belum tersedia</small>}<span className="text-link">Kenali kata ini<Icon name="arrow" size={16}/></span></div>
   </button>)}</div>
   {!filtered.length && <div className="empty-card"><h3>Kata belum ditemukan</h3><p>Coba kata lain atau tampilkan semua kategori dan video.</p><button className="btn secondary" onClick={() => { setSearch(''); setCategory('Semua'); setVideoId('Semua') }}>Lihat semua kata</button></div>}
  </>}
  {open && <SourceWordModal entry={open} grade={grade} onClose={close}/>}
 </section>
}
