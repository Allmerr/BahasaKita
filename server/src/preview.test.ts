import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { PreviewSession,PreviewStore,PreviewError } from './preview.js'
import { previewContent } from './test-support/preview-content.js'
const finish=(s:PreviewSession,a:any,miss:string|null=null)=>{while(a.status==='active')a=s.answer(a.id,a.question.id,a.question.id===miss?null:1,randomUUID());return a}
test('sandbox exposes only published public content, never answer keys',()=>{
 const content=previewContent();content.lessons.push({...content.lessons[0],status:'draft',id:randomUUID(),slug:'draft-only'})
 const s=new PreviewSession('admin',content,'SD')
 assert.equal(s.catalog().lessons.length,3);assert.ok(!JSON.stringify(s.catalog()).includes('"answer":'))
 assert.equal(s.state().profile.name,'Siswa uji');assert.deepEqual(s.state().attempts,[])
})
test('sandbox assessment resumes, adapts, grades on server and deduplicates requests',()=>{
 const s=new PreviewSession('admin',previewContent(),'SD');const a=s.start('assessment',null),request=randomUUID()
 assert.equal(s.start('assessment',null).id,a.id)
 const b=s.answer(a.id,a.question.id,null,request);assert.equal(b.question.slot,'remedial')
 assert.equal(s.answer(a.id,a.question.id,null,request).answered,1)
 assert.throws(()=>s.answer(a.id,a.question.id,1,request))
 const done=finish(s,b);assert.equal(done.score,87.5);assert.equal(done.answered,8);assert.equal(s.state().attempts.length,1)
 assert.ok(!JSON.stringify(s.get(a.id)).includes('"answer":'))
})
test('sandbox gates lessons, grades practice separately and enforces repeated-error mastery',()=>{
 const s=new PreviewSession('admin',previewContent(),'SD');assert.throws(()=>s.start('lesson','sd-buah'))
 finish(s,s.start('assessment',null))
 let a=s.start('lesson','sd-buah');assert.equal(s.stage(a.id,2).stage,2)
 a=s.answer(a.id,a.practice.id,'Dina  makan mangga',randomUUID(),true);assert.equal(a.feedback.correct,true);assert.equal(a.answered,0)
 const missed=a.question.id;let done=finish(s,a,missed);assert.equal(done.score,80);assert.equal(done.mastered,true)
 done=finish(s,s.start('lesson','sd-buah'),missed);assert.equal(done.score,80);assert.equal(done.mastered,false)
 assert.deepEqual(s.state().mastered,['sd-buah']);assert.throws(()=>s.stage(done.id,3))
})
test('sandbox grade/profile/preferences changes are isolated from source and other sessions',()=>{
 const content=previewContent(),s=new PreviewSession('admin',content,'SD'),other=new PreviewSession('admin',content,'SD')
 finish(s,s.start('assessment',null));s.setProfile({name:'Siswa SMP',grade:'SMP',goal:'Memahami cerita'})
 assert.equal(s.state().assessment,null);assert.equal(other.state().profile.name,'Siswa uji');assert.throws(()=>s.start('lesson','sd-buah'))
 finish(s,s.start('assessment',null));assert.equal(s.start('lesson','smp-buah').grade,'SMP')
 s.setPreferences({...s.state().settings,theme:'dark'});assert.equal(s.state().settings.theme,'dark');assert.equal(other.state().settings.theme,'light')
 assert.equal(content.lessons[0].title,'Mengenal buah')
})
test('sandbox rejects invalid grades, incomplete banks, malformed choices and stale questions',()=>{
 assert.throws(()=>new PreviewSession('admin',previewContent(),'ALL'))
 const content=previewContent();content.questions=[];assert.throws(()=>new PreviewSession('admin',content,'SD').start('assessment',null))
 const s=new PreviewSession('admin',previewContent(),'SD'),a=s.start('assessment',null)
 for(const answer of [undefined,{},true,0.5,-1,99,'one'])assert.throws(()=>s.answer(a.id,a.question.id,answer,randomUUID()))
 assert.throws(()=>s.answer(a.id,randomUUID(),1,randomUUID()),(e:any)=>e.status===409)
 assert.throws(()=>s.get(randomUUID()));assert.throws(()=>s.stage(a.id,4))
})
test('preview store enforces owner, expiry, deletion and active-session bounds',()=>{
 let now=1000;const store=new PreviewStore(()=>now,100),content=previewContent(),record=store.create('admin-a',content,'SD')
 assert.throws(()=>store.get('admin-b',record.id),PreviewError)
 now+=99;assert.equal(store.get('admin-a',record.id).id,record.id);now+=100;assert.throws(()=>store.get('admin-a',record.id))
 const next=store.create('admin-a',content,'SD');store.remove('admin-a',next.id);assert.throws(()=>store.get('admin-a',next.id))
 for(let i=0;i<5;i++)store.create('admin-a',content,'SD');assert.throws(()=>store.create('admin-a',content,'SD'),(e:any)=>e.status===429)
})
