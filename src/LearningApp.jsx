import { useAccount } from './Account.jsx'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import Icon from './components/Icon.jsx'
import YouTubeLessons from './YouTubeLessons.jsx'
import GradeDictionary, { SourceWordModal } from './GradeDictionary.jsx'
import LessonVideo from './LessonVideo.jsx'
import { useAccess, needsLogin } from './access.jsx'
import { createCredential, normalizeEmail } from './auth.js'
import { aspects, questionBank, questionsForGrade, useStore, canOpen, level, initialState, evaluateLesson, assessmentScore, learningDestination } from './learning.jsx'
import { youtubeMaterials, youtubeEmbedUrl, youtubeWatchUrl } from './youtubeMaterials.js'
const Button = ({ children, to, secondary = false, className = '', ...props }) => to ? <Link to={to} className={`btn ${secondary ? 'secondary' : ''} ${className}`} {...props}>{children}</Link> : <button className={`btn ${secondary ? 'secondary' : ''} ${className}`} {...props}>{children}</button>
const Tag = ({ children, tone = 'purple' }) => <span className={`tag ${tone}`}>{children}</span>
const nav = [['/', 'home', 'Beranda'], ['/learning', 'graduation', 'Belajar'], ['/dictionary', 'dictionary', 'Kamus visual'], ['/progress', 'chart', 'Kemajuan saya']]
export function Shell() {
 const { state, setting, accountError, accountReady } = useStore(); const { pathname } = useLocation()
 const { authorized } = useAccess(); const navigate = useNavigate()
 const destination = learningDestination(state)
 const menu = authorized && destination === '/basic-class' ? [...nav, ['/basic-class', 'spark', 'Kelas Dasar']] : nav
 const guardAction = event => {
  const control = event.target.closest?.('a,button,input,select,textarea,form,[role="button"]')
  if (!control || control.hasAttribute('data-appearance-control')) return
  const publicNavigation = control.hasAttribute('data-public-navigation')
  const loginRequired = needsLogin(authorized, publicNavigation) && pathname !== '/dictionary' && pathname !== '/settings'
  const assessmentRequired = authorized && destination === '/assessment' && pathname !== '/assessment' && pathname !== '/settings' && !publicNavigation && !control.hasAttribute('data-assessment-navigation')
  if (!loginRequired && !assessmentRequired) return
  event.preventDefault(); event.stopPropagation()
  navigate(loginRequired ? '/signin' : '/assessment', { state: loginRequired ? { loginRequired: true } : { assessmentRequired: true } })
 }
 const guardFocus = event => { if (event.target.matches?.('input,select,textarea')) guardAction(event) }
 useEffect(() => { window.scrollTo(0, 0) }, [pathname])
 return <div className="app-shell" onClickCapture={guardAction} onFocusCapture={guardFocus} onSubmitCapture={guardAction}><a data-public-navigation className="skip-link" href="#main">Langsung ke isi</a><aside id="primary-sidebar" className="sidebar" aria-label="Menu utama"><Link data-public-navigation className="brand" to="/" aria-label="BahasaKita, beranda"><img src="/images/logo-bahasa-kita.png" alt="BahasaKita"/></Link><span className="side-label">RUANG BELAJARMU</span><nav aria-label="Navigasi utama">{menu.map(([url, icon, label]) => <NavLink data-public-navigation={authorized || url !== "/progress" ? true : undefined} key={url} to={url} end={url === '/'}><Icon name={icon}/>{label}</NavLink>)}</nav><div className="sidebar-bottom"><NavLink data-assessment-navigation to="/profile" className="sidebar-profile"><span className="profile-card-avatar">{authorized && state.profile?.name ? state.profile.name[0].toUpperCase() : <Icon name="profile" size={23}/>}</span><span className="sidebar-profile-copy"><strong>{authorized ? state.profile?.name || 'Profil saya' : 'Profil saya'}</strong><small>{authorized ? state.profile?.grade || 'SD' : 'Lihat profilmu'}</small></span><Icon name="chevron" size={17}/></NavLink><div className="side-footer">BahasaKita · Ruang untuk bertumbuh</div></div></aside>
 <div className="app-body"><header className="topbar"><Link data-public-navigation className="mobile-brand" to="/" aria-label="BahasaKita, beranda"><img src="/images/logo-bahasa-kita.png" alt="BahasaKita"/></Link><div className="breadcrumb">Ruang belajarmu <Icon name="chevron" size={15}/><strong>{[...nav, ['/profile', '', 'Profil saya'], ['/settings', '', 'Pengaturan'], ['/assessment', '', 'Asesmen awal'], ['/basic-class', '', 'Kelas belajar dasar'], ['/signup', '', 'Profil awal']].find(n => n[0] === pathname)?.[2] || 'Sesi belajar'}</strong></div><div className="topbar-right"><button type="button" className="topbar-theme-toggle" data-appearance-control aria-label={state.settings.theme === 'dark' ? 'Aktifkan tema terang' : 'Aktifkan tema gelap'} aria-pressed={state.settings.theme === 'dark'} title={state.settings.theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'} onClick={() => setting('theme', state.settings.theme === 'dark' ? 'light' : 'dark')}><Icon name={state.settings.theme === 'dark' ? 'moon' : 'sun'} size={24}/></button><Link data-assessment-navigation to="/profile" className="avatar" aria-label="Profil pengguna">{state.profile?.name?.[0]?.toUpperCase() || 'K'}</Link></div></header><main id="main" className="main-content" tabIndex={-1}>{authorized && accountReady && destination === '/assessment' && pathname !== '/assessment' && <div className="notice assessment-access-notice" role="status"><Icon name="lock" size={21}/><p>Kamu bisa menjelajahi halaman. Selesaikan asesmen awal sebelum menggunakan fitur belajar.</p><Link className="btn" to="/assessment">{state.assessmentDraft?.length ? 'Lanjutkan asesmen' : 'Mulai asesmen awal'}</Link></div>}{authorized && !accountReady && pathname !== "/settings" && pathname !== "/dictionary" ? <div className="panel" role="status">{accountError || "Memuat profil akun…"}{accountError && <button data-assessment-navigation className="btn" onClick={() => window.location.reload()}>Coba lagi</button>}</div> : <Outlet/>}</main><footer className="app-footer"><span>© 2026 BahasaKita</span><Link data-public-navigation to="/settings">Privasi & pengaturan</Link></footer></div><nav className="bottom-nav" style={{ '--nav-columns': menu.length }} aria-label="Navigasi bawah">{menu.map(([url, icon, label]) => <NavLink data-public-navigation={authorized || url !== "/progress" ? true : undefined} key={url} to={url} end={url === '/'}><Icon name={icon} size={22}/><span>{label}</span></NavLink>)}</nav></div>
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
export function Onboarding({ onComplete }) {
 const { state, update, setting } = useStore(); const navigate = useNavigate(); const [step, setStep] = useState(0); const [name, setName] = useState(state.profile?.name || ''); const [grade, setGrade] = useState(state.profile?.grade || 'SD'); const [goal, setGoal] = useState(state.profile?.goal || 'Mengenal kata'); const [email, setEmail] = useState(state.profile?.email || ''); const [password, setPassword] = useState(''); const [saving, setSaving] = useState(false); const [registerError, setRegisterError] = useState('')
 const finish = async e => { e.preventDefault(); if (saving || !name.trim()) return; if (step < 2) return setStep(step + 1); setSaving(true); setRegisterError(''); try { const credential = await createCredential(password); update({ profile: { name: name.trim(), grade, goal, email: normalizeEmail(email), credential } }); onComplete?.(); navigate('/', { replace: true }) } catch (error) { setRegisterError(error.message || 'Profil belum dapat disimpan.') } finally { setSaving(false) } }
 return <><div className="register-top"><Link to="/signin" className="back-link"><span className="back-link-icon"><Icon name="arrowLeft" size={15}/></span><span>Kembali ke Login</span></Link><span className="tag purple">REGISTER</span></div><PageHeading eyebrow="LANGKAH PERTAMA" title="Mari kenalan dulu." text="Buat ruang belajar yang nyaman untukmu."/><div className="onboarding-layout"><form className="panel form-panel" onSubmit={finish}><div className="step-dots">{['Tentang kamu', 'Cara belajar', 'Kenyamanan'].map((s, i) => <span className={i <= step ? 'active' : ''} key={s}><b>{i + 1}</b>{s}</span>)}</div>
 {step === 0 && <><h2>Senang bertemu denganmu 👋</h2><label className="field">Nama panggilan<input required maxLength={30} value={name} onChange={e => setName(e.target.value)} placeholder="Kamu ingin dipanggil apa?" autoComplete="nickname"/></label><label className="field">Email<input type="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} placeholder="Alamat email" autoComplete="username"/></label><label className="field">Kata sandi<input type="password" required minLength={8} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter" autoComplete="new-password"/></label><fieldset><legend>Pilih jenjang belajarmu</legend><div className="choice-row">{['SD', 'SMP', 'SMA'].map(g => <button type="button" key={g} aria-pressed={grade === g} className={`choice ${grade === g ? 'selected' : ''}`} onClick={() => setGrade(g)}><span>{g === 'SD' ? '🌱' : g === 'SMP' ? '🌿' : '🌳'}</span><strong>{g}</strong></button>)}</div></fieldset><p className="muted">Kamu bebas memilih jenjang. Materi Belajar dan Kamus Visual mengikuti jenjang yang kamu pilih.</p></>}
 {step === 1 && <><h2>Belajar dengan caramu</h2><fieldset><legend>Apa tujuan belajarmu?</legend><div className="goal-options">{[['Mengenal kata', '📚'], ['Memahami cerita', '📖'], ['Belajar matematika', '🍎']].map(([g, emoji]) => <button type="button" className={`choice ${goal === g ? 'selected' : ''}`} key={g} onClick={() => setGoal(g)} aria-pressed={goal === g}><span>{emoji}</span>{g}{goal === g && <Icon name="check" size={18}/>}</button>)}</div></fieldset><p className="muted">Video isyarat masih menunggu produksi dan tinjauan komunitas Tuli.</p></>}
 {step === 2 && <><h2>Buat tampilan terasa nyaman</h2><AccessibilityFields/><div className="notice"><Icon name="info"/><p>Profil dan login tersimpan di perangkat ini. Kata sandi disimpan sebagai hash. Kamu bisa menghapus data di Pengaturan.</p></div></>}
 {registerError && <p className="login-error" role="alert">{registerError}</p>}<div className="form-actions">{step > 0 && <Button secondary type="button" onClick={() => setStep(step - 1)}>Kembali</Button>}<Button type="submit" disabled={saving}>{saving ? 'Menyimpan…' : step === 2 ? 'Simpan & masuk ke beranda' : 'Lanjut'}<Icon name="arrow" size={17}/></Button></div></form><div className="onboarding-note"><BookArt/><h2>Setiap orang punya<br/>cara untuk bertumbuh.</h2><p>Di sini, kamu menentukan ritmenya.<br/>Kami membantu memilih langkahnya.</p><span><Icon name="check" size={17}/>Tanpa instruksi suara</span><span><Icon name="check" size={17}/>Teks pendek dan visual</span><span><Icon name="check" size={17}/>Bisa berhenti dan melanjutkan</span></div></div></>
}
function scoreAssessment(answers) { return Object.fromEntries(aspects.map(a => { const relevant = answers.filter(v => v.aspect === a.id); return [a.id, Math.round(relevant.filter(v => v.correct).length / 2 * 100)] })) }
export function Assessment() {
 const { state, update } = useStore(); const navigate = useNavigate(); const [answers, setAnswers] = useState(state.assessmentDraft || []); const [selected, setSelected] = useState(null); const [started, setStarted] = useState(!!state.assessmentDraft); const [done, setDone] = useState(false); const startTime = useRef(Date.now()); const [redo, setRedo] = useState(false)
 const grade = state.profile?.grade || 'SD'
 const gradeBank = questionsForGrade(grade)
 if (state.mastered.length && !redo && !done) return <><PageHeading title="Asesmen ulang" text="Mulai lagi untuk mengenali kemampuanmu saat ini."/><div className="panel empty-card"><Icon name="refresh" size={38}/><h2>Mulai jalur yang baru?</h2><p>Asesmen baru akan menyusun ulang jalur. Materi yang selesai akan kembali terbuka bertahap. Riwayat latihanmu tetap tersimpan.</p><Button onClick={() => { update({ mastered: [], assessment: null, assessmentDraft: null }); setAnswers([]); setRedo(true) }}>Mulai ulang asesmen</Button><Button to="/progress" secondary>Kembali ke kemajuan</Button></div></>
 if (done) { const score = assessmentScore(state); const passed = score >= 80; return <><PageHeading eyebrow="HASIL ASESMEN AWAL" title={passed ? 'Semua fitur belajar terbuka ✨' : 'Mulai dari kelas belajar dasar 🌱'} text={`Nilai asesmenmu ${score}/100. Batas kelulusan adalah 80.`}/><ProfileGrid scores={scoreAssessment(answers)}/><div className="panel result-summary"><Icon name={passed ? 'trophy' : 'book'} size={35}/><div><h2>{passed ? 'Kamu siap melanjutkan belajar' : 'Kita kuatkan dasar bersama'}</h2><p>{passed ? 'Jalur belajar, seluruh materi, kamus, dan kemajuan sudah bisa diakses.' : 'Fitur belajar lainnya terkunci. Pelajari video materi asesmen di kelas dasar, lalu ulangi asesmen hingga nilai minimal 80.'}</p></div><Button to={passed ? '/learning' : '/basic-class'}>{passed ? 'Lanjut belajar' : 'Masuk kelas belajar dasar'}<Icon name="arrow" size={18}/></Button></div></> }
 if (!started) return <><PageHeading title="Bukan ujian. Ini titik awalmu." text="Jawab sesuai yang kamu pahami. Tidak perlu terburu-buru."/><div className="panel assessment-intro"><div className="large-icon"><Icon name="shapes" size={48}/></div><h2>8 soal, 4 aspek kemampuan ({grade})</h2><p>Kosakata, kalimat, bacaan, dan matematika dasar sesuai jenjang {grade}.<br/>Soal berikutnya menyesuaikan jawabanmu.</p><div className="intro-benefits"><span><Icon name="clock"/>Sekitar 5 menit</span></div><Button onClick={() => { setStarted(true); startTime.current = Date.now() }}>Mulai asesmen<Icon name="arrow" size={18}/></Button></div></>
 const aspect = aspects[Math.floor(answers.length / 2)]; const position = answers.length % 2; const question = gradeBank[aspect.id][position === 0 ? 0 : (answers.at(-1)?.correct ? 1 : 2)]
 const submit = unknown => { const nextAnswers = [...answers, { aspect: aspect.id, correct: !unknown && selected === question.correct, unknown, seconds: Math.round((Date.now() - startTime.current) / 1000), difficulty: position === 0 ? 'dasar' : answers.at(-1)?.correct ? 'lanjut' : 'dasar' }]; setAnswers(nextAnswers); setSelected(null); startTime.current = Date.now(); if (nextAnswers.length === 8) { const scores = scoreAssessment(nextAnswers); update({ assessment: scores, assessmentDraft: null, mastered: [], attempts: [...state.attempts, { type: 'assessment', date: new Date().toISOString(), scores, answers: nextAnswers }] }); setDone(true) } else update({ assessmentDraft: nextAnswers }) }
 return <><PageHeading eyebrow="ASESMEN AWAL" title="Satu soal, satu langkah." text="Pilih jawaban yang paling sesuai." action={<Button secondary onClick={() => { update({ assessmentDraft: answers }); navigate('/') }}>Jeda & simpan</Button>}/><div className="quiz-container panel"><div className="quiz-top"><div className="inline-tags"><Tag tone={aspect.color}>{aspect.name}</Tag><Tag tone="neutral">{grade}</Tag></div><span>Soal {answers.length + 1} dari 8</span></div><progress max={8} value={answers.length} aria-label="Kemajuan asesmen"/><div className="question-visual" aria-label="Ilustrasi soal">{question.visual}</div><h2>{question.prompt}</h2><div className="answer-options">{question.options.map((option, i) => <button className={`answer-option ${selected === i ? 'selected' : ''}`} aria-pressed={selected === i} key={option} onClick={() => setSelected(i)}><span>{String.fromCharCode(65 + i)}</span>{option}{selected === i && <Icon name="check" size={19}/>}</button>)}</div><div className="quiz-actions"><Button secondary onClick={() => submit(true)}>Saya belum tahu</Button><Button disabled={selected === null} onClick={() => submit(false)}>Lanjut<Icon name="arrow" size={17}/></Button></div></div></>
}
export function ProfileGrid({ scores }) { return <div className="profile-grid">{aspects.map(a => <div className="panel profile-card" key={a.id}><div className={`icon-tile ${a.color}`}><Icon name={a.icon}/></div><h3>{a.name}</h3><strong>{scores?.[a.id] ?? 0}<small>%</small></strong><progress value={scores?.[a.id] ?? 0} max={100} aria-label={`Kemampuan ${a.name}`}/><Tag tone={a.color}>{scores ? level(scores[a.id]) : 'Belum dinilai'}</Tag></div>)}</div> }
export function LearningPath() {
 const { state, path, next, lessons, masteredLessons } = useStore()
 return <><PageHeading title="Jalur yang dibuat untukmu." text={state.profile?.grade ? `Materi ${state.profile.grade} memakai kosakata dan video yang sama dengan Kamus Visual. Semua materi terbuka setelah lulus asesmen.` : 'Pilih jenjang saat register untuk melihat materi yang sesuai dengan Kamus Visual.'} action={<Tag tone="neutral">{masteredLessons.length}/{lessons.length} materi selesai</Tag>}/>{!state.assessment && <div className="notice"><Icon name="info"/><p>Selesaikan asesmen awal untuk menyusun dan membuka jalurmu.</p><Button to="/assessment">Mulai asesmen</Button></div>}<div className="learning-layout"><div className="path-list">{!lessons.length && <div className="panel empty-card"><Icon name="book" size={40}/><h2>Pilih jenjang belajarmu</h2><p>Materi SD, SMP, dan SMA mengikuti kosakata serta video pada Kamus Visual.</p><Button to={state.profile ? '/settings' : '/signup'}>Pilih jenjang</Button></div>}{path.map((l, i) => { const complete = state.mastered.includes(l.id); const available = canOpen(l.id, state, path); const aspect = aspects.find(a => a.id === l.aspect); return <div className={`path-row ${available ? '' : 'locked'}`} key={l.id}><div className={`path-number ${complete ? 'complete' : available ? 'current' : ''}`}>{complete ? <Icon name="check"/> : available ? i + 1 : <Icon name="lock" size={19}/>}</div><article className="panel path-card"><div className={`lesson-picture ${aspect.color}`}>{l.emoji}</div><div className="path-card-content"><div className="inline-tags"><Tag tone={aspect.color}>{aspect.name}</Tag><Tag tone="neutral">{l.grade}</Tag>{next?.id === l.id && <span className="current-tag">Kamu di sini</span>}</div><h2>{l.title}</h2><p>{l.description}</p><span className="lesson-meta"><Icon name="clock" size={15}/>{l.time} menit · 4 tahap · {l.level}</span><p className="lesson-word-summary">Kosakata: {l.words.join(', ')}</p>{!available && <p className="lock-reason"><Icon name="lock" size={13}/>{!state.assessment ? 'Selesaikan asesmen awal terlebih dahulu.' : `Kuasai dulu: ${path[i - 1]?.title}. Setelah itu, materi ini direkomendasikan.`}</p>}</div>{available ? <Button to={`/lesson/${l.id}`} secondary={complete}>{complete ? 'Ulangi' : 'Mulai'}<Icon name="arrow" size={16}/></Button> : <span className="locked-label">Terkunci</span>}</article></div> })}</div><aside><div className="panel path-guide"><h3>Jalurmu bisa bertumbuh.</h3><p>Mulai dari aspek yang perlu penguatan. Pilih materi apa pun dan selesaikan evaluasi sesuai ritmemu.</p><hr/><h4>Belum paham? Tidak apa-apa.</h4><p>Ada contoh lain dan latihan penguatan. Setelah dua percobaan, kamu bisa kembali ke dasar.</p><Link className="text-link" to="/dictionary">Cari kata di kamus<Icon name="arrow" size={15}/></Link></div></aside></div></>
}
export function Lesson() {
 const { id } = useParams(); const { state, setState, path, lessons } = useStore(); const lesson = lessons.find(l => l.id === id); const [stage, setStage] = useState(0); const [alternative, setAlternative] = useState(false); const [answer, setAnswer] = useState(null); const [practiceChecked, setPracticeChecked] = useState(false); const [words, setWords] = useState([]); const [quizAnswers, setQuizAnswers] = useState([]); const [questionIndex, setQuestionIndex] = useState(0); const [feedback, setFeedback] = useState(false); const [result, setResult] = useState(null); const started = useRef(Date.now()); const [wordOpen, setWordOpen] = useState(null)
 useEffect(() => { setStage(0); setAnswer(null); setPracticeChecked(false); setWords([]); setQuizAnswers([]); setQuestionIndex(0); setFeedback(false); setResult(null); setAlternative(false); setWordOpen(null) }, [id])
 if (!lesson) return <><PageHeading title="Materi tidak tersedia untuk jenjangmu." text="Pilih materi pada jalur belajar yang sesuai dengan jenjang profilmu."/><Button to="/learning">Kembali ke jalur belajar</Button></>
 if (!canOpen(id, state, path)) return <><PageHeading title="Materi ini belum terbuka." text="Ikuti langkah dalam jalur belajarmu terlebih dahulu."/><Button to="/learning">Lihat jalur belajar</Button></>
 const failures = state.attempts.filter(a => a.lesson === id && !a.mastered).length
 const submitQuiz = () => { const correct = answer === lesson.quiz[questionIndex].correct; setQuizAnswers([...quizAnswers, { correct, aspect: lesson.aspect, seconds: Math.round((Date.now() - started.current) / 1000) }]); setFeedback(true) }
 const nextQuestion = () => { if (questionIndex < lesson.quiz.length - 1) { setQuestionIndex(questionIndex + 1); setAnswer(null); setFeedback(false); started.current = Date.now() } else { const previous = state.attempts.filter(a => a.lesson === id).at(-1); const { score, mastered } = evaluateLesson(quizAnswers, previous); const attempt = { type: 'lesson', lesson: id, grade: lesson.grade, title: lesson.title, aspect: lesson.aspect, score, mastered, date: new Date().toISOString(), answers: quizAnswers, errorType: mastered ? null : lesson.aspect }; setState(prev => ({ ...prev, mastered: mastered ? [...new Set([...prev.mastered, id])] : prev.mastered, assessment: { ...prev.assessment, [lesson.aspect]: score }, attempts: [...prev.attempts, attempt] })); setResult({ score, mastered }) } }
 const retry = () => { setResult(null); setQuestionIndex(0); setQuizAnswers([]); setAnswer(null); setFeedback(false); setPracticeChecked(false); setWords([]); setStage(1); setAlternative(true); started.current = Date.now() }
 return <><Link to="/learning" className="back-link"><span className="back-link-icon"><Icon name="arrowLeft" size={15}/></span><span>Kembali ke jalur belajar</span></Link><PageHeading title={lesson.title} text={lesson.description} action={<Tag>{lesson.grade} · {lesson.level}</Tag>}/><div className="stage-nav" aria-label="Tahap belajar">{['Pengantar', 'Isyarat & visual', 'Latihan', 'Evaluasi'].map((s, i) => <span className={i === stage ? 'active' : i < stage ? 'done' : ''} key={s}><b>{i < stage ? <Icon name="check" size={15}/> : i + 1}</b>{s}</span>)}</div>
 {result ? <div className="panel result-card"><div className="large-icon"><Icon name={result.mastered ? 'trophy' : 'leaf'} size={42}/></div><Tag>{result.mastered ? 'MATERI DIKUASAI' : 'SAATNYA PENGUATAN'}</Tag><h2>{result.mastered ? 'Kamu berhasil melangkah! ✨' : 'Kita coba dengan cara lain 🌱'}</h2><strong className="result-score">{result.score}%</strong><p>{result.mastered ? 'Profilmu sudah diperbarui. Pilih materi berikutnya sesuai jenjangmu.' : `Penguatan ${aspects.find(a => a.id === lesson.aspect).name.toLowerCase()} ${result.score >= 50 ? 'singkat' : 'penuh'}: ${lesson.tip}`}</p><div className="form-actions">{result.mastered ? <Button to="/learning">Lanjut ke jalur belajar<Icon name="arrow" size={17}/></Button> : <Button onClick={retry}>Buka penguatan<Icon name="refresh" size={17}/></Button>}{!result.mastered && failures >= 2 && <Button secondary onClick={() => { retry(); setStage(0) }}>Kembali ke pengantar dasar</Button>}</div>{!result.mastered && <p className="muted">Kamu bisa mengulang kapan saja. Tidak ada batas percobaan.</p>}</div> : <div className="lesson-layout"><section className="panel lesson-main">{stage === 0 && <><Tag>PENGANTAR & TUJUAN</Tag><h2>Hari ini, kita belajar…</h2><div className="lesson-big-visual">{lesson.visual}</div><p className="lesson-intro">{lesson.intro}</p><div className="notice"><Icon name="check"/><p>Belajar sesuai ritmemu. Kamu bisa membuka kamus atau meminta contoh lain.</p></div><LessonVideo key={`${stage}:${id}`} entry={lesson.wordEntry} paused={!!wordOpen}/><Button onClick={() => setStage(1)}>Lihat materi<Icon name="arrow" size={17}/></Button></>}
 {stage === 1 && <><Tag>ISYARAT & VISUAL</Tag><h2>Lihat, kenali, pahami.</h2><LessonVideo key={`${stage}:${id}`} entry={lesson.wordEntry} paused={!!wordOpen}/><div className="visual-explanation"><span>{lesson.visual}</span><div><button className="word-link" onClick={() => setWordOpen(lesson.wordEntry)}>{lesson.word}<Icon name="hand" size={17}/></button><p>{alternative ? lesson.tip : lesson.explanation}</p><p className="example">“{lesson.example}”</p></div></div>{alternative && <div className="feedback correct" role="status"><Icon name="leaf"/>Contoh tambahan: {lesson.tip}</div>}<div className="quiz-actions"><Button secondary onClick={() => setStage(0)}>Kembali</Button><Button onClick={() => setStage(2)}>Coba latihan<Icon name="arrow" size={17}/></Button></div></>}
 {stage === 2 && <><Tag>LATIHAN INTERAKTIF</Tag><h2>{lesson.practice.prompt}</h2>{lesson.practice.words ? <><div className="sentence-area" aria-live="polite">{words.length ? words.join(' ') : 'Ketuk kata sesuai urutannya.'}</div><div className="word-choices">{lesson.practice.words.map(w => <button key={w} disabled={words.includes(w) || practiceChecked} onClick={() => setWords([...words, w])}>{w}</button>)}</div><button className="text-link" onClick={() => { setWords([]); setPracticeChecked(false) }}>Susun ulang</button></> : <><div className="question-visual">{lesson.practice.visual || lesson.visual}</div><div className="answer-options">{lesson.practice.options.map((o, i) => <button className={`answer-option ${answer === i ? 'selected' : ''}`} key={o} disabled={practiceChecked} onClick={() => setAnswer(i)} aria-pressed={answer === i}><span>{String.fromCharCode(65 + i)}</span>{o}</button>)}</div></>}{practiceChecked && <div className="feedback correct" role="status"><Icon name="info"/><p>{(lesson.practice.words ? words.join(' ') === lesson.practice.answer : answer === lesson.practice.correct) ? 'Tepat! Kamu sudah memahami contoh ini.' : `Mari perhatikan lagi. ${lesson.tip}`}</p></div>}<div className="quiz-actions"><Button secondary onClick={() => { setStage(1); setAnswer(null); setPracticeChecked(false) }}>Lihat materi lagi</Button>{practiceChecked ? <Button onClick={() => { setStage(3); setAnswer(null); started.current = Date.now() }}>Mulai evaluasi<Icon name="arrow" size={17}/></Button> : <Button disabled={lesson.practice.words ? words.length < 3 : answer === null} onClick={() => setPracticeChecked(true)}>Periksa jawaban<Icon name="check" size={17}/></Button>}</div></>}
 {stage === 3 && <><div className="quiz-top"><Tag>EVALUASI MATERI</Tag><span>Soal {questionIndex + 1} dari 5</span></div><progress max={5} value={questionIndex} aria-label="Kemajuan evaluasi"/>{lesson.aspect === 'bacaan' && <div className="reading-box">{lesson.explanation}</div>}<h2 className="evaluation-question">{lesson.quiz[questionIndex].prompt}</h2><div className="answer-options">{lesson.quiz[questionIndex].options.map((o, i) => <button disabled={feedback} key={o} className={`answer-option ${answer === i ? 'selected' : ''}`} aria-pressed={answer === i} onClick={() => setAnswer(i)}><span>{String.fromCharCode(65 + i)}</span>{o}</button>)}</div>{feedback && <div className={`feedback ${quizAnswers.at(-1).correct ? 'correct' : ''}`} role="status"><Icon name={quizAnswers.at(-1).correct ? 'check' : 'leaf'}/><p>{quizAnswers.at(-1).correct ? 'Tepat! Lanjutkan langkahmu.' : `Jawaban: ${lesson.quiz[questionIndex].options[lesson.quiz[questionIndex].correct]}. ${lesson.tip}`}</p></div>}<div className="quiz-actions"><span className="muted">Target penguasaan: 4 dari 5 soal</span><Button disabled={answer === null} onClick={feedback ? nextQuestion : submitQuiz}>{feedback ? questionIndex === 4 ? 'Lihat hasil' : 'Soal berikutnya' : 'Periksa jawaban'}<Icon name="arrow" size={17}/></Button></div></>}
 {alternative && stage !== 1 && <div className="feedback" role="status"><Icon name="leaf"/><p>{lesson.tip}</p></div>}</section><aside><div className="panel lesson-support"><div className="icon-tile blue"><Icon name="hand"/></div><h3>Belum paham?<br/>Tidak apa-apa.</h3><p>Coba penjelasan yang berbeda. Kamu menentukan ritme belajarmu.</p><Button secondary onClick={() => setAlternative(!alternative)} aria-pressed={alternative}>{alternative ? 'Kembali ke contoh utama' : 'Saya belum paham'}</Button><hr/><h4>Kosakata dari Kamus Visual</h4><p>Kenali arti dan isyarat kata yang dipakai dalam materi ini.</p><div className="lesson-related-words">{lesson.relatedWords.map(entry => <button className="text-link" key={entry.word} onClick={() => setWordOpen(entry)}>{entry.emoji} {entry.word}<Icon name="arrow" size={15}/></button>)}</div></div></aside></div>}{wordOpen && <SourceWordModal grade={lesson.grade} entry={wordOpen} onClose={() => setWordOpen(null)}/>}</>
}
export function Dictionary() {
 const { state } = useStore(); const { authorized } = useAccess(); const [wordOpen, setWordOpen] = useState(false)
 const grade = state.profile?.grade || 'SD'
 return <div className="dictionary-page"><PageHeading title="Kamus visual" text="Kosakata dan video pembelajaran sesuai jenjangmu."/><GradeDictionary key={`${authorized}:${grade}`} grade={grade} authorized={authorized} onOpenChange={setWordOpen}/><YouTubeLessons key={wordOpen ? 'word-video' : 'lesson-video'}/></div>
}
export function Progress() {
 const { state, lessonAttempts, masteredLessons } = useStore(); const assessed = state.attempts.filter(a => a.type === 'assessment').at(-1)
 return <><PageHeading title="Kemajuan saya" text="Ini perjalananmu sendiri. Setiap percobaan punya arti."/><div className="stats-grid"><Stat icon="trophy" color="purple" value={`${masteredLessons.length} materi`} label="Sudah kamu kuasai"/><Stat icon="refresh" color="blue" value={`${lessonAttempts.length} sesi`} label="Usaha belajar yang tercatat"/><Stat icon="clock" color="pink" value={`${Math.round(lessonAttempts.reduce((n, a) => n + a.answers.reduce((s, b) => s + b.seconds, 0), 0) / 60)} menit`} label="Waktu mengerjakan evaluasi"/></div><div className="section-heading"><div><h2>Profil kemampuanmu</h2><p>{state.assessment ? 'Diperbarui setelah setiap evaluasi.' : 'Selesaikan asesmen untuk melihat profil awal.'}</p></div></div><ProfileGrid scores={state.assessment}/>{assessed && <div className="panel growth-panel"><h2>Perubahan dari titik awal</h2>{aspects.map(a => <div className="growth-row" key={a.id}><span>{a.name}</span><span>{assessed.scores[a.id]}% <Icon name="arrow" size={15}/> <strong>{state.assessment[a.id]}%</strong></span><Tag tone={a.color}>{state.assessment[a.id] > assessed.scores[a.id] ? 'Bertumbuh' : state.assessment[a.id] === assessed.scores[a.id] ? 'Tetap belajar' : 'Perlu penguatan'}</Tag></div>)}</div>}<section className="panel history-panel"><h2>Jejak belajarmu</h2>{!state.attempts.length ? <div className="empty-card"><h3>Cerita belajarmu dimulai di sini.</h3><p>Mulai asesmen, lalu catat langkah pertamamu.</p><Button to="/assessment">Mulai asesmen</Button></div> : [...state.attempts].reverse().map((a, i) => <div className="history-row" key={`${a.date}-${i}`}><div className={`icon-tile ${a.mastered ? 'purple' : 'blue'}`}><Icon name={a.type === 'assessment' ? 'shapes' : a.mastered ? 'check' : 'leaf'}/></div><div><h3>{a.title || 'Asesmen awal'}</h3><p>{new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} · {a.type === 'assessment' ? 'Profil awal tersimpan' : a.mastered ? 'Materi dikuasai' : `Penguatan ${aspects.find(b => b.id === a.aspect).name.toLowerCase()}`}</p></div><strong>{a.type === 'assessment' ? '4 aspek' : `${a.score}%`}</strong></div>)}</section></>
}
function AccessibilityFields() { const { state, setting } = useStore(); return <><label className="field">Ukuran teks<select value={state.settings.textSize} onChange={e => setting('textSize', e.target.value)}><option value="normal">Normal</option><option value="large">Besar</option><option value="extra">Sangat besar</option></select></label><label className="field">Tampilan<select value={state.settings.theme} onChange={e => setting('theme', e.target.value)}><option value="light">Terang</option><option value="dark">Gelap</option></select></label><label className="field">Kecepatan video awal<select value={state.settings.speed} onChange={e => setting('speed', e.target.value)}><option value="1">Normal · 1×</option><option value="0.75">Pelan · 0,75×</option><option value="0.5">Sangat pelan · 0,5×</option></select></label><Toggle label="Mode visual nyaman" description="Kurangi gerakan dan dekorasi." checked={state.settings.comfortable} onChange={v => setting('comfortable', v)}/><Toggle label="Kontras tinggi" description="Perjelas batas dan warna teks." checked={state.settings.contrast} onChange={v => setting('contrast', v)}/></> }
function Toggle({ label, description, checked, onChange }) { return <label className="toggle-row"><span><strong>{label}</strong><small>{description}</small></span><input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/></label> }
export function Settings() {
 const { session, logout } = useAccount(); const { state, setting, update, setState, clips, setClips, dictionary, saveProfile, savePreferences, accountError, accountReady } = useStore(); const [saving, setSaving] = useState(false); const [notice, setNotice] = useState(''); const [deleteOpen, setDeleteOpen] = useState(false); const [selectedWord, setWord] = useState(''); const word = dictionary.some(entry => entry.word === selectedWord) ? selectedWord : dictionary[0]?.word || ''; const navigate = useNavigate()
 return <><PageHeading title="Pengaturan" text="Atur ruang belajar sesuai kebutuhanmu."/><div className="settings-grid"><section className="panel"><div className="section-heading"><h2>Aksesibilitas</h2><Icon name="settings"/></div><AccessibilityFields/><Toggle label="Hemat data video" description="Video dimuat hanya ketika kamu memutarnya." checked={state.settings.dataSaver} onChange={v => setting('dataSaver', v)}/><p className="muted">Pengaturan langsung diterapkan di perangkat. Simpan untuk sinkronisasi akun.</p>{session && <Button disabled={saving || !accountReady} onClick={async () => { setSaving(true); try { await savePreferences(); setNotice("Pengaturan tersimpan online.") } catch (error) { setNotice(error.message) } finally { setSaving(false) } }}>Simpan pengaturan akun</Button>}{notice && <p role="status">{notice}</p>}{accountError && <p role="alert">{accountError}</p>}</section>{session && accountReady && <div><section className="panel"><h2>Profil belajarmu</h2><form onSubmit={async e => { e.preventDefault(); const form = new FormData(e.currentTarget); const name = form.get('name').trim(); if (!name) return; setSaving(true); try { await saveProfile({ name, grade: form.get('grade'), goal: form.get('goal') }); setNotice('Profil berhasil disimpan online.') } catch (error) { setNotice(error.message) } finally { setSaving(false) } }}><label className="field">Nama panggilan<input name="name" required maxLength={30} defaultValue={state.profile?.name || ''} placeholder="Nama panggilanmu"/></label><label className="field">Jenjang<select name="grade" defaultValue={state.profile?.grade || 'SD'}><option>SD</option></select></label><label className="field">Tujuan belajar<select name="goal" defaultValue={state.profile?.goal || "Mengenal kata"}><option>Mengenal kata</option><option>Memahami cerita</option><option>Belajar matematika</option></select></label><Button type="submit" disabled={saving}>Simpan profil<Icon name="check" size={17}/></Button><p className="muted">Materi dan kamus mengikuti jenjang belajarmu.</p></form>{notice && <p role="status" className="save-notice">{notice}</p>}</section><section className="panel video-upload"><h2>Pratinjau video isyarat</h2><p>Gunakan video lokal yang sudah ditinjau. Video hanya tersedia selama sesi browser ini, untuk kata yang dipilih.</p><label className="field">Kata<select value={word} onChange={e => setWord(e.target.value)}>{dictionary.map(d => <option key={d.word}>{d.word}</option>)}</select></label><label className="field">Video untuk {word}<input type="file" accept="video/*" onChange={e => { const file = e.target.files[0]; if (!file) return; if (!file.type.startsWith('video/')) return setNotice('Pilih berkas video.'); const key = `${state.settings.language}:${word}`; if (clips[key]) URL.revokeObjectURL(clips[key]); setClips({ ...clips, [key]: URL.createObjectURL(file) }); setNotice(`Video ${word} siap dipratinjau di kamus dan materi.`) }}/></label><Link className="text-link" to="/dictionary">Pratinjau di kamus<Icon name="arrow" size={16}/></Link></section></div>}</div>{session && <section className="panel"><Button secondary disabled={saving} onClick={async () => { setSaving(true); try { await logout(); navigate("/") } catch (error) { setNotice(error.message) } finally { setSaving(false) } }}>Keluar akun</Button></section>}<section className="panel privacy-panel"><h2>Data & privasi</h2><p>Akun, profil, dan pengaturan yang disimpan tersimpan online. Asesmen dan latihan masih berupa prototipe lokal per akun. Penghapusan di bawah hanya menghapus progres lokal, bukan akun online.</p><Button secondary onClick={() => setDeleteOpen(true)}>Hapus data belajar di perangkat</Button>{deleteOpen && <div className="notice delete-notice" role="alert"><p>Hapus asesmen dan progres lokal? Tindakan ini tidak dapat dibatalkan.</p><Button secondary onClick={() => setDeleteOpen(false)}>Batal</Button><Button onClick={() => { Object.values(clips).forEach(url => URL.revokeObjectURL(url)); setClips({}); setState(previous => ({ ...structuredClone(initialState), profile: previous.profile, settings: previous.settings })); try { localStorage.removeItem('bahasakita-login-email') } catch {} navigate('/'); }}>Ya, hapus data</Button></div>}</section></>
}
export function Missing() { return <div className="panel empty-card"><Icon name="path" size={48}/><h1>Halaman ini belum ditemukan.</h1><p>Kembali ke ruang belajar dan lanjutkan perjalananmu.</p><Button to="/">Kembali ke beranda</Button></div> }

export function Profile() {
 const { state, masteredLessons, lessonAttempts } = useStore()
 const profile = state.profile
 return <><PageHeading title="Profil saya" text="Kenali dirimu dan perjalanan belajarmu." action={<Button to="/settings" secondary><Icon name="settings" size={17}/>Edit profil</Button>}/><section className="panel profile-overview"><div className="profile-main-avatar">{profile?.name?.[0]?.toUpperCase() || <Icon name="profile" size={38}/>}</div><div><h2>{profile?.name || 'Teman belajar'}</h2><p>Belajar dengan caramu, bertumbuh dengan ritmemu.</p><div className="inline-tags"><Tag>{profile?.grade || 'SD'}</Tag></div></div></section><section className="panel profile-details"><h2>Profil belajarmu</h2><dl><div><dt>Nama panggilan</dt><dd>{profile?.name || 'Belum diisi'}</dd></div><div><dt>Jenjang belajar</dt><dd>{profile?.grade || 'Belum dipilih'}</dd></div><div><dt>Tujuan belajar</dt><dd>{profile?.goal || 'Belum dipilih'}</dd></div></dl></section><div className="stats-grid"><Stat icon="trophy" color="purple" value={masteredLessons.length + ' materi'} label="Sudah dikuasai"/><Stat icon="chart" color="blue" value={state.assessment ? 'Sudah selesai' : 'Belum dimulai'} label="Asesmen awal"/><Stat icon="refresh" color="pink" value={lessonAttempts.length + ' sesi'} label="Sesi belajar tercatat"/></div><div className="form-actions"><Button to="/progress">Lihat kemajuan<Icon name="arrow" size={17}/></Button></div></>
}
