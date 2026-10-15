import { randomUUID } from 'node:crypto'
import { profileInput,preferencesInput } from './validation.js'

const aspects=['kosakata','kalimat','bacaan','akademik']
const defaults={textSize:'normal',theme:'light',speed:'1',comfortable:false,contrast:false,language:'default',dataSaver:false}
type Row=Record<string,any>
type Answer={questionId:string,aspect:string,correct:boolean,unknown:boolean,seconds:number}
type Attempt={id:string,kind:'assessment'|'lesson',grade:string,lessonId:string|null,status:'active'|'completed',stage:number,answers:Answer[],requests:Map<string,{questionId:string,answer:unknown,practice:boolean,correct:boolean}>,startedAt:number,lastAnswerAt:number,completedAt:number|null,score:number|null,scores:Row|null,mastered:boolean}
export class PreviewError extends Error { constructor(message:string,public status=400){super(message)} }
function assertGrade(grade:unknown):asserts grade is string {if(!['SD','SMP','SMA'].includes(grade as string))throw new PreviewError('Pilih jenjang SD, SMP, atau SMA.')} 
function publicQuestion(q:Row){return {id:q.id,version:q.revision,prompt:q.prompt,options:q.options,aspect:q.aspect,format:q.format,slot:q.slot,...(typeof q.data?.visual==='string'?{visual:q.data.visual}:{}),...(Array.isArray(q.data?.words)?{words:q.data.words}:{})}}
function publicLesson(l:Row){const data=structuredClone(l.data);for(const k of ['answer','correct','practice','quiz'])delete data[k];return {...data,id:l.slug,versionId:l.id,version:l.revision,kind:l.kind,grade:l.grade,aspect:l.aspect,title:l.title,practice:l.questions.filter((q:Row)=>q.kind==='practice').map(publicQuestion)[0]||null,quiz:l.questions.filter((q:Row)=>q.kind==='quiz').sort((a:Row,b:Row)=>a.position-b.position).map(publicQuestion)}}

// Ephemeral admin-only sandbox. It never writes to learner tables or Storage.
export class PreviewSession {
 readonly id=randomUUID()
 private profile:Row
 private settings:Row={...defaults}
 private lessons:Row[]
 private questions:Row[]
 private attempts:Attempt[]=[]
 private eventTime=0
 constructor(readonly owner:string,content:Row,grade:unknown,private clock=Date.now,settings?:unknown){
  assertGrade(grade)
  this.profile={name:'Siswa uji',grade,goal:'Mengenal kata',email:null,avatar_path:null,avatar_url:null}
  if(settings)this.settings=preferencesInput(settings)
  this.lessons=structuredClone(content.lessons.filter((l:Row)=>l.status==='published'))
  this.questions=[...structuredClone(content.questions.filter((q:Row)=>q.status==='published')),...this.lessons.flatMap(l=>l.questions)]
 }
 private stamp(){this.eventTime=Math.max(this.clock(),this.eventTime+1);return this.eventTime}
 private question(a:Attempt):Row|null {
  if(a.status!=='active')return null
  const n=a.answers.length
  if(a.kind==='lesson')return this.lesson(a).questions.filter((q:Row)=>q.kind==='quiz').sort((x:Row,y:Row)=>x.position-y.position)[n]||null
  if(n>=8)return null
  const slot=n%2===0?'first':a.answers.at(-1)?.correct?'advanced':'remedial'
  return this.questions.find(q=>q.kind==='assessment'&&q.grade===a.grade&&q.aspect===aspects[Math.floor(n/2)]&&q.slot===slot)||null
 }
 private lesson(a:Attempt):Row {const l=this.lessons.find(l=>l.id===a.lessonId);if(!l)throw new PreviewError('Materi pratinjau tidak tersedia.');return l}
 private owned(id:string){const a=this.attempts.find(a=>a.id===id);if(!a)throw new PreviewError('Sesi pratinjau tidak ditemukan.',404);return a}
 private view(a:Attempt):Row {
  const l=a.lessonId?this.lesson(a):null,q=this.question(a),practice=l?.questions.find((q:Row)=>q.kind==='practice')
  return {id:a.id,kind:a.kind,grade:a.grade,lesson:l?.slug||null,lessonVersion:a.lessonId,status:a.status,stage:a.stage,score:a.score,scores:a.scores,mastered:a.mastered,answered:a.answers.length,question:q?publicQuestion(q):null,practice:practice?publicQuestion(practice):null,lessonContent:l?publicLesson(l):null,answers:structuredClone(a.answers)}
 }
 state(){
  const completed=this.attempts.filter(a=>a.status==='completed').sort((a,b)=>a.completedAt!-b.completedAt!)
  const baseline=completed.filter(a=>a.kind==='assessment'&&a.grade===this.profile.grade).at(-1)
  const assessment=baseline?{...baseline.scores}:null
  if(assessment)for(const a of completed.filter(a=>a.kind==='lesson'&&a.grade===this.profile.grade&&a.completedAt!>baseline!.completedAt!))assessment[this.lesson(a).aspect]=a.score
  const active=this.attempts.find(a=>a.kind==='assessment'&&a.grade===this.profile.grade&&a.status==='active')
  return {profile:structuredClone(this.profile),settings:{...this.settings},learningReady:true,assessment,assessmentDraft:active?structuredClone(active.answers):null,activeAssessment:active?this.view(active):null,mastered:[...new Set(completed.filter(a=>a.grade===this.profile.grade&&a.mastered).map(a=>this.lesson(a).slug))],legacy:null,
   attempts:completed.map(a=>({id:a.id,type:a.kind,grade:a.grade,lesson:a.lessonId?this.lesson(a).slug:null,lessonVersion:a.lessonId,title:a.lessonId?this.lesson(a).title:null,aspect:a.lessonId?this.lesson(a).aspect:null,score:a.score,scores:a.scores,mastered:a.mastered,date:new Date(a.completedAt!).toISOString(),answers:structuredClone(a.answers)}))}
 }
 catalog(){return {lessons:this.lessons.filter(l=>l.kind==='lesson').map(publicLesson),basicMaterials:this.lessons.filter(l=>l.kind==='basic').map(publicLesson)}}
 setProfile(body:unknown){this.profile={...this.profile,...profileInput(body)};return this.state()}
 setPreferences(body:unknown){this.settings=preferencesInput(body);return this.state()}
 start(kind:unknown,slug:unknown){
  if(kind!=='assessment'&&kind!=='lesson')throw new PreviewError('Jenis sesi tidak valid.')
  const grade=this.profile.grade
  let lesson:Row|undefined
  if(kind==='assessment'){
   for(const aspect of aspects)for(const slot of ['first','advanced','remedial'])if(!this.questions.some(q=>q.kind==='assessment'&&q.grade===grade&&q.aspect===aspect&&q.slot===slot))throw new PreviewError('Bank asesmen belum lengkap untuk jenjang ini.')
  }else{
   const last=this.attempts.filter(a=>a.kind==='assessment'&&a.grade===grade&&a.status==='completed').at(-1)
   if(!last||last.score!<80)throw new PreviewError('Selesaikan asesmen dengan nilai minimal 80 sebelum membuka materi.',403)
   lesson=this.lessons.find(l=>l.slug===slug&&l.kind==='lesson'&&l.grade===grade)
   if(!lesson)throw new PreviewError('Materi tidak tersedia untuk jenjang ini.')
   if(lesson.questions.filter((q:Row)=>q.kind==='quiz').length!==5||!lesson.questions.some((q:Row)=>q.kind==='practice'))throw new PreviewError('Latihan dan evaluasi materi belum lengkap.')
  }
  const existing=this.attempts.find(a=>a.kind===kind&&a.grade===grade&&a.lessonId===(lesson?.id||null)&&a.status==='active')
  if(existing)return this.view(existing)
  const now=this.stamp(),a:Attempt={id:randomUUID(),kind,grade,lessonId:lesson?.id||null,status:'active',stage:0,answers:[],requests:new Map(),startedAt:now,lastAnswerAt:now,completedAt:null,score:null,scores:null,mastered:false}
  this.attempts.push(a);return this.view(a)
 }
 get(id:string){return this.view(this.owned(id))}
 stage(id:string,stage:unknown){if(!Number.isInteger(stage)||Number(stage)<0||Number(stage)>3)throw new PreviewError('Tahap tidak valid.');const a=this.owned(id);if(a.kind!=='lesson'||a.status!=='active')throw new PreviewError('Sesi belajar sudah selesai atau tidak tersedia.');a.stage=Number(stage);return this.view(a)}
 answer(id:string,questionId:string,value:unknown,requestId:string,practice=false):Row{
  const a=this.owned(id),prior=a.requests.get(requestId)
  if(prior){if(prior.questionId!==questionId||prior.answer!==value||prior.practice!==practice)throw new PreviewError('Permintaan jawaban sudah digunakan.');return {...this.view(a),feedback:{correct:prior.correct}}}
  if(a.status!=='active')throw new PreviewError('Sesi ini sudah selesai.')
  const q=practice&&a.kind==='lesson'?this.lesson(a).questions.find((q:Row)=>q.kind==='practice'):!practice?this.question(a):null
  if(!q||q.id!==questionId)throw new PreviewError('Soal sudah berubah. Muat ulang sesi untuk melanjutkan.',409)
  let correct=false
  if(value!==null){
   if(q.format==='order'){
    if(typeof value!=='string'||value.length>1000)throw new PreviewError('Susunan kata tidak valid.')
    correct=value.trim().replace(/\s+/g,' ')===String(q.answer).trim().replace(/\s+/g,' ')
   }else{
    if(!Number.isInteger(value)||Number(value)<0||Number(value)>=q.options.length)throw new PreviewError('Pilihan jawaban tidak valid.')
    correct=value===q.answer
   }
  }
  const now=this.stamp(),seconds=Math.min(86400,Math.max(0,Math.round((now-a.lastAnswerAt)/1000)));a.lastAnswerAt=now
  a.requests.set(requestId,{questionId,answer:value,practice,correct})
  if(!practice){
   a.answers.push({questionId,aspect:q.aspect,correct,unknown:value===null,seconds})
   if(a.answers.length===(a.kind==='assessment'?8:5)){
    a.score=a.answers.filter(r=>r.correct).length/a.answers.length*100
    a.scores=Object.fromEntries(aspects.filter(aspect=>a.answers.some(r=>r.aspect===aspect)).map(aspect=>{const rows=a.answers.filter(r=>r.aspect===aspect);return [aspect,Math.round(rows.filter(r=>r.correct).length/rows.length*100)]}))
    const previous=this.attempts.filter(p=>p.id!==a.id&&p.lessonId===a.lessonId&&p.status==='completed').at(-1)
    const repeated=a.answers.some(r=>!r.correct&&previous?.answers.some(p=>p.questionId===r.questionId&&!p.correct))
    a.mastered=a.kind==='lesson'&&a.score>=80&&!repeated;a.status='completed';a.completedAt=now
   }
  }
  return {...this.view(a),feedback:{correct}}
 }
}

export class PreviewStore {
 private sessions=new Map<string,{session:PreviewSession,touched:number}>()
 constructor(private clock=Date.now,private lifetime=60*60*1000){}
 private expire(){for(const [id,row]of this.sessions)if(this.clock()-row.touched>=this.lifetime)this.sessions.delete(id)}
 create(owner:string,content:Row,grade:unknown,settings?:unknown){this.expire();if([...this.sessions.values()].filter(r=>r.session.owner===owner).length>=5||this.sessions.size>=100)throw new PreviewError('Tutup sesi pratinjau lama sebelum memulai lagi.',429);const session=new PreviewSession(owner,content,grade,this.clock,settings);this.sessions.set(session.id,{session,touched:this.clock()});return {id:session.id,state:session.state(),catalog:session.catalog()}}
 get(owner:string,id:string){this.expire();const row=this.sessions.get(id);if(!row||row.session.owner!==owner)throw new PreviewError('Pratinjau sudah berakhir. Mulai kembali dari halaman admin.',404);row.touched=this.clock();return row.session}
 remove(owner:string,id:string){this.get(owner,id);this.sessions.delete(id)}
}
