import { useAccount } from './Account.jsx'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { fetchCatalog } from './supabase.js'
import { dictionaryForGrade } from './gradeDictionary.js'

export const aspects = [
  { id: 'kosakata', name: 'Kosakata', icon: 'book', color: 'purple', description: 'Kenali kata dan artinya.' },
  { id: 'kalimat', name: 'Kalimat', icon: 'text', color: 'blue', description: 'Susun kata, pahami makna.' },
  { id: 'bacaan', name: 'Bacaan', icon: 'file', color: 'pink', description: 'Temukan informasi dalam cerita.' },
  { id: 'akademik', name: 'Soal akademik', icon: 'shapes', color: 'yellow', description: 'Pahami konsep matematika.' },
]
export const initialState = { profile: null, learningReady: false, legacy: null, activeAssessment: null, assessment: null, assessmentDraft: null, mastered: [], attempts: [], settings: { textSize: 'normal', theme: 'light', speed: '1', comfortable: false, contrast: false, language: 'default', dataSaver: false } }
const Store = createContext(null)
export function Provider({ children }) {
 const account = useAccount()
 const userId = account?.session?.user.id
 const [state,setState] = useState(() => { try { return { ...structuredClone(initialState), settings: { ...initialState.settings, ...JSON.parse(localStorage.getItem('bahasakita-preferences') || '{}') } } } catch { return structuredClone(initialState) } })
 const [content,setContent] = useState({lessons:[],basicMaterials:[]})
 const [contentError,setContentError] = useState('')
 const [clips,setClips] = useState({})
 const [accountError,setAccountError] = useState('')
 const [accountReady,setAccountReady] = useState(false)
 const [learningError,setLearningError] = useState('')
 const [isAdmin,setIsAdmin] = useState(false)
 const [accessReady,setAccessReady] = useState(false),[accessError,setAccessError] = useState('')
 const [preview,setPreview] = useState(null),[previewError,setPreviewError] = useState('')
 const previewId=useRef(null),previewPhoto=useRef(null)
 const previewClips=useRef({})
 const previewKey='bahasakita-preview-'+userId
 const clearPreview=()=>{previewId.current=null;setPreview(null);setPreviewError('');if(previewPhoto.current)URL.revokeObjectURL(previewPhoto.current);previewPhoto.current=null;Object.values(previewClips.current).forEach(url=>URL.revokeObjectURL(url));previewClips.current={};try{sessionStorage.removeItem(previewKey)}catch{}}
 const rememberPreview=data=>{if(!data?.id||!data.state?.profile||!Array.isArray(data.catalog?.lessons))throw new Error('Pratinjau belum dapat dimuat.');previewId.current=data.id;setPreview(data);setPreviewError('');try{sessionStorage.setItem(previewKey,data.id)}catch{}}
 const previewRequest=async(path='',body,options={})=>{const id=previewId.current;if(!id)throw new Error('Pratinjau sudah berakhir.');const data=await account.accountApi('/admin/preview/'+id+path,body,options);if(previewId.current!==id)throw new Error('Pratinjau sudah berakhir.');return {data,id}}
 const applyPreviewState=(id,data)=>setPreview(previous=>previous?.id===id?{...previous,state:data}:previous)
 const applyAccess=async(data,active=()=>true)=>{
  if(typeof data?.isAdmin!=='boolean')throw new Error('Hak akses akun belum dapat dimuat. Coba lagi.')
  if(!active())return
  setIsAdmin(data.isAdmin)
  if(data.isAdmin){
   let saved;try{saved=sessionStorage.getItem(previewKey)}catch{}
   if(saved&&!previewId.current){try{const restored=await account.accountApi('/admin/preview/'+saved);if(active())rememberPreview(restored)}catch{if(active())clearPreview()}}
  }else clearPreview()
  if(active()){setAccessReady(true);setAccessError('')}
 }
 const reloadAccess=async()=>{setAccessReady(false);try{await applyAccess(await account.accountApi('/access'))}catch(e){setAccessError(e.message);throw e}}
 const startPreview=async(grade=state.profile?.grade||'SD')=>{if(!isAdmin)throw new Error('Pratinjau hanya tersedia untuk admin.');const data=await account.accountApi('/admin/preview',{grade,preferences:state.settings},{method:'POST'});rememberPreview(data);return data.state}
 const stopPreview=async()=>{const id=previewId.current;clearPreview();if(id)await account.accountApi('/admin/preview/'+id,undefined,{method:'DELETE'}).catch(()=>{})}
 const reloadCatalog = async () => { try { const data = await fetchCatalog(); setContent(data); setContentError(''); return data } catch(error) { setContentError(error.message); throw error } }
 const reloadLearning = async () => {
  if(previewId.current){try{const {id,data}=await previewRequest('/learning');applyPreviewState(id,data);setPreviewError('');return data}catch(e){setPreviewError(e.message);throw e}}
  try {
   const data = await account.accountApi('/learning')
   if (!Array.isArray(data?.attempts)||!Array.isArray(data?.mastered)) throw new Error('Data belajar belum dapat dimuat. Coba kembali.')
   setState(previous=>({...previous,...data,learningReady:true})); setLearningError(''); return data
  } catch(error) { setLearningError(error.message); setState(previous=>({...previous,learningReady:false})); throw error }
 }
 useEffect(()=>{let active=true;fetchCatalog().then(data=>{if(active){setContent(data);setContentError('')}}).catch(error=>{if(active)setContentError(error.message)});return()=>{active=false}},[])
 useEffect(()=>{
  let active=true
  setAccountReady(false);setAccountError('');setLearningError('');setIsAdmin(false);setAccessReady(false);setAccessError('');setClips({});previewId.current=null;setPreview(null)
  setState(previous=>({...structuredClone(initialState),settings:previous.settings}))
  if(!userId)return()=>{active=false}
  account.accountApi().then(async data=>{
   if(!active)return
   setState(previous=>({...previous,profile:data.profile,settings:{...initialState.settings,...data.preferences}}));setAccountReady(true)
   const results=await Promise.allSettled([account.accountApi('/access'),account.accountApi('/learning')])
   if(!active)return
   if(results[0].status==='fulfilled'){try{await applyAccess(results[0].value,()=>active)}catch(e){if(active)setAccessError(e.message)}}else setAccessError(results[0].reason.message)
   if(!active)return
   if(results[1].status==='fulfilled'&&Array.isArray(results[1].value?.attempts)){
    let learning=results[1].value
    let legacy=null
    try{legacy=JSON.parse(localStorage.getItem('bahasakita-learning-'+userId)||'null')}catch{}
    if(results[0].status==='fulfilled'&&!results[0].value.isAdmin&&!learning.legacy&&legacy&&(legacy.assessment||legacy.attempts?.length||legacy.mastered?.length)){
     try{await account.accountApi('/learning/import',legacy,{method:'POST'});learning=await account.accountApi('/learning')}catch{}
    }
    if(active)setState(previous=>({...previous,...learning,learningReady:true}))
   }else if(active){setLearningError(results[1].status==='rejected'?results[1].reason.message:'Data belajar belum dapat dimuat.')}
  }).catch(error=>{if(active)setAccountError(error.message)})
  return()=>{active=false;if(previewPhoto.current)URL.revokeObjectURL(previewPhoto.current);previewPhoto.current=null;Object.values(previewClips.current).forEach(url=>URL.revokeObjectURL(url));previewClips.current={}}
 },[userId])
 useEffect(()=>{try{localStorage.setItem('bahasakita-preferences',JSON.stringify(state.settings))}catch{}},[state.settings])
 const saveProfile=async profile=>{
  if(previewId.current){const {id,data}=await previewRequest('/profile',profile);applyPreviewState(id,data);return data.profile}
  const data=await account.accountApi('/profile',profile)
  setState(previous=>({...previous,profile:{...previous.profile,name:data.name,grade:data.grade,goal:data.goal},...(previous.profile?.grade!==data.grade?{assessment:null,assessmentDraft:null,mastered:[],learningReady:false}:{})}))
  await reloadLearning().catch(()=>{});return data
 }
 const uploadAvatar=async file=>{if(previewId.current){if(previewPhoto.current)URL.revokeObjectURL(previewPhoto.current);const url=URL.createObjectURL(file);previewPhoto.current=url;setPreview(p=>p?{...p,avatar:{avatar_path:'preview/photo.png',avatar_url:url}}:p);return}const avatar=await account.accountApi('/avatar',file,{method:'PUT'});setState(previous=>({...previous,profile:{...previous.profile,...avatar}}))}
 const removeAvatar=async()=>{if(previewId.current){if(previewPhoto.current)URL.revokeObjectURL(previewPhoto.current);previewPhoto.current=null;setPreview(p=>p?{...p,avatar:{avatar_path:null,avatar_url:null}}:p);return}const avatar=await account.accountApi('/avatar',undefined,{method:'DELETE'});setState(previous=>({...previous,profile:{...previous.profile,...avatar}}))}
 useEffect(()=>{
  if(!userId||!accountReady||!state.profile?.avatar_path)return
  let active=true;const path=state.profile.avatar_path
  const refresh=()=>account.accountApi('/avatar').then(avatar=>{if(active)setState(previous=>previous.profile?.avatar_path===path?{...previous,profile:{...previous.profile,...avatar}}:previous)}).catch(()=>{})
  const timer=setInterval(refresh,50*60*1000),visible=()=>{if(document.visibilityState==='visible')refresh()}
  document.addEventListener('visibilitychange',visible)
  return()=>{active=false;clearInterval(timer);document.removeEventListener('visibilitychange',visible)}
 },[userId,accountReady,state.profile?.avatar_path])
 const startAttempt=async(kind,lesson)=>{
  if(previewId.current){const {id,data}=await previewRequest('/learning/attempts',{kind,lesson},{method:'POST'});if(kind==='assessment')setPreview(p=>p?.id===id?{...p,state:{...p.state,activeAssessment:data,assessmentDraft:data.answers}}:p);return data}
  const attempt=await account.accountApi('/learning/attempts',{kind,lesson},{method:'POST'})
  if(kind==='assessment')setState(previous=>({...previous,activeAssessment:attempt,assessmentDraft:attempt.answers}))
  return attempt
 }
 const answerAttempt=async(attemptId,questionId,answer,requestId,practice=false)=>{
  if(previewId.current){const {id,data}=await previewRequest('/learning/attempts/'+attemptId+'/answers',{questionId,answer,requestId,practice},{method:'POST'});if(data.status==='completed')await reloadLearning();else if(data.kind==='assessment')setPreview(p=>p?.id===id?{...p,state:{...p.state,activeAssessment:data,assessmentDraft:data.answers}}:p);return data}
  const attempt=await account.accountApi('/learning/attempts/'+attemptId+'/answers',{questionId,answer,requestId,practice},{method:'POST'})
  if(attempt.kind==='assessment')setState(previous=>({...previous,activeAssessment:attempt.status==='active'?attempt:null,assessmentDraft:attempt.status==='active'?attempt.answers:null}))
  if(attempt.status==='completed')await reloadLearning().catch(()=>{})
  return attempt
 }
 const setStage=async(attemptId,stage)=>previewId.current?(await previewRequest('/learning/attempts/'+attemptId+'/stage',{stage})).data:account.accountApi('/learning/attempts/'+attemptId+'/stage',{stage})
 const getAttempt=async attemptId=>previewId.current?(await previewRequest('/learning/attempts/'+attemptId)).data:account.accountApi('/learning/attempts/'+attemptId)
 const visibleState=preview?{...preview.state,profile:{...preview.state.profile,...preview.avatar}}:state
 const savePreferences=async()=>{if(previewId.current){const {id,data}=await previewRequest('/preferences',visibleState.settings);applyPreviewState(id,data)}else await account.accountApi('/preferences',state.settings)}
 useEffect(()=>{document.documentElement.dataset.theme=visibleState.settings.theme;document.documentElement.dataset.size=visibleState.settings.textSize;document.documentElement.dataset.comfort=String(visibleState.settings.comfortable);document.documentElement.dataset.contrast=String(visibleState.settings.contrast);document.title='BahasaKita — Belajar dengan caramu'},[visibleState.settings])
 const setVisibleState=updater=>{if(previewId.current)setPreview(p=>p?{...p,state:typeof updater==='function'?updater(p.state):updater}:p);else setState(updater)}
 const update=patch=>setVisibleState(previous=>({...previous,...patch}))
 const setting=(key,value)=>setVisibleState(previous=>({...previous,settings:{...previous.settings,[key]:value}}))
 const visibleContent=preview?.catalog||content
 const visibleClips=preview?previewClips.current:clips
 const setVisibleClips=next=>{if(previewId.current){previewClips.current=typeof next==='function'?next(previewClips.current):next;setPreview(p=>p?{...p}:p)}else setClips(next)}
 const catalog=visibleContent.lessons.filter(lesson=>lesson.grade===visibleState.profile?.grade)
 const activeIds=new Set(catalog.map(lesson=>lesson.id))
 const masteredLessons=visibleState.mastered.filter(id=>activeIds.has(id))
 const lessonAttempts=visibleState.attempts.filter(attempt=>attempt.type==='lesson'&&activeIds.has(attempt.lesson))
 const path=buildPath(visibleState,catalog),next=path.find(lesson=>!visibleState.mastered.includes(lesson.id))
 return <Store.Provider value={{state:visibleState,setState:setVisibleState,update,setting,path,next,clips:visibleClips,setClips:setVisibleClips,saveProfile,savePreferences,uploadAvatar,removeAvatar,accountError,accountReady,isAdmin,accessReady,accessError,reloadAccess,studentPreview:!!preview,startPreview,stopPreview,learningError:preview?previewError:learningError,contentError:preview?'':contentError,reloadCatalog,reloadLearning,startAttempt,answerAttempt,setStage,getAttempt,lessons:catalog,basicMaterials:visibleContent.basicMaterials,dictionary:dictionaryForGrade(visibleState.profile?.grade),masteredLessons,lessonAttempts}}>{children}</Store.Provider>
}
export const useStore = () => useContext(Store)
export function buildPath(state, lessons = []) {
 const last = state.attempts.filter(a => a.type === 'lesson' && lessons.some(l => l.id === a.lesson)).at(-1)
 const reinforcement = last && !last.mastered && !state.mastered.includes(last.lesson) ? last.lesson : null
 return [...lessons.filter(l => state.mastered.includes(l.id)), ...lessons.filter(l => !state.mastered.includes(l.id)).sort((a, b) => {
   if (a.id === reinforcement) return -1
   if (b.id === reinforcement) return 1
   return (state.assessment?.[a.aspect] ?? 0) - (state.assessment?.[b.aspect] ?? 0)
 })]
}
export const ASSESSMENT_PASS_SCORE = 80
export function assessmentScore(state) {
 if (!state.assessment) return null
 const latest = state.attempts.filter(a => a.type === 'assessment' && (!state.profile?.grade || !a.grade || a.grade === state.profile.grade)).at(-1)
 if (latest?.answers?.length === 8) return latest.answers.filter(a => a.correct).length / 8 * 100
 const scores = latest?.scores || state.assessment
 const values = aspects.map(a => scores[a.id])
 return values.every(v => Number.isFinite(v) && v >= 0 && v <= 100) ? values.reduce((sum, v) => sum + v, 0) / values.length : null
}
export function learningDestination(state) {
 const score = assessmentScore(state)
 return score === null ? '/assessment' : score >= ASSESSMENT_PASS_SCORE ? '/' : '/basic-class'
}
export function canOpen(id, state, path) { return learningDestination(state) === '/' && path.some(l => l.id === id && l.grade === state.profile?.grade) }
export function level(score) { return score >= 80 ? 'Baik' : score >= 50 ? 'Cukup' : 'Perlu penguatan' }
