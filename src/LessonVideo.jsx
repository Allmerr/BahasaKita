import { useEffect, useState } from 'react'
import Icon from './components/Icon.jsx'
import { useStore } from './learning.jsx'
import { videoTime } from './gradeDictionary.js'
import { youtubeEmbedUrl, youtubeWatchUrl } from './youtubeMaterials.js'

export default function LessonVideo({ entry, paused }) {
 const { state, clips } = useStore()
 const [playing, setPlaying] = useState(false)
 const localSource = clips[`${state.settings.language}:${entry.word}`]
 useEffect(() => { setPlaying(false) }, [entry.word, entry.videoId])
 useEffect(() => { if (paused) setPlaying(false) }, [paused])
 return <section className="lesson-source-video" aria-label="Video kosakata pendukung">
  <div className="inline-tags"><span className="tag"><Icon name="hand" size={15}/>Isyarat & visual</span></div>
  <h3>{entry.video.title}</h3><p className="muted">Kosakata pendukung: {entry.word} · Bagian video mulai sekitar {videoTime(entry.start)}.</p>
  {playing && !paused ? localSource ? <video src={localSource} controls playsInline preload={state.settings.dataSaver ? 'none' : 'metadata'} onLoadedMetadata={event => { event.currentTarget.playbackRate = Number(state.settings.speed) }}/> : <div className="youtube-frame"><iframe src={youtubeEmbedUrl(entry.videoId, entry.start)} title={`Video belajar ${state.profile?.grade}: ${entry.word}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div> : <button className="btn secondary" onClick={() => setPlaying(true)}><Icon name="play" size={18}/>Putar video kosakata</button>}
 </section>
}
