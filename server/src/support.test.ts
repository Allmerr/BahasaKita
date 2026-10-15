import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'

test('support SQL: consent, scoped progress, teacher tasks/notes and parent access',async t=>{
 const db=new PGlite();t.after(()=>db.close())
 const users=Array.from({length:6},(_,i)=>`${String(i+1).repeat(8)}-${String(i+1).repeat(4)}-4${String(i+1).repeat(3)}-8${String(i+1).repeat(3)}-${String(i+1).repeat(12)}`)
 const [student,other,admin,teacher,parent,stranger]=users
 await db.exec(`create role anon;create role authenticated;create schema auth;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;
 create table learner_profiles(user_id uuid primary key references auth.users,name text,grade text,goal text);`)
 for(let i=0;i<users.length;i++){await db.query('insert into auth.users(id,email) values($1,$2)',[users[i],i===2?'kevinalmer@apps.ipb.ac.id':`user${i}@example.test`]);await db.query("insert into learner_profiles values($1,$2,'SD','Mengenal kata')",[users[i],'User '+i])}
 const migration=(name:string)=>readFileSync(new URL('../../supabase/migrations/'+name,import.meta.url),'utf8')
 for(const name of ['004_learning_platform.sql','004b_admin_content.sql','005_learning_seed.sql','006_first_admin.sql','007_support_dashboards.sql'])await db.exec(migration(name))
 await db.exec(migration('007_support_dashboards.sql'))
 const asUser=async(id:string|null)=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id||'']);await db.exec(id?'set role authenticated':'set role anon')}
 const rpc=async(name:string,args:unknown[]=[])=> (await db.query<{v:any}>(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) v`,args)).rows[0].v
 let invitation:any,parentInvite:any,link:any,task:string,note:string,lesson:any
 const request=crypto.randomUUID(),noteRequest=crypto.randomUUID()
 await t.test('only admin provisions accounts; signup metadata cannot grant admin',async()=>{
  await asUser(student);await assert.rejects(rpc('bk_admin_set_support_role',['user3@example.test','teacher']))
  await asUser(admin);await rpc('bk_admin_set_support_role',[' USER3@EXAMPLE.TEST ','teacher']);await rpc('bk_admin_set_support_role',['user4@example.test','parent']);await rpc('bk_admin_set_support_role',['user5@example.test','teacher'])
  await assert.rejects(rpc('bk_admin_set_support_role',['user3@example.test','admin']));await assert.rejects(rpc('bk_admin_set_support_role',['kevinalmer@apps.ipb.ac.id','student']))
  await db.exec('reset role');for(const requested of ['admin','teacher','parent']){const id=crypto.randomUUID();await db.query('insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)',[id,id+'@example.test',JSON.stringify({role:requested})]);assert.equal((await db.query<{role:string}>('select role from user_roles where user_id=$1',[id])).rows[0].role,requested==='admin'?'student':requested)}
  await asUser(null);await assert.rejects(rpc('bk_support_role'))
 })
 await t.test('invitations are private, single use, role-bound, revocable and expire',async()=>{
  await asUser(student);const old=await rpc('bk_create_support_invite',['teacher']);invitation=await rpc('bk_create_support_invite',['teacher']);parentInvite=await rpc('bk_create_support_invite',['parent'])
  assert.match(invitation.code,/^[A-F0-9]{32}$/);assert.ok(!JSON.stringify(await rpc('bk_student_support')).includes(invitation.code));await assert.rejects(db.query('select * from support_invites'))
  await asUser(parent);await assert.rejects(rpc('bk_redeem_support_invite',[invitation.code]));await asUser(teacher);await assert.rejects(rpc('bk_redeem_support_invite',[old.code]));await assert.rejects(rpc('bk_support_student',[student]));link=await rpc('bk_redeem_support_invite',[invitation.code]);await assert.rejects(rpc('bk_redeem_support_invite',[invitation.code]));await assert.rejects(rpc('bk_create_support_invite',['teacher']))
  await asUser(parent);await rpc('bk_redeem_support_invite',[parentInvite.code]);await asUser(other);const expired=await rpc('bk_create_support_invite',['teacher']),revoked=await rpc('bk_create_support_invite',['parent']);await rpc('bk_revoke_support_invite',[revoked.id]);await db.exec('reset role');await db.query("update support_invites set expires_at=now()-interval '1 second' where id=$1",[expired.id]);await asUser(stranger);await assert.rejects(rpc('bk_redeem_support_invite',[expired.code]));await asUser(parent);await assert.rejects(rpc('bk_redeem_support_invite',[revoked.code]))
 })
 await t.test('rosters/progress expose only linked students, with no keys, email or profile editing',async()=>{
  await asUser(teacher);assert.equal((await rpc('bk_support_dashboard')).students[0].id,student);const detail=await rpc('bk_support_student',[student]);assert.equal(detail.assessmentScore,null);assert.equal(detail.totalLessons,4);assert.ok(!/answer|email|avatar|preferences/i.test(JSON.stringify(detail)))
  await assert.rejects(rpc('bk_support_student',[other]));await assert.rejects(db.query('select * from private.answer_keys'));await assert.rejects(db.query("update learner_profiles set name='forged'"));await asUser(parent);assert.equal((await rpc('bk_support_student',[student])).id,student);await asUser(stranger);assert.deepEqual((await rpc('bk_support_dashboard')).students,[]);await assert.rejects(rpc('bk_support_student',[student]))
 })
 await t.test('only linked teachers create published same-grade tasks/notes; retries are idempotent',async()=>{
  await asUser(teacher);const catalog=await rpc('bk_catalog');lesson=catalog.lessons.find((l:any)=>l.id==='sd-tumbuhan');const args=[student,lesson.versionId,'Latihan tumbuhan','Cocokkan kata dan gambar.',null,request]
  task=await rpc('bk_assign_support_lesson',args);assert.equal(await rpc('bk_assign_support_lesson',args),task);await assert.rejects(rpc('bk_assign_support_lesson',[student,lesson.versionId,'Berbeda','',null,request]));await assert.rejects(rpc('bk_assign_support_lesson',[other,lesson.versionId,'Tugas','',null,crypto.randomUUID()]));await assert.rejects(rpc('bk_assign_support_lesson',[student,catalog.lessons.find((l:any)=>l.grade==='SMP').versionId,'Tugas','',null,crypto.randomUUID()]));await assert.rejects(rpc('bk_assign_support_lesson',[student,lesson.versionId,'Tugas','','2000-01-01T00:00:00Z',crypto.randomUUID()]))
  note=await rpc('bk_add_support_note',[student,'Perhatikan urutan kegiatan.',noteRequest]);assert.equal(await rpc('bk_add_support_note',[student,'Perhatikan urutan kegiatan.',noteRequest]),note);await assert.rejects(rpc('bk_add_support_note',[student,'Berbeda',noteRequest]))
  await asUser(parent);await assert.rejects(rpc('bk_assign_support_lesson',args));await assert.rejects(rpc('bk_add_support_note',[student,'Catatan palsu',crypto.randomUUID()]));await assert.rejects(rpc('bk_delete_support_note',[note]));await assert.rejects(rpc('bk_withdraw_support_assignment',[task]));assert.equal((await rpc('bk_support_student',[student])).notes.length,1)
  await asUser(student);const data=await rpc('bk_student_support');assert.equal(data.links.length,2);assert.equal(data.assignments[0].id,task);assert.equal(data.assignments[0].completedAt,null)
 })
 await t.test('completion requires real server-graded mastery and updates supporter progress',async()=>{
  await db.exec('reset role');const keys=new Map((await db.query<{question_id:string,answer:unknown}>('select * from private.answer_keys')).rows.map(r=>[r.question_id,r.answer]));await asUser(student)
  let a=await rpc('bk_start_attempt',['assessment',null]);while(a.status==='active')a=await rpc('bk_answer',[a.id,a.question.id,JSON.stringify(keys.get(a.question.id)),crypto.randomUUID(),false]);a=await rpc('bk_start_attempt',['lesson','sd-tumbuhan']);while(a.status==='active')a=await rpc('bk_answer',[a.id,a.question.id,JSON.stringify(keys.get(a.question.id)),crypto.randomUUID(),false])
  assert.ok((await rpc('bk_student_support')).assignments[0].completedAt);await asUser(teacher);const data=await rpc('bk_support_student',[student]);assert.equal(data.mastered,1);assert.equal(data.scores.kosakata,100);assert.equal(data.history.length,2);assert.ok(data.difficulties.length);assert.ok(data.assignments[0].completedAt)
 })
 await t.test('only authors remove notes/tasks; active relationships prevent role changes',async()=>{
  await asUser(stranger);await assert.rejects(rpc('bk_delete_support_note',[note]));await assert.rejects(rpc('bk_withdraw_support_assignment',[task]));await assert.rejects(rpc('bk_unlink_support',[link.id]));await asUser(admin);await assert.rejects(rpc('bk_admin_set_support_role',['user3@example.test','parent']));await asUser(teacher);await rpc('bk_delete_support_note',[note]);await rpc('bk_withdraw_support_assignment',[task]);const s=await rpc('bk_support_student',[student]);assert.equal(s.notes.length,0);assert.equal(s.assignments.length,0)
 })
 await t.test('unlink immediately removes access; rejoining requires a fresh student invitation',async()=>{
  await asUser(student);await rpc('bk_unlink_support',[link.id]);assert.equal((await rpc('bk_student_support')).links.length,1);await asUser(teacher);assert.deepEqual((await rpc('bk_support_dashboard')).students,[]);await assert.rejects(rpc('bk_support_student',[student]));await assert.rejects(rpc('bk_add_support_note',[student,'Old access',crypto.randomUUID()]));await assert.rejects(rpc('bk_redeem_support_invite',[invitation.code]));await asUser(student);const fresh=await rpc('bk_create_support_invite',['teacher']);await asUser(teacher);await rpc('bk_redeem_support_invite',[fresh.code]);assert.equal((await rpc('bk_support_dashboard')).students.length,1)
 })
})
