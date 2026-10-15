import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { aspects, useStore } from './learning.jsx'
import { ProfileGrid } from './LearningApp.jsx'
import Icon from './components/Icon.jsx'
import LessonVideo from './LessonVideo.jsx'
import { SourceWordModal } from './GradeDictionary.jsx'

const Button = ({ children, secondary, ...props }) => <button className={`btn ${secondary ? 'secondary' : ''}`} {...props}>{children}</button>
function Heading({ title, text }) { return <div className="page-heading"><div><h1>{title}</h1><p>{text}</p></div></div> }
export function LearningStatus() {
 const { state, learningError, reloadLearning } = useStore()
 const [busy,setBusy] = useState(false)
 if (state.learningReady) return null
 return <div className="panel" role="status"><p>{learningError || 'Memuat progres belajar…'}</p>{learningError && <Button data-assessment-navigation disabled={busy} onClick={async()=>{setBusy(true);await reloadLearning().catch(()=>{});setBusy(false)}}>Coba lagi</Button>}</div>
}
const visualText = value => typeof value==='string' ? value.trim() : ''
function QuestionVisual({ question, fallbackVisual }) {
 const ownVisual=visualText(question.visual),visual=ownVisual||visualText(fallbackVisual)
 return visual ? <div className="question-visual" role="img" aria-label={ownVisual?'Ilustrasi soal':'Visual pendukung materi'}>{visual}</div> : null
}
function Choices({ question, selected, onSelect, disabled, fallbackVisual }) {
 return <><QuestionVisual question={question} fallbackVisual={fallbackVisual}/><h2>{question.prompt}</h2><div className="answer-options">{question.options.map((option,i)=><button type="button" key={i} disabled={disabled} className={`answer-option ${selected===i?'selected':''}`} aria-pressed={selected===i} onClick={()=>onSelect(i)}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div></>
}
// Keep the request ID on an uncertain response, so retrying cannot record two answers.
function useSubmission() {
 const { answerAttempt } = useStore()
 const pending = useRef(null)
 const [busy,setBusy] = useState(false), [error,setError] = useState('')
 const submit = async(attempt,question,answer,practice=false)=>{
  if(busy)return null
  if(!pending.current)pending.current={questionId:question.id,answer,requestId:crypto.randomUUID(),practice}
  setBusy(true);setError('')
  try { const p=pending.current;const result=await answerAttempt(attempt.id,p.questionId,p.answer,p.requestId,p.practice);pending.current=null;return result }
  catch(e){setError(e.message);return null}finally{setBusy(false)}
 }
 return {busy,error,submit,uncertain:!!pending.current}
}
export function Assessment() {
 const { state, startAttempt } = useStore()
 const [attempt,setAttempt] = useState(state.activeAssessment)
 const [selected,setSelected] = useState(null),[starting,setStarting] = useState(false),[startError,setStartError] = useState('')
 const submission=useSubmission()
 useEffect(()=>{if(!attempt&&state.activeAssessment)setAttempt(state.activeAssessment)},[state.activeAssessment])
 const start=async()=>{setStarting(true);setStartError('');try{setAttempt(await startAttempt('assessment'));setSelected(null)}catch(e){setStartError(e.message)}finally{setStarting(false)}}
 const answer=async value=>{const result=await submission.submit(attempt,attempt.question,value);if(result){setAttempt(result);setSelected(null)}}
 if(!state.learningReady)return <LearningStatus/>
 if(attempt?.status==='completed'){
  const passed=attempt.score>=80
  return <><Heading title={passed?'Semua fitur belajar terbuka ✨':'Mulai dari kelas belajar dasar 🌱'} text={`Nilai asesmenmu ${attempt.score}/100. Batas kelulusan adalah 80.`}/><ProfileGrid scores={attempt.scores}/><div className="panel result-summary"><Icon name={passed?'trophy':'book'} size={35}/><div><h2>{passed?'Kamu siap melanjutkan belajar':'Kita kuatkan dasar bersama'}</h2><p>Hasil dan jawabanmu sudah tersimpan di akunmu.</p></div><Link className="btn" to={passed?'/learning':'/basic-class'}>{passed?'Lanjut belajar':'Masuk kelas belajar dasar'}</Link></div></>
 }
 if(!attempt)return <><Heading title="Bukan ujian. Ini titik awalmu." text="Jawab sesuai yang kamu pahami. Tidak perlu terburu-buru."/><div className="panel assessment-intro"><div className="large-icon"><Icon name="shapes" size={48}/></div><h2>8 soal, 4 aspek kemampuan ({state.profile.grade})</h2><p>Kosakata, kalimat, bacaan, dan matematika dasar.<br/>Soal berikutnya menyesuaikan jawabanmu. Kamu bisa jeda dan melanjutkan di perangkat lain.</p>{startError&&<p role="alert">{startError}</p>}<Button disabled={starting} onClick={start}>{starting?'Menyiapkan…':'Mulai asesmen'}</Button></div></>
 const aspect=aspects.find(a=>a.id===attempt.question?.aspect)
 if(!attempt.question)return <div className="panel" role="alert">Sesi belum dapat dimuat. Muat ulang halaman untuk melanjutkan.</div>
 return <><Heading title="Satu soal, satu langkah." text="Setiap jawaban disimpan saat kamu melanjutkan."/><div className="quiz-container panel"><div className="quiz-top"><span className={`tag ${aspect?.color}`}>{aspect?.name} · {attempt.grade}</span><span>Soal {attempt.answered+1} dari 8</span></div><progress max={8} value={attempt.answered} aria-label="Kemajuan asesmen"/><Choices question={attempt.question} selected={selected} onSelect={setSelected} disabled={submission.busy||submission.uncertain}/>{submission.error&&<p role="alert">{submission.error}</p>}<div className="quiz-actions"><Button secondary disabled={submission.busy||submission.uncertain} onClick={()=>answer(null)}>Saya belum tahu</Button><Button disabled={submission.busy||(!submission.uncertain&&selected===null)} onClick={()=>answer(selected)}>{submission.busy?'Menyimpan…':submission.uncertain?'Coba simpan lagi':'Lanjut'}</Button></div><Link className="text-link" to="/">Jeda & kembali ke beranda</Link></div></>
}
export function Lesson() {
 const { id } = useParams()
 return <LessonSession key={id} id={id}/>
}
function LessonSession({ id }) {
 const { state,startAttempt,setStage,learningError }=useStore()
 const [attempt,setAttempt]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false)
 const [answer,setAnswer]=useState(null),[words,setWords]=useState([]),[feedback,setFeedback]=useState(null),[heldQuestion,setHeldQuestion]=useState(null),[showResult,setShowResult]=useState(false),[alternative,setAlternative]=useState(false),[wordOpen,setWordOpen]=useState(null)
 const submission=useSubmission()
 useEffect(()=>{let active=true;if(state.learningReady)startAttempt('lesson',id).then(a=>{if(active){setAttempt(a);setShowResult(a.status==='completed')}}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[id,state.learningReady])
 const stage=attempt?.stage||0,lesson=attempt?.lessonContent
 const move=async next=>{setBusy(true);setError('');try{setAttempt(await setStage(attempt.id,next));setAnswer(null);setWords([]);setFeedback(null);setHeldQuestion(null)}catch(e){setError(e.message)}finally{setBusy(false)}}
 const submit=async practice=>{const question=practice?attempt.practice:attempt.question;const result=await submission.submit(attempt,question,question.format==='order'?words.join(' '):answer,practice);if(result){setHeldQuestion(question);setFeedback(result.feedback);setAttempt(result)}}
 const retry=async()=>{setBusy(true);setError('');try{const a=await startAttempt('lesson',id);setAttempt(await setStage(a.id,1));setShowResult(false);setFeedback(null);setHeldQuestion(null);setAnswer(null);setWords([]);setAlternative(true)}catch(e){setError(e.message)}finally{setBusy(false)}}
 if(!state.learningReady)return <LearningStatus/>
 if(!lesson)return <div className="panel" role="status"><p>{error||'Memuat sesi belajar…'}</p>{error&&<Button onClick={()=>window.location.reload()}>Coba lagi</Button>}<Link className="text-link" to="/learning">Kembali ke jalur belajar</Link></div>
 const q=heldQuestion|| (stage===2?attempt.practice:attempt.question)
 const lessonVisual=visualText(lesson.visual)||visualText(lesson.emoji)
 const disabled=busy||submission.busy
 return <><Link className="back-link" to="/learning">← Kembali ke jalur belajar</Link><Heading title={lesson.title} text={lesson.description}/><div className="inline-tags"><span className="tag">{lesson.grade} · Versi {lesson.version}</span><span className="muted">Sesi tersimpan di akunmu</span></div><div className="stage-nav" aria-label="Tahap belajar">{['Pengantar','Isyarat & visual','Latihan','Evaluasi'].map((s,i)=><span key={s} className={stage===i?'active':i<stage?'done':''}><b>{i+1}</b>{s}</span>)}</div>{(error||submission.error||learningError)&&<p className="notice" role="alert">{error||submission.error||learningError}</p>}
 {showResult?<div className="panel result-summary"><Icon name={attempt.mastered?'trophy':'leaf'} size={40}/><div><h2>{attempt.mastered?'Materi sudah kamu kuasai!':'Kita coba penguatan lagi.'}</h2><p>Nilai evaluasi: {attempt.score}%. {attempt.mastered?'Langkahmu sudah tercatat.':'Target: minimal 80% dan tidak mengulang kesalahan pada soal yang sama.'}</p></div><Link className="btn" to="/learning">Lanjut ke jalur belajar</Link><Button secondary disabled={busy} onClick={retry}>Latihan lagi</Button></div>:<div className="lesson-layout"><section className="panel lesson-main">
 {stage===0&&<><div className="lesson-big-visual" role="img" aria-label="Visual materi">{lessonVisual}</div><h2>Hari ini, kita belajar…</h2><p>{lesson.intro}</p><Button disabled={disabled} onClick={()=>move(1)}>Mulai belajar</Button></>}
 {stage===1&&<><h2>Amati, baca, dan pahami</h2>{lesson.wordEntry&&<LessonVideo entry={lesson.wordEntry} paused={!!wordOpen}/>}<div className="visual-explanation">{lessonVisual&&<span role="img" aria-label="Visual materi">{lessonVisual}</span>}<div>{lesson.wordEntry&&<button className="word-link" onClick={()=>setWordOpen(lesson.wordEntry)}>{lesson.wordEntry.word}<Icon name="hand" size={17}/></button>}<p>{lesson.explanation}</p>{lesson.example&&<p className="example">“{lesson.example}”</p>}</div></div>{alternative&&<div className="feedback"><p>{lesson.tip}</p></div>}<div className="quiz-actions"><Button secondary disabled={disabled} onClick={()=>move(0)}>Kembali</Button><Button disabled={disabled} onClick={()=>move(2)}>Lanjut ke latihan</Button></div></>}
 {stage===2&&q&&<><span className="tag">LATIHAN PENGUATAN</span>{q.format==='order'?<><QuestionVisual question={q} fallbackVisual={lessonVisual}/><h2>{q.prompt}</h2><div className="reading-box" aria-live="polite">{words.join(' ')||'Susun kata di bawah.'}</div><div className="choice-row">{q.words.map((word,i)=><Button secondary key={i} disabled={disabled||submission.uncertain||words.filter(w=>w===word).length>=q.words.filter(w=>w===word).length} onClick={()=>{setWords([...words,word]);setFeedback(null)}}>{word}</Button>)}<Button secondary disabled={disabled||submission.uncertain} onClick={()=>{setWords([]);setFeedback(null)}}>Susun ulang</Button></div></>:<Choices question={q} fallbackVisual={lessonVisual} selected={answer} onSelect={v=>{setAnswer(v);setFeedback(null)}} disabled={disabled||submission.uncertain}/>}{feedback&&<div className={`feedback ${feedback.correct?'correct':''}`} role="status"><p>{feedback.correct?'Tepat! Kamu sudah memahami contoh ini.':`Mari perhatikan lagi. ${lesson.tip}`}</p></div>}<div className="quiz-actions"><Button secondary disabled={disabled} onClick={()=>move(1)}>Lihat materi lagi</Button>{feedback?<Button disabled={disabled} onClick={()=>move(3)}>Mulai evaluasi</Button>:<Button disabled={disabled||(!submission.uncertain&&(q.format==='order'?words.length!==q.words.length:answer===null))} onClick={()=>submit(true)}>{submission.uncertain?'Coba simpan lagi':'Periksa jawaban'}</Button>}</div></>}
 {stage===3&&q&&<><div className="quiz-top"><span className="tag">EVALUASI MATERI</span><span>Soal {feedback?attempt.answered:attempt.answered+1} dari 5</span></div><progress max={5} value={attempt.answered} aria-label="Kemajuan evaluasi"/>{lesson.aspect==='bacaan'&&<div className="reading-box">{lesson.explanation}</div>}<Choices question={q} fallbackVisual={lessonVisual} selected={answer} onSelect={setAnswer} disabled={disabled||!!feedback||submission.uncertain}/>{feedback&&<div className={`feedback ${feedback.correct?'correct':''}`} role="status"><p>{feedback.correct?'Tepat! Lanjutkan langkahmu.':`Perhatikan kembali materi. ${lesson.tip}`}</p></div>}<div className="quiz-actions"><span className="muted">Target: 4 dari 5 soal</span><Button disabled={disabled||(!feedback&&!submission.uncertain&&answer===null)} onClick={feedback?()=>{if(attempt.status==='completed')setShowResult(true);else{setHeldQuestion(null);setFeedback(null);setAnswer(null)}}:()=>submit(false)}>{submission.busy?'Menyimpan…':feedback?attempt.status==='completed'?'Lihat hasil':'Soal berikutnya':submission.uncertain?'Coba simpan lagi':'Periksa jawaban'}</Button></div></>}
 </section><aside className="panel lesson-support"><h3>Belum paham? Tidak apa-apa.</h3><p>Kamu menentukan ritme belajarmu.</p><Button secondary onClick={()=>setAlternative(!alternative)} aria-pressed={alternative}>Saya belum paham</Button>{alternative&&<p>{lesson.tip}</p>}<hr/><h4>Kosakata pendukung</h4>{(lesson.relatedWords||[]).map(entry=><button className="text-link" key={entry.word} onClick={()=>setWordOpen(entry)}>{entry.emoji} {entry.word}</button>)}</aside></div>}{wordOpen&&<SourceWordModal grade={lesson.grade} entry={wordOpen} onClose={()=>setWordOpen(null)}/>}</>
}
