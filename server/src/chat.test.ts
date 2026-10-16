import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {PGlite} from '@electric-sql/pglite'
test('chat SQL: private pairs, duplicate retries, history pagination and revoked links',async t=>{
 const db=new PGlite();t.after(()=>db.close())
 const student=crypto.randomUUID(),teacher=crypto.randomUUID(),parent=crypto.randomUUID(),stranger=crypto.randomUUID(),link=crypto.randomUUID(),otherLink=crypto.randomUUID()
 await db.exec(`create role anon;create role authenticated;create schema auth;create schema private;
 create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to authenticated,anon;
 create table public.support_links(id uuid primary key,student_id uuid,supporter_id uuid,revoked_at timestamptz);
 create function private.support_linked(s uuid,p uuid) returns boolean language sql stable as $$select exists(select 1 from public.support_links where student_id=s and supporter_id=p and revoked_at is null)$$;`)
 for(const id of [student,teacher,parent,stranger])await db.query('insert into auth.users values($1)',[id])
 await db.query('insert into support_links values($1,$2,$3,null),($4,$2,$5,null)',[link,student,teacher,otherLink,parent])
 const migration=readFileSync(new URL('../../supabase/migrations/010_support_chat.sql',import.meta.url),'utf8')
 await db.exec(migration);await db.exec(migration)
 const asUser=async(id:string|null)=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id||'']);await db.exec(id?'set role authenticated':'set role anon')}
 const rpc=async(name:string,args:unknown[])=> (await db.query<{v:any}>(`select public.${name}(${args.map((_,i)=>'$'+(i+1)).join(',')}) v`,args)).rows[0].v
 await asUser(student);const key=crypto.randomUUID(),sent=await rpc('bk_chat_send',[link,'Halo guru',key])
 assert.equal((await rpc('bk_chat_send',[link,'Halo guru',key])).id,sent.id)
 await assert.rejects(rpc('bk_chat_send',[link,'Pesan lain',key]))
 await assert.rejects(rpc('bk_chat_send',[link,' '.repeat(3),crypto.randomUUID()]))
 await assert.rejects(rpc('bk_chat_send',[link,'a'.repeat(2001),crypto.randomUUID()]))
 await assert.rejects(db.query('select * from support_messages'))
 await asUser(teacher);assert.equal((await rpc('bk_chat_messages',[link])).messages[0].sender_id,student)
 await rpc('bk_chat_send',[link,'Halo murid',crypto.randomUUID()])
 for(const id of [parent,stranger,null]){await asUser(id);await assert.rejects(rpc('bk_chat_messages',[link]));await assert.rejects(rpc('bk_chat_send',[link,'Tidak boleh',crypto.randomUUID()]))}
 await asUser(student);assert.deepEqual((await rpc('bk_chat_messages',[otherLink])).messages,[])
 for(let i=0;i<55;i++)await rpc('bk_chat_send',[link,'Pesan '+i,crypto.randomUUID()])
 const latest=await rpc('bk_chat_messages',[link]);assert.equal(latest.messages.length,50);assert.equal(latest.hasOlder,true)
 const older=await rpc('bk_chat_messages',[link,latest.messages[0].id]);assert.equal(older.messages.length,7);assert.equal(older.hasOlder,false)
 await db.exec('reset role');await db.query('update support_links set revoked_at=now() where id=$1',[link])
 for(const id of [student,teacher]){await asUser(id);await assert.rejects(rpc('bk_chat_messages',[link]));await assert.rejects(rpc('bk_chat_send',[link,'Sudah putus',crypto.randomUUID()]))}
})
