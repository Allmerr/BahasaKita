import { useAccount } from './Account.jsx'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import Icon from './components/Icon.jsx'
import { ProfileAvatar, ProfileEditor, ProfilePhotoEditor } from './AccountProfile.jsx'
import YouTubeLessons from './YouTubeLessons.jsx'
import GradeDictionary, { SourceWordModal } from './GradeDictionary.jsx'
import LessonVideo from './LessonVideo.jsx'
import { useAccess, needsLogin } from './access.jsx'
import WorkspaceMode from './WorkspaceMode.jsx'

import { aspects, useStore, canOpen, level, learningDestination } from './learning.jsx'
import { youtubeMaterials, youtubeEmbedUrl, youtubeWatchUrl } from './youtubeMaterials.js'
const Button = ({ children, to, secondary = false, className = '', ...props }) => to ? <Link to={to} className={`btn ${secondary ? 'secondary' : ''} ${className}`} {...props}>{children}</Link> : <button className={`btn ${secondary ? 'secondary' : ''} ${className}`} {...props}>{children}</button>
const Tag = ({ children, tone = 'purple' }) => <span className={`tag ${tone}`}>{children}</span>
const nav = [['/', 'home', 'Beranda'], ['/learning', 'graduation', 'Belajar'], ['/dictionary', 'dictionary', 'Kamus visual'], ['/progress', 'chart', 'Kemajuan saya']]
export function Shell() {
 const { state, setting, accountError, accountReady, isAdmin, isSupporter, role, supportReady, studentPreview, learningError, reloadLearning } = useStore(); const { pathname } = useLocation()
 const { authorized } = useAccess(); const navigate = useNavigate()
 const destination = learningDestination(state)
 const adminMode=isAdmin&&!studentPreview
 const baseMenu = adminMode ? [['/admin','settings','Kelola konten'],...(supportReady?[['/admin/accounts','profile','Akun pendamping']]:[]),['/settings','settings','Pengaturan']] : isSupporter ? [['/support','chart',role==='teacher'?'Dashboard guru':'Dashboard orang tua'],['/settings','settings','Pengaturan']] : [...nav,...(authorized&&supportReady&&!studentPreview?[['/support','profile','Pendamping']]:[])]
 const menu = authorized && !adminMode && !isSupporter && destination === '/basic-class' ? [...baseMenu, ['/basic-class', 'spark', 'Kelas Dasar']] : baseMenu
 const guardAction = event => {
  const control = event.target.closest?.('a,button,input,select,textarea,form,[role="button"]')
  if (!control || control.hasAttribute('data-appearance-control')) return
  const publicNavigation = control.hasAttribute('data-public-navigation')
  const loginRequired = needsLogin(authorized, publicNavigation) && pathname !== '/dictionary' && pathname !== '/settings'
  const assessmentRequired = authorized && !adminMode && !isSupporter && destination === '/assessment' && pathname !== '/assessment' && pathname !== '/settings' && pathname !== '/admin' && pathname !== '/support' && !publicNavigation && !control.hasAttribute('data-assessment-navigation')
  if (!loginRequired && !assessmentRequired) return
  event.preventDefault(); event.stopPropagation()
  navigate(loginRequired ? '/signin' : '/assessment', { state: loginRequired ? { loginRequired: true } : { assessmentRequired: true } })
 }
 const guardFocus = event => { if (event.target.matches?.('input,select,textarea')) guardAction(event) }
 useEffect(() => { window.scrollTo(0, 0) }, [pathname])
 return <div className="app-shell" onClickCapture={guardAction} onFocusCapture={guardFocus} onSubmitCapture={guardAction}><a data-public-navigation className="skip-link" href="#main">Langsung ke isi</a><aside id="primary-sidebar" className="sidebar" aria-label="Menu utama"><Link data-public-navigation className="brand" to={adminMode?'/admin':isSupporter?'/support':'/'} aria-label="BahasaKita, beranda"><img src="/images/logo-bahasa-kita.png" alt="BahasaKita"/></Link><span className="side-label">{adminMode?"RUANG ADMIN":isSupporter?"RUANG PENDAMPING":"RUANG BELAJARMU"}</span><nav aria-label="Navigasi utama">{menu.map(([url, icon, label]) => <NavLink data-public-navigation={authorized || url !== "/progress" ? true : undefined} key={url} to={url} end={url === '/'}><Icon name={icon}/>{label}</NavLink>)}</nav><div className="sidebar-bottom"><NavLink data-assessment-navigation to="/profile" className="sidebar-profile"><span className="profile-card-avatar">{<ProfileAvatar profile={authorized ? state.profile : null} size={23}/>}</span><span className="sidebar-profile-copy"><strong>{authorized ? state.profile?.name || 'Profil saya' : 'Profil saya'}</strong><small>{authorized ? adminMode?'Admin':isSupporter?(role==='teacher'?'Guru':'Orang tua'):state.profile?.grade || 'SD' : 'Lihat profilmu'}</small></span><Icon name="chevron" size={17}/></NavLink><div className="side-footer">BahasaKita · Ruang untuk bertumbuh</div></div></aside>
 <div className="app-body"><header className="topbar"><Link data-public-navigation className="mobile-brand" to={adminMode?'/admin':isSupporter?'/support':'/'} aria-label="BahasaKita, beranda"><img src="/images/logo-bahasa-kita.png" alt="BahasaKita"/></Link><div className="breadcrumb">{adminMode?"Ruang admin":isSupporter?"Ruang pendamping":studentPreview?"Pratinjau siswa":"Ruang belajarmu"} <Icon name="chevron" size={15}/><strong>{[...nav, ['/profile', '', 'Profil saya'], ['/settings', '', 'Pengaturan'], ['/assessment', '', 'Asesmen awal'], ['/basic-class', '', 'Kelas belajar dasar'], ['/signup', '', 'Profil awal'], ['/admin', '', 'Kelola konten'], ['/support','','Pendampingan'], ['/admin/accounts','','Akun pendamping']].find(n => n[0] === pathname)?.[2] || 'Sesi belajar'}</strong></div><div className="topbar-right"><button type="button" className="topbar-theme-toggle" data-appearance-control aria-label={state.settings.theme === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'} aria-pressed={state.settings.theme === 'dark'} title={state.settings.theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'} onClick={() => setting('theme', state.settings.theme === 'dark' ? 'light' : 'dark')}><Icon name={state.settings.theme === 'dark' ? 'moon' : 'sun'} size={24}/></button><Link data-assessment-navigation to="/profile" className="avatar" aria-label="Profil pengguna">{<ProfileAvatar profile={authorized ? state.profile : null}/>}</Link></div></header><main id="main" className="main-content" tabIndex={-1}><WorkspaceMode/>{authorized && !adminMode && !isSupporter && accountReady && destination === '/assessment' && pathname !== '/assessment' && pathname !== '/admin' && pathname !== '/support' && state.learningReady && <div className="notice assessment-access-notice" role="status"><Icon name="lock" size={21}/><p>Kamu bisa menjelajahi halaman. Selesaikan asesmen awal sebelum menggunakan fitur belajar.</p><Link className="btn" to="/assessment">{state.assessmentDraft?.length ? 'Lanjutkan asesmen' : 'Mulai asesmen awal'}</Link></div>}{authorized && !accountReady && pathname !== "/settings" && pathname !== "/dictionary" ? <div className="panel" role="status">{accountError || "Memuat profil akun…"}{accountError && <button data-assessment-navigation className="btn" onClick={() => window.location.reload()}>Coba lagi</button>}</div> : <>{authorized && !adminMode && !isSupporter && learningError && pathname !== "/assessment" && <div className="notice" role="alert"><p>{learningError}</p><button data-assessment-navigation className="btn secondary" onClick={() => reloadLearning().catch(()=>{})}>Coba sinkronisasi lagi</button></div>}<Outlet/></>}</main><footer className="app-footer"><span>© 2026 BahasaKita</span><Link data-public-navigation to="/settings">Privasi & pengaturan</Link></footer></div><nav className="bottom-nav" style={{ '--nav-columns': menu.length }} aria-label="Navigasi bawah">{menu.map(([url, icon, label]) => <NavLink data-public-navigation={authorized || url !== "/progress" ? true : undefined} key={url} to={url} end={url === '/'}><Icon name={icon} size={22}/><span>{label}</span></NavLink>)}</nav></div>
}
function PageHeading({ eyebrow, title, text, action }) { return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p>{text}</p></div>{action}</div> }
function BookArt() { return <div className="book-art" aria-hidden="true"><div className="art-scene"><span className="art-star one">✦</span><span className="art-dot"/><div className="art-orbit"/><div className="art-card card-back"/><div className="art-card card-front"><Icon name="hand" size={54}/><span>ISYARAT</span></div><div className="art-book"><div className="book-page left"><i/><i/><i/></div><div className="book-page right"><span>✦</span><i/><i/></div></div></div><div className="art-small"><Icon name="check" size={18}/><span>Langkah kecil, kemajuan besar</span></div></div> }
const allLearningVideos = [
  ...youtubeMaterials.SD.map(v => ({ ...v, grade: 'SD' })),
  ...youtubeMaterials.SMP.map(v => ({ ...v, grade: 'SMP' })),
  ...youtubeMaterials.SMA.map(v => ({ ...v, grade: 'SMA' })),
]

function HomeVideoModal({ video, onClose }) {
  const dialog = useRef(null)
  useEffect(() => {
    const el = dialog.current
    if (el) {
      try { el.showModal() } catch {}
    }
    return () => {
      try { el?.close() } catch {}
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      className="word-dialog source-word-dialog home-video-dialog"
      aria-labelledby="home-video-modal-title"
      onCancel={onClose}
      onClick={e => { if (e.target === dialog.current) onClose() }}
    >
      <button
        type="button"
        className="dialog-close icon-btn"
        onClick={onClose}
        aria-label="Tutup video pembelajaran"
      >
        <Icon name="close"/>
      </button>
      <div className="inline-tags" style={{ marginBottom: 12 }}>
        <span className="tag">{video.grade} · {video.topic}</span>
      </div>
      <h2 id="home-video-modal-title" style={{ textAlign: 'left', fontSize: '1.4rem', margin: '0 0 8px 0' }}>
        {video.title}
      </h2>
      <p style={{ textAlign: 'left', fontSize: '0.84rem', margin: '0 0 16px 0', color: 'var(--muted)' }}>
        {video.description}
      </p>
      <div className="youtube-frame">
        <iframe
          src={youtubeEmbedUrl(video.id)}
          title={`Video ${video.grade}: ${video.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </dialog>
  )
}

export function PhotoStoriesCarousel({ assessed, next, state }) {
  const trackRef = useRef(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const currentGrade = state.profile?.grade || 'SD'
  const dragInfo = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false })

  const gradeVideos = (youtubeMaterials[currentGrade] || youtubeMaterials.SD || []).map(v => ({
    ...v,
    grade: currentGrade,
  }))

  const loopVideos = [0, 1, 2].flatMap(setIdx =>
    gradeVideos.map((v, i) => ({
      ...v,
      uniqueKey: `${currentGrade}-${v.id}-set${setIdx}-i${i}`,
    }))
  )

  const getCardStep = () => {
    const el = trackRef.current
    if (!el) return 326
    const card = el.querySelector('.photo-story-card')
    return card ? card.offsetWidth + 16 : 326
  }

  const getSetWidth = () => {
    const el = trackRef.current
    if (!el) return gradeVideos.length * 326
    const cards = el.querySelectorAll('.photo-story-card')
    if (cards.length > gradeVideos.length && cards[gradeVideos.length] && cards[0]) {
      return cards[gradeVideos.length].offsetLeft - cards[0].offsetLeft
    }
    return gradeVideos.length * getCardStep()
  }

  useEffect(() => {
    const el = trackRef.current
    if (el) {
      el.scrollTo({ left: 0, behavior: 'smooth' })
    }
  }, [currentGrade])

  const checkLoopWrap = () => {
    const el = trackRef.current
    if (!el) return
    const setWidth = getSetWidth()
    if (setWidth <= 0) return
    if (el.scrollLeft >= setWidth * 2) {
      el.scrollLeft -= setWidth
    }
  }

  const scrollByStep = dir => {
    const el = trackRef.current
    if (!el) return
    const step = getCardStep()
    const setWidth = getSetWidth()

    if (dir < 0 && el.scrollLeft < step) {
      el.scrollLeft += setWidth
    }

    el.scrollBy({ left: dir * step, behavior: 'smooth' })

    setTimeout(() => {
      checkLoopWrap()
    }, 380)
  }

  useEffect(() => {
    if (state.settings?.comfortable) return
    if (isPaused || isDragging || selectedVideo) return

    const timer = setInterval(() => {
      const el = trackRef.current
      if (!el) return
      const step = getCardStep()
      const setWidth = getSetWidth()

      if (setWidth > 0 && el.scrollLeft >= setWidth * 2 - step) {
        el.scrollLeft -= setWidth
      }

      el.scrollBy({ left: step, behavior: 'smooth' })
    }, 3800)

    return () => clearInterval(timer)
  }, [isPaused, isDragging, selectedVideo, currentGrade, state.settings?.comfortable, gradeVideos.length])

  const handleMouseDown = e => {
    const el = trackRef.current
    if (!el) return
    dragInfo.current = {
      isDown: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
      moved: false,
    }
    setIsDragging(true)
    setIsPaused(true)

    const onMouseMove = ev => {
      if (!dragInfo.current.isDown || !trackRef.current) return
      const delta = ev.pageX - dragInfo.current.startX
      if (Math.abs(delta) > 5) {
        dragInfo.current.moved = true
      }
      trackRef.current.scrollLeft = dragInfo.current.scrollLeft - delta
    }

    const onMouseUp = () => {
      dragInfo.current.isDown = false
      setIsDragging(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      setTimeout(() => setIsPaused(false), 2400)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  return (
    <section className="photo-stories-section video-learning-carousel" aria-label="Video pembelajaran YouTube">
      <div className="photo-stories-header">
        <div>
          <h2>Caramu belajar, <span>cerita hebatmu.</span></h2>
          <p>Video pembelajaran pilihan dari YouTube untuk teman belajar Tuli/tunarungu dengan isyarat dan visual sesuai jenjang belajarmu.</p>
        </div>
        <Button to={learningDestination(state) === '/basic-class' ? '/basic-class' : assessed ? (next ? `/lesson/${next.id}` : '/progress') : (state.profile ? '/assessment' : '/signup')}>
          {learningDestination(state) === '/basic-class' ? 'Lanjutkan kelas dasar' : assessed ? (next ? 'Lanjutkan belajar' : 'Lihat kemajuan') : 'Mulai perjalananmu'}
          <Icon name="arrow" size={18}/>
        </Button>
      </div>

      <div
        className="photo-carousel-wrapper"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { if (!dragInfo.current.isDown) setIsPaused(false) }}
      >
        <button
          type="button"
          data-public-navigation
          className="carousel-nav-btn prev"
          onClick={() => scrollByStep(-1)}
          aria-label="Geser ke kiri"
        >
          <Icon name="chevron" size={20} style={{ transform: 'rotate(180deg)' }}/>
        </button>
        <div
          ref={trackRef}
          className={`photo-carousel-track zenius-carousel-track ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setTimeout(() => setIsPaused(false), 2400)}
        >
          {loopVideos.map(video => (
            <article
              className="photo-story-card video-story-card"
              key={video.uniqueKey}
              onClick={() => {
                if (!dragInfo.current.moved) setSelectedVideo(video)
              }}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedVideo(video) } }}
              aria-label={`Tonton video ${video.grade}: ${video.title}`}
            >
              <img
                src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                alt={video.title}
                draggable={false}
                loading="lazy"
              />
              <div className="video-card-top-tags">
                <span className="video-pill-grade">{video.grade}</span>
                <span className="video-pill-topic">{video.topic}</span>
              </div>
              <div className="video-card-center-play" aria-hidden="true">
                <span className="video-play-icon-box">
                  <Icon name="play" size={20} />
                </span>
              </div>
              <div className="photo-card-overlay">
                <div className="video-card-overlay-content">
                  <div className="photo-camera-badge video-camera-badge">
                    <Icon name="play" size={13}/>
                    <span>{video.title}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <button
          type="button"
          data-public-navigation
          className="carousel-nav-btn next"
          onClick={() => scrollByStep(1)}
          aria-label="Geser ke kanan"
        >
          <Icon name="chevron" size={20}/>
        </button>
      </div>

      {selectedVideo && <HomeVideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </section>
  )
}
export function Dashboard() {
 const { state, next, lessons, masteredLessons } = useStore(); const assessed = !!state.assessment; const total = masteredLessons.length
 return <><PageHeading title={`Halo, ${state.profile?.name || 'teman belajar'}!`} text="Siap menemukan hal baru hari ini? Kita mulai dari langkah kecil."/><PhotoStoriesCarousel assessed={assessed} next={next} state={state}/>
 <div className="stats-grid"><Stat icon="path" color="purple" value={assessed ? `${total} dari ${lessons.length}` : '4 tahap'} label={assessed ? 'Materi dikuasai' : 'Dalam setiap sesi belajar'}/><Stat icon="shapes" color="blue" value="4 aspek" label="Jalur sesuai kemampuanmu"/><Stat icon="clock" color="pink" value="8–10 menit" label="Belajar sedikit, setiap hari"/></div>
 <div className="dashboard-columns"><div><section className="section-block"><div className="section-heading"><div><h2>{assessed ? 'Langkah berikutnya' : 'Mulai dari mengenal dirimu'}</h2><p>{assessed ? 'Satu materi, satu langkah lebih dekat.' : 'Tidak perlu langsung bisa. Kita cari titik mulainya.'}</p></div><Link to="/learning" className="text-link">Lihat jalur <Icon name="arrow" size={16}/></Link></div>{assessed ? (next ? <div className="next-lesson"><div className={`lesson-picture ${aspects.find(a => a.id === next.aspect).color}`}>{next.emoji}</div><div><h3>{next.title}</h3><p>{next.description}</p><span className="lesson-meta"><Icon name="clock" size={15}/>{next.time} menit · 4 tahap</span></div><Button to={`/lesson/${next.id}`} aria-label={`Pelajari ${next.title}`}><Icon name="arrow"/></Button></div> : <div className="empty-card"><Icon name="trophy" size={38}/><h3>Semua materi contoh sudah dikuasai!</h3><Button to="/progress">Lihat hasil</Button></div>) : <div className="assessment-card"><div className="assessment-icon"><Icon name="shapes" size={32}/></div><div><h3>Kenali kemampuan awalmu</h3><p>8 soal singkat. Tidak ada nilai buruk.<br/>Hasilnya membantu memilih materi untukmu.</p><div className="inline-tags"><span><Icon name="clock" size={14}/>Sekitar 5 menit</span></div></div><Button to={state.profile ? '/assessment' : '/signup'}>{state.assessmentDraft ? 'Lanjutkan' : 'Mulai'}<Icon name="arrow" size={17}/></Button></div>}</section>
 <section className="section-block"><div className="section-heading"><div><h2>Empat ruang untuk bertumbuh</h2><p>Dasar yang kuat untuk belajar hal baru.</p></div></div><div className="aspect-grid">{aspects.map(a => <Link to={assessed ? '/learning' : '/assessment'} className="aspect-card" key={a.id}><div className={`icon-tile ${a.color}`}><Icon name={a.icon}/></div><h3>{a.name}</h3><p>{a.description}</p><span className="aspect-bottom">{assessed ? level(state.assessment[a.id]) : 'Kenali kemampuanmu'}<Icon name="arrow" size={15}/></span></Link>)}</div></section></div><aside className="dashboard-aside"><section className="panel progress-panel"><div className="section-heading"><h2>Perjalananmu</h2></div><div className="progress-ring" style={{ '--progress': `${total / Math.max(lessons.length, 1) * 100}%` }}><div><strong>{Math.round(total / Math.max(lessons.length, 1) * 100)}<small>%</small></strong><span>Selesai</span></div></div><h3>{assessed ? 'Terus bertumbuh' : 'Awal cerita yang baru'}</h3><p>{assessed ? 'Kemajuan datang dari setiap usaha. Nikmati prosesnya.' : 'Selesaikan asesmen untuk membuka jalur belajarmu.'}</p><Link to="/progress" className="text-link">Lihat kemajuan saya <Icon name="arrow" size={15}/></Link></section><section className="dictionary-teaser"><div className="icon-tile purple"><Icon name="book"/></div><Tag tone="white">TEMAN BELAJARMU</Tag><h3>Satu kata baru,<br/>satu dunia terbuka.</h3><p>Cari arti kata dan contoh kalimat di Kamus Visual.</p><Button to="/dictionary" secondary>Buka kamus<Icon name="arrow" size={16}/></Button></section></aside></div></>
}
function Stat({ icon, color, value, label }) { return <div className="stat-card"><div className={`icon-tile ${color}`}><Icon name={icon}/></div><div><strong>{value}</strong><p>{label}</p></div></div> }
export function ProfileGrid({ scores }) { return <div className="profile-grid">{aspects.map(a => <div className="panel profile-card" key={a.id}><div className={`icon-tile ${a.color}`}><Icon name={a.icon}/></div><h3>{a.name}</h3><strong>{scores?.[a.id] ?? 0}<small>%</small></strong><progress value={scores?.[a.id] ?? 0} max={100} aria-label={`Kemampuan ${a.name}`}/><Tag tone={a.color}>{scores ? level(scores[a.id]) : 'Belum dinilai'}</Tag></div>)}</div> }
export function LearningPath() {
 const { state, path, next, lessons, masteredLessons, contentError, reloadCatalog } = useStore()
 return <><PageHeading title="Jalur yang dibuat untukmu." text={state.profile?.grade ? `Materi ${state.profile.grade} memakai kosakata dan video yang sama dengan Kamus Visual. Semua materi terbuka setelah lulus asesmen.` : 'Pilih jenjang saat register untuk melihat materi yang sesuai dengan Kamus Visual.'} action={<Tag tone="neutral">{masteredLessons.length}/{lessons.length} materi selesai</Tag>}/>{!state.assessment && <div className="notice"><Icon name="info"/><p>Selesaikan asesmen awal untuk menyusun dan membuka jalurmu.</p><Button to="/assessment">Mulai asesmen</Button></div>}<div className="learning-layout"><div className="path-list">{!lessons.length && <div className="panel empty-card"><Icon name="book" size={40}/><h2>{contentError ? "Materi belum dapat dimuat" : "Memuat materi belajarmu…"}</h2><p>{contentError || "Materi SD, SMP, dan SMA mengikuti jenjang profilmu."}</p>{contentError && <Button onClick={()=>reloadCatalog().catch(()=>{})}>Coba lagi</Button>}</div>}{path.map((l, i) => { const complete = state.mastered.includes(l.id); const available = canOpen(l.id, state, path); const aspect = aspects.find(a => a.id === l.aspect); return <div className={`path-row ${available ? '' : 'locked'}`} key={l.id}><div className={`path-number ${complete ? 'complete' : available ? 'current' : ''}`}>{complete ? <Icon name="check"/> : available ? i + 1 : <Icon name="lock" size={19}/>}</div><article className="panel path-card"><div className={`lesson-picture ${aspect.color}`}>{l.emoji}</div><div className="path-card-content"><div className="inline-tags"><Tag tone={aspect.color}>{aspect.name}</Tag><Tag tone="neutral">{l.grade}</Tag>{next?.id === l.id && <span className="current-tag">Kamu di sini</span>}</div><h2>{l.title}</h2><p>{l.description}</p><span className="lesson-meta"><Icon name="clock" size={15}/>{l.time} menit · 4 tahap · {l.level}</span><p className="lesson-word-summary">Kosakata: {(l.words||[]).join(', ')}</p>{!available && <p className="lock-reason"><Icon name="lock" size={13}/>{!state.assessment ? 'Selesaikan asesmen awal terlebih dahulu.' : `Kuasai dulu: ${path[i - 1]?.title}. Setelah itu, materi ini direkomendasikan.`}</p>}</div>{available ? <Button to={`/lesson/${l.id}`} secondary={complete}>{complete ? 'Ulangi' : 'Mulai'}<Icon name="arrow" size={16}/></Button> : <span className="locked-label">Terkunci</span>}</article></div> })}</div><aside><div className="panel path-guide"><h3>Jalurmu bisa bertumbuh.</h3><p>Mulai dari aspek yang perlu penguatan. Pilih materi apa pun dan selesaikan evaluasi sesuai ritmemu.</p><hr/><h4>Belum paham? Tidak apa-apa.</h4><p>Ada contoh lain dan latihan penguatan. Setelah dua percobaan, kamu bisa kembali ke dasar.</p><Link className="text-link" to="/dictionary">Cari kata di kamus<Icon name="arrow" size={15}/></Link></div></aside></div></>
}
export function Dictionary() {
 const { state } = useStore(); const { authorized } = useAccess(); const [wordOpen, setWordOpen] = useState(false)
 const grade = state.profile?.grade || 'SD'
 return <div className="dictionary-page"><PageHeading title="Kamus visual" text="Kosakata dan video pembelajaran sesuai jenjangmu."/><GradeDictionary key={`${authorized}:${grade}`} grade={grade} authorized={authorized} onOpenChange={setWordOpen}/><YouTubeLessons key={wordOpen ? 'word-video' : 'lesson-video'}/></div>
}
export function Progress() {
 const { state, lessonAttempts, masteredLessons } = useStore(); const assessed = state.attempts.filter(a => a.type === 'assessment' && a.grade === state.profile?.grade).at(-1)
 return <><PageHeading title="Kemajuan saya" text="Ini perjalananmu sendiri. Setiap percobaan punya arti."/><div className="stats-grid"><Stat icon="trophy" color="purple" value={`${masteredLessons.length} materi`} label="Sudah kamu kuasai"/><Stat icon="refresh" color="blue" value={`${lessonAttempts.length} sesi`} label="Usaha belajar yang tercatat"/><Stat icon="clock" color="pink" value={`${Math.round(lessonAttempts.reduce((n, a) => n + a.answers.reduce((s, b) => s + b.seconds, 0), 0) / 60)} menit`} label="Waktu mengerjakan evaluasi"/></div>{state.legacy && <div className="notice"><p>Progres dari versi lama telah diarsipkan. Nilai lama dihitung di perangkat dan belum dapat diverifikasi. Selesaikan asesmen online untuk memulai catatan belajar baru.</p></div>}<div className="section-heading"><div><h2>Profil kemampuanmu</h2><p>{state.assessment ? 'Diperbarui setelah setiap evaluasi.' : 'Selesaikan asesmen untuk melihat profil awal.'}</p></div></div><ProfileGrid scores={state.assessment}/>{assessed && <div className="panel growth-panel"><h2>Perubahan dari titik awal</h2>{aspects.map(a => <div className="growth-row" key={a.id}><span>{a.name}</span><span>{assessed.scores[a.id]}% <Icon name="arrow" size={15}/> <strong>{state.assessment[a.id]}%</strong></span><Tag tone={a.color}>{state.assessment[a.id] > assessed.scores[a.id] ? 'Bertumbuh' : state.assessment[a.id] === assessed.scores[a.id] ? 'Tetap belajar' : 'Perlu penguatan'}</Tag></div>)}</div>}<section className="panel history-panel"><h2>Jejak belajarmu</h2>{!state.attempts.length ? <div className="empty-card"><h3>Cerita belajarmu dimulai di sini.</h3><p>Mulai asesmen, lalu catat langkah pertamamu.</p><Button to="/assessment">Mulai asesmen</Button></div> : [...state.attempts].reverse().map((a, i) => <div className="history-row" key={`${a.date}-${i}`}><div className={`icon-tile ${a.mastered ? 'purple' : 'blue'}`}><Icon name={a.type === 'assessment' ? 'shapes' : a.mastered ? 'check' : 'leaf'}/></div><div><h3>{a.title || 'Asesmen awal'}</h3><p>{new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · {a.type === 'assessment' ? 'Profil awal tersimpan' : a.mastered ? 'Materi dikuasai' : `Penguatan ${(aspects.find(b => b.id === a.aspect)?.name || 'materi').toLowerCase()}`}</p></div><strong>{a.type === 'assessment' ? '4 aspek' : `${a.score}%`}</strong></div>)}</section></>
}
function AccessibilityFields() { const { state, setting } = useStore(); return <><label className="field">Ukuran teks<select value={state.settings.textSize} onChange={e => setting('textSize', e.target.value)}><option value="normal">Normal</option><option value="large">Besar</option><option value="extra">Sangat besar</option></select></label><label className="field">Tampilan<select value={state.settings.theme} onChange={e => setting('theme', e.target.value)}><option value="light">Terang</option><option value="dark">Gelap</option></select></label><label className="field">Kecepatan video awal<select value={state.settings.speed} onChange={e => setting('speed', e.target.value)}><option value="1">Normal · 1×</option><option value="0.75">Pelan · 0,75×</option><option value="0.5">Sangat pelan · 0,5×</option></select></label><Toggle label="Mode visual nyaman" description="Kurangi gerakan dan dekorasi." checked={state.settings.comfortable} onChange={v => setting('comfortable', v)}/><Toggle label="Kontras tinggi" description="Perjelas batas dan warna teks." checked={state.settings.contrast} onChange={v => setting('contrast', v)}/></> }
function Toggle({ label, description, checked, onChange }) { return <label className="toggle-row"><span><strong>{label}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/></label> }
export function Settings() {
 const { session, logout } = useAccount(); const { state, setting, clips, setClips, dictionary, savePreferences, accountError, accountReady,studentPreview,isSupporter } = useStore(); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState(''); const [deleteOpen, setDeleteOpen] = useState(false); const [selectedWord, setWord] = useState(''); const word = dictionary.some(entry => entry.word === selectedWord) ? selectedWord : dictionary[0]?.word || ''; const navigate = useNavigate()
 return <><PageHeading title="Pengaturan" text="Atur ruang belajar sesuai kebutuhanmu."/><div className="settings-grid"><section className="panel"><div className="section-heading"><h2>Aksesibilitas</h2><Icon name="settings"/></div><AccessibilityFields/><Toggle label="Hemat data video" description="Video dimuat hanya ketika kamu memutarnya." checked={state.settings.dataSaver} onChange={v => setting('dataSaver', v)}/><p className="muted">Pengaturan langsung diterapkan di perangkat. Simpan untuk sinkronisasi akun.</p>{session && <Button disabled={saving || !accountReady} onClick={async () => { setSaving(true); try { await savePreferences(); setNotice(studentPreview?'Pengaturan pratinjau tersimpan sementara.':'Pengaturan tersimpan online.') } catch (error) { setNotice(error.message) } finally { setSaving(false) } }}>{studentPreview?'Simpan pengaturan pratinjau':'Simpan pengaturan akun'}</Button>}{notice && <p role="status">{notice}</p>}{accountError && <p role="alert">{accountError}</p>}</section>{session && accountReady && <div><ProfilePhotoEditor/><ProfileEditor/>{!isSupporter&&<section className="panel video-upload"><h2>Pratinjau video isyarat</h2><p>Gunakan video lokal yang sudah ditinjau. Video hanya tersedia selama sesi browser ini, untuk kata yang dipilih.</p><label className="field">Kata<select value={word} onChange={e => setWord(e.target.value)}>{dictionary.map(d => <option key={d.word}>{d.word}</option>)}</select></label><label className="field">Video untuk {word}<input type="file" accept="video/*" onChange={e => { const file = e.target.files[0]; if (!file) return; if (!file.type.startsWith('video/')) return setNotice('Pilih berkas video.'); const key = `${state.settings.language}:${word}`; if (clips[key]) URL.revokeObjectURL(clips[key]); setClips({ ...clips, [key]: URL.createObjectURL(file) }); setNotice(`Video ${word} siap dipratinjau di kamus dan materi.`) }}/></label><Link className="text-link" to="/dictionary">Pratinjau di kamus<Icon name="arrow" size={16}/></Link></section>}</div>}</div>{session && !studentPreview && <section className="panel"><Button secondary disabled={saving} onClick={async () => { setSaving(true); try { await logout(); navigate("/") } catch (error) { setNotice(error.message) } finally { setSaving(false) } }}>Keluar akun</Button></section>}<section className="panel privacy-panel"><h2>Data & privasi</h2><p>{studentPreview?'Data uji di pratinjau bersifat sementara. Akhiri pratinjau untuk kembali ke akun admin.':'Profil, pengaturan, jawaban, dan hasil belajar tersimpan online di akunmu. Penghapusan di bawah membersihkan arsip serta video pratinjau pada perangkat ini.'}</p>{!studentPreview&&<Button secondary onClick={() => setDeleteOpen(true)}>Bersihkan arsip perangkat</Button>}{deleteOpen && <div className="notice delete-notice" role="alert"><p>Bersihkan arsip lama dan video pratinjau pada perangkat ini? Progres online tetap tersedia.</p><Button secondary onClick={() => setDeleteOpen(false)}>Batal</Button><Button onClick={() => { Object.values(clips).forEach(url => URL.revokeObjectURL(url)); setClips({}); try { localStorage.removeItem('bahasakita-learning-' + session.user.id) } catch {} setDeleteOpen(false); try { localStorage.removeItem('bahasakita-login-email') } catch {} navigate('/'); }}>Ya, hapus data</Button></div>}</section></>
}
export function Missing() { return <div className="panel empty-card"><Icon name="path" size={48}/><h1>Halaman ini belum ditemukan.</h1><p>Kembali ke ruang belajar dan lanjutkan perjalananmu.</p><Button to="/">Kembali ke beranda</Button></div> }

export function Profile() {
 const { state, masteredLessons, lessonAttempts,isAdmin,isSupporter,role,studentPreview } = useStore()
 const profile = state.profile
 return <><PageHeading title="Profil saya" text={isSupporter?'Kelola profil akun pendampingmu.':'Kenali dirimu dan perjalanan belajarmu.'} action={<Button to="/settings" secondary><Icon name="settings" size={17}/>Edit profil</Button>}/><section className="panel profile-overview"><div className="profile-main-avatar">{<ProfileAvatar profile={profile} size={38}/>}</div><div><h2>{profile?.name || 'Teman belajar'}</h2><p>{isSupporter?'Dampingi setiap langkah belajar.':'Belajar dengan caramu, bertumbuh dengan ritmemu.'}</p><div className="inline-tags"><Tag>{isSupporter?(role==='teacher'?'Guru':'Orang tua'):profile?.grade || 'SD'}</Tag></div></div></section><section className="panel profile-details"><h2>{isSupporter?'Profil pendamping':'Profil belajarmu'}</h2><dl><div><dt>Nama panggilan</dt><dd>{profile?.name || 'Belum diisi'}</dd></div>{isSupporter?<div><dt>Peran akun</dt><dd>{role==='teacher'?'Guru':'Orang tua'}</dd></div>:<><div><dt>Jenjang belajar</dt><dd>{profile?.grade || 'Belum dipilih'}</dd></div><div><dt>Tujuan belajar</dt><dd>{profile?.goal || 'Belum dipilih'}</dd></div></>}</dl></section>{((!isAdmin&&!isSupporter)||studentPreview)&&<div className="stats-grid"><Stat icon="trophy" color="purple" value={masteredLessons.length + ' materi'} label="Sudah dikuasai"/><Stat icon="chart" color="blue" value={state.assessment ? 'Sudah selesai' : 'Belum dimulai'} label="Asesmen awal"/><Stat icon="refresh" color="pink" value={lessonAttempts.length + ' sesi'} label="Sesi belajar tercatat"/></div>}{((!isAdmin&&!isSupporter)||studentPreview)&&<div className="form-actions"><Button to="/progress">Lihat kemajuan<Icon name="arrow" size={17}/></Button></div>}</>
}
