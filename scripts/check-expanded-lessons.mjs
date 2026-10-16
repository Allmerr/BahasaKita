import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import {expandedLessons} from '../content/expanded-lessons.js'
const require=createRequire(new URL('../server/package.json',import.meta.url))
const {PGlite}=require('@electric-sql/pglite')
test('expanded catalog covers every grade/aspect with complete and varied questions',()=>{
 for(const grade of ['SD','SMP','SMA'])for(const aspect of ['kosakata','kalimat','bacaan','akademik'])assert.equal(expandedLessons.filter(l=>l.grade===grade&&l.aspect===aspect).length,2)
 for(const l of expandedLessons){assert.ok(l.explanation.length>100);assert.ok(l.tip);assert.equal(l.quiz.length,5);assert.equal(l.wordEntry,null);for(const q of [l.practice,...l.quiz]){assert.equal(new Set(q.options).size,3);assert.ok(q.options[q.correct]);assert.ok(q.prompt)}}
})
test('SQL release is repeatable, keeps old content, and hides keys from public catalog',async t=>{
 const db=new PGlite();t.after(()=>db.close())
 await db.exec(`create role anon;create role authenticated;create schema auth;
 create table auth.users(id uuid primary key,email text);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;
 create table learner_profiles(user_id uuid primary key,name text,grade text,goal text);`)
 const sql=name=>readFileSync(new URL('../supabase/migrations/'+name,import.meta.url),'utf8')
 for(const name of ['004_learning_platform.sql','004b_admin_content.sql','005_learning_seed.sql'])await db.exec(sql(name))
 const before=(await db.query('select id,title,data from lessons order by id')).rows
 await db.exec(sql('011_expanded_lessons.sql'));await db.exec(sql('011_expanded_lessons.sql'))
 assert.equal((await db.query("select count(*)::int n from lessons where kind='lesson'")).rows[0].n,36)
 assert.equal((await db.query("select count(*)::int n from questions where logical_key like '%-tambahan-%'")).rows[0].n,144)
 for(const row of before)assert.deepEqual((await db.query('select id,title,data from lessons where id=$1',[row.id])).rows[0],row)
 const questions=(await db.query("select q.options,k.answer from questions q join private.answer_keys k on k.question_id=q.id where q.logical_key like '%-tambahan-%'")).rows
 for(const q of questions)assert.ok(q.options[q.answer])
 await db.exec('set role anon')
 const catalog=(await db.query('select bk_catalog() catalog')).rows[0].catalog
 assert.equal(catalog.lessons.length,36)
 assert.ok(!JSON.stringify(catalog).includes('"correct"'))
 await assert.rejects(db.query('select * from private.answer_keys'))
 // Exercise real database grading for every added lesson and every grade.
 await db.exec('reset role')
 const keys=new Map((await db.query('select * from private.answer_keys')).rows.map(k=>[k.question_id,k.answer]))
 const rpc=async(name,args=[])=> (await db.query(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) v`,args)).rows[0].v
 for(const grade of ['SD','SMP','SMA']){
  const uid=crypto.randomUUID();await db.exec('reset role')
  await db.query('insert into auth.users(id) values($1)',[uid]);await db.query('insert into learner_profiles values($1,$2,$3,$4)',[uid,'Uji materi',grade,'Mengenal kata'])
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]);await db.exec('set role authenticated')
  let attempt=await rpc('bk_start_attempt',['assessment',null])
  while(attempt.status==='active')attempt=await rpc('bk_answer',[attempt.id,attempt.question.id,JSON.stringify(keys.get(attempt.question.id)),crypto.randomUUID(),false])
  assert.equal(attempt.score,100)
  for(const lesson of expandedLessons.filter(l=>l.grade===grade)){
   attempt=await rpc('bk_start_attempt',['lesson',lesson.id])
   while(attempt.status==='active')attempt=await rpc('bk_answer',[attempt.id,attempt.question.id,JSON.stringify(keys.get(attempt.question.id)),crypto.randomUUID(),false])
   assert.equal(attempt.score,100,lesson.title);assert.equal(attempt.mastered,true,lesson.title)
  }
 }
})
