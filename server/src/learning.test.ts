import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'
import { PreviewSession } from './preview.js'

const student = '11111111-1111-4111-8111-111111111111'
const other = '22222222-2222-4222-8222-222222222222'
const admin = '33333333-3333-4333-8333-333333333333'
const migration = (name: string) => readFileSync(new URL('../../supabase/migrations/' + name, import.meta.url),'utf8')

test('learning SQL: persisted server grading, RLS, idempotency, immutable revisions and admin publishing', async t => {
 const db = new PGlite()
 t.after(() => db.close())
 await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
 create table public.learner_profiles(user_id uuid primary key references auth.users(id),name text,grade text,goal text);
 insert into auth.users(id,email) values('${student}','student@example.test'),('${other}','other@example.test'),('${admin}','kevinalmer@apps.ipb.ac.id');
 insert into public.learner_profiles values('${student}','Siswa','SD','Mengenal kata'),('${other}','Siswa B','SD','Mengenal kata'),('${admin}','kevin','SD','Mengenal kata');`)
 for (const name of ['004_learning_platform.sql','004b_admin_content.sql','005_learning_seed.sql','006_first_admin.sql']) await db.exec(migration(name))
 const keys = new Map((await db.query<{question_id:string,answer:unknown}>('select * from private.answer_keys')).rows.map(row => [row.question_id,row.answer]))
 const asUser = async (id: string | null) => { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id || '']); await db.exec(id ? 'set role authenticated' : 'set role anon') }
 const rpc = async (name: string, values: unknown[] = []) => (await db.query<{value:any}>(`select public.${name}(${values.map((_v,i) => '$'+(i+1)).join(',')}) as value`,values)).rows[0].value
 const answer = (attempt: any, choice: unknown, request = crypto.randomUUID(), practice = false) => rpc('bk_answer',[attempt.id,practice ? attempt.practice.id : attempt.question.id,choice === null ? null : JSON.stringify(choice),request,practice])
 await asUser(null)
 const catalog = await rpc('bk_catalog')
 assert.equal(catalog.lessons.length,12); assert.equal(catalog.basicMaterials.length,4)
 assert.ok(!JSON.stringify(catalog).includes('"correct"') && !JSON.stringify(catalog).includes('"answer"'), 'No answer keys in student catalog')
 await assert.rejects(db.query('select * from private.answer_keys'))
 await asUser(student)
 assert.equal(await rpc('bk_is_admin'),false)
 await assert.rejects(rpc('bk_admin_content'))
 await assert.rejects(db.query('insert into public.user_roles(user_id,role) values($1,\'admin\')',[student]))
 await assert.rejects(rpc('bk_start_attempt',['lesson','sd-tumbuhan']))
 let attempt = await rpc('bk_start_attempt',['assessment',null])
 const same = await rpc('bk_start_attempt',['assessment',null]); assert.equal(same.id,attempt.id)
 const first = attempt
 const requestId = crypto.randomUUID()
 attempt = await answer(attempt,keys.get(attempt.question.id),requestId)
 assert.equal(attempt.question.slot,'advanced','Correct first answer selects the advanced branch')
 assert.equal((await rpc('bk_get_attempt',[attempt.id])).id,attempt.id)
 const retried = await answer(first,keys.get(first.question.id),requestId)
 assert.equal(retried.answered,1)
 await assert.rejects(answer(first,null,requestId))
 while (attempt.status==='active') attempt = await answer(attempt,keys.get(attempt.question.id))
 assert.equal(attempt.score,100); assert.equal(attempt.answered,8)
 const state = await rpc('bk_learning_state'); assert.equal(state.attempts.length,1); assert.equal(state.assessment.kosakata,100)
 const originalLesson = await rpc('bk_start_attempt',['lesson','sd-tumbuhan'])
 await asUser(other)
 await assert.rejects(answer(first,keys.get(first.question.id)))
 await assert.rejects(rpc('bk_get_attempt',[first.id]))
 assert.equal((await db.query('select * from public.learning_attempts')).rows.length,0)
 await rpc('bk_import_legacy',[JSON.stringify({assessment:{kosakata:100},mastered:['sd-tumbuhan'],attempts:[{score:100}]})])
 const unverified = await rpc('bk_learning_state'); assert.equal(unverified.assessment,null); assert.deepEqual(unverified.mastered,[]); assert.ok(unverified.legacy)
 await assert.rejects(rpc('bk_start_attempt',['lesson','sd-tumbuhan']))
 let failed = await rpc('bk_start_attempt',['assessment',null])
 failed = await answer(failed,null)
 assert.equal(failed.question.slot,'remedial','Unknown first answer selects the reinforcement branch')
 while(failed.status==='active') failed = await answer(failed,null)
 assert.equal(failed.score,0)
 await assert.rejects(rpc('bk_start_attempt',['lesson','sd-tumbuhan']))
 await asUser(admin)
 assert.equal(await rpc('bk_is_admin'),true)
 const content = await rpc('bk_admin_content')
 // The sandbox must follow the same scoring/adaptive rules as persisted PostgreSQL grading.
 const sandbox=new PreviewSession(admin,content,'SD')
 for(const count of [0,6,7,8]){
  let persisted=await rpc('bk_start_attempt',['assessment',null]),preview=sandbox.start('assessment',null),index=0
  while(persisted.status==='active'){
   assert.equal(preview.question.id,persisted.question.id)
   const choice=index++<count?keys.get(persisted.question.id):null
   preview=sandbox.answer(preview.id,preview.question.id,choice,crypto.randomUUID())
   persisted=await answer(persisted,choice)
  }
  assert.equal(preview.score,persisted.score);assert.deepEqual(preview.scores,persisted.scores)
 }
 for(let pass=0;pass<2;pass++){
  let persisted=await rpc('bk_start_attempt',['lesson','sd-tumbuhan']),preview=sandbox.start('lesson','sd-tumbuhan'),index=0
  while(persisted.status==='active'){
   const choice=index++===0?null:keys.get(persisted.question.id)
   preview=sandbox.answer(preview.id,preview.question.id,choice,crypto.randomUUID());persisted=await answer(persisted,choice)
  }
  assert.equal(preview.score,persisted.score);assert.equal(preview.mastered,persisted.mastered)
 }
 const source = content.lessons.find((l:any) => l.slug==='sd-tumbuhan')
 const basic = content.lessons.find((l:any) => l.kind==='basic')
 await assert.rejects(rpc('bk_admin_save_lesson',[basic.id,JSON.stringify({...basic,data:{videoSrc:'/videos/test.webm'}})]),'Basic slides are required even on direct RPC calls')
 const toQuestion = (q:any) => ({ ...q.data,prompt:q.prompt,options:q.options,answer:q.answer })
 const payload = {slug:source.slug,kind:source.kind,grade:source.grade,aspect:source.aspect,title:'Versi baru tumbuhan',data:source.data,
 practice:toQuestion(source.questions.find((q:any) => q.kind==='practice')),quiz:source.questions.filter((q:any) => q.kind==='quiz').sort((a:any,b:any)=>a.position-b.position).map(toQuestion)}
 const draftId = await rpc('bk_admin_save_lesson',[source.id,JSON.stringify(payload)])
 assert.equal((await rpc('bk_catalog')).lessons.find((l:any)=>l.id==='sd-tumbuhan').title,source.title,'Draft is invisible to learners')
 await rpc('bk_admin_publish',['lesson',draftId])
 const published = (await rpc('bk_catalog')).lessons.find((l:any)=>l.id==='sd-tumbuhan')
 assert.equal(published.title,payload.title); assert.equal(published.version,2)
 await asUser(student)
 let lesson = await rpc('bk_start_attempt',['lesson','sd-tumbuhan'])
 assert.equal(lesson.id,originalLesson.id); assert.equal(lesson.lessonContent.title,source.title,'Active session stays pinned to its original version')
 while (lesson.status==='active') lesson = await answer(lesson,keys.get(lesson.question.id))
 assert.equal(lesson.score,100); assert.equal(lesson.mastered,true)
 const afterLesson = await rpc('bk_learning_state'); assert.deepEqual(afterLesson.mastered,[],'Old-version mastery does not silently master edited content')
 const newLesson = await rpc('bk_start_attempt',['lesson','sd-tumbuhan']); assert.equal(newLesson.lessonContent.version,2)
 assert.equal((await rpc('bk_set_stage',[newLesson.id,2])).stage,2)
 let practice = await answer(newLesson,0,crypto.randomUUID(),true)
 assert.equal(practice.answered,0,'Practice does not increase graded score or question count')
 await db.exec('reset role')
 const refreshedKeys = new Map((await db.query<{question_id:string,answer:any}>('select * from private.answer_keys')).rows.map(row=>[row.question_id,row.answer]))
 await asUser(student)
 let evaluation:any = practice
 const missed = evaluation.question.id
 while(evaluation.status==='active') evaluation = await answer(evaluation,evaluation.question.id===missed?null:refreshedKeys.get(evaluation.question.id))
 assert.equal(evaluation.score,80);assert.equal(evaluation.mastered,true)
 evaluation = await rpc('bk_start_attempt',['lesson','sd-tumbuhan'])
 while(evaluation.status==='active') evaluation = await answer(evaluation,evaluation.question.id===missed?null:refreshedKeys.get(evaluation.question.id))
 assert.equal(evaluation.score,80);assert.equal(evaluation.mastered,false,'Repeated error needs reinforcement despite score 80')
 assert.deepEqual((await rpc('bk_learning_state')).mastered,['sd-tumbuhan'],'A later failed review preserves achieved mastery of the same revision')
 await db.exec('reset role');await db.query("update learner_profiles set grade='SMP' where user_id=$1",[student]);await asUser(student)
 assert.equal((await rpc('bk_learning_state')).assessment,null,'Grade change does not inherit another grade assessment')
 await assert.rejects(rpc('bk_start_attempt',['lesson','smp-percakapan']))
 await db.exec('reset role');await db.query("update learner_profiles set grade='SD' where user_id=$1",[student]);await asUser(student)
 await asUser(admin)
 const q = content.questions.find((q:any)=>q.grade==='SD'&&q.aspect==='kosakata'&&q.slot==='first')
 const newQuestionId = await rpc('bk_admin_save_question',[q.id,JSON.stringify({grade:q.grade,aspect:q.aspect,slot:q.slot,prompt:'Pertanyaan versi baru',visual:'🌱',options:q.options,answer:q.answer})])
 await rpc('bk_admin_publish',['question',newQuestionId])
 await asUser(student)
 const nextAssessment = await rpc('bk_start_attempt',['assessment',null]); assert.equal(nextAssessment.question.id,newQuestionId)
 let fresh = nextAssessment
 while(fresh.status==='active') fresh = await answer(fresh,null)
 assert.deepEqual((await rpc('bk_learning_state')).assessment,{kosakata:0,kalimat:0,bacaan:0,akademik:0},'New assessment supersedes older lesson skill scores')
 await assert.rejects(db.query("update public.learning_attempts set score=100,status='completed' where id=$1",[nextAssessment.id]))
 await db.exec('reset role')
 await assert.rejects(db.query("update public.questions set prompt='Overwrite' where id=$1",[q.id]))
 await assert.rejects(db.query('update private.answer_keys set answer=0 where question_id=$1',[q.id]))
 await db.exec(migration('005_learning_seed.sql'))
 assert.equal((await rpc('bk_catalog')).lessons.length,12,'Seed rerun preserves published admin edits')
 const deployment = readFileSync(new URL('../../supabase/DEPLOY-LEARNING.sql',import.meta.url),'utf8')
 await db.exec(deployment)
 assert.equal((await rpc('bk_catalog')).lessons.find((l:any)=>l.id==='sd-tumbuhan').version,2,'Combined deployment is rerunnable and preserves published content')
 const finalKeys = new Map((await db.query<{question_id:string,answer:unknown}>('select * from private.answer_keys')).rows.map(row=>[row.question_id,row.answer]))
 await asUser(student)
 for(const correctCount of [6,7]){
  let boundary=await rpc('bk_start_attempt',['assessment',null]),index=0
  while(boundary.status==='active')boundary=await answer(boundary,index++<correctCount?finalKeys.get(boundary.question.id):null)
  assert.equal(boundary.score,correctCount/8*100)
  if(correctCount===6)await assert.rejects(rpc('bk_start_attempt',['lesson','sd-kalimat']))
  else assert.equal((await rpc('bk_start_attempt',['lesson','sd-kalimat'])).grade,'SD')
 }
 for(const grade of ['SMP','SMA']){
  await db.exec('reset role');await db.query('update learner_profiles set grade=$2 where user_id=$1',[student,grade]);await asUser(student)
  let graded=await rpc('bk_start_attempt',['assessment',null]);assert.equal(graded.grade,grade)
  while(graded.status==='active')graded=await answer(graded,finalKeys.get(graded.question.id))
  assert.equal(graded.score,100);assert.equal((await rpc('bk_learning_state')).assessment.kosakata,100)
  await assert.rejects(rpc('bk_start_attempt',['lesson','sd-tumbuhan']),'Another grade lesson must remain inaccessible')
 }
})
