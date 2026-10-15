// Test-only Supabase adapter. Real grading/RLS runs in PostgreSQL (PGlite).
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { createApp } from '../server/dist/app.js'
const require=createRequire(new URL('../server/package.json',import.meta.url))
const { PGlite }=require('@electric-sql/pglite')
export async function learningFixture() {
 const db=new PGlite()
 const preferences={textSize:'normal',theme:'light',speed:'1',comfortable:true,contrast:false,language:'default',dataSaver:false}
 const users=['Siswa','Siswa B','kevin','Bu Guru','Orang Tua','Guru Lain'].map((name,i)=>({id:`${i+1}${i+1}${i+1}${i+1}${i+1}${i+1}${i+1}${i+1}-${i+1}${i+1}${i+1}${i+1}-4${i+1}${i+1}${i+1}-8${i+1}${i+1}${i+1}-${String(i+1).repeat(12)}`,email:i===2?'kevinalmer@apps.ipb.ac.id':`student${i}@example.test`,aud:'authenticated',role:'authenticated',app_metadata:{provider:'email',providers:['email']},user_metadata:{name,grade:'SD',goal:'Mengenal kata'},created_at:new Date().toISOString()}))
 const encoded=value=>Buffer.from(JSON.stringify(value)).toString('base64url')
 const sessions=users.map(user=>({user,access_token:encoded({alg:'HS256',typ:'JWT'})+'.'+encoded({sub:user.id,aud:'authenticated',exp:Math.floor(Date.now()/1000)+3600})+'.fixture',refresh_token:'fixture-'+user.id,token_type:'bearer',expires_in:3600}))
 await db.exec(`create role anon;create role authenticated;create schema auth;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to anon,authenticated;grant execute on function auth.uid() to anon,authenticated;
 create table learner_profiles(user_id uuid primary key references auth.users,name text,grade text,goal text,preferences jsonb,avatar_path text);`)
 for(const user of users){await db.query('insert into auth.users(id,email) values($1,$2)',[user.id,user.email]);await db.query('insert into learner_profiles values($1,$2,$3,$4,$5,null)',[user.id,user.user_metadata.name,'SD','Mengenal kata',JSON.stringify(preferences)])}
 for(const name of ['004_learning_platform.sql','004b_admin_content.sql','005_learning_seed.sql','006_first_admin.sql','007_support_dashboards.sql'])await db.exec(readFileSync(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'))
 for(const [index,role] of [[3,'teacher'],[4,'parent'],[5,'teacher']])await db.query('insert into user_roles(user_id,role) values($1,$2)',[users[index].id,role]);
 const keys=new Map((await db.query('select * from private.answer_keys')).rows.map(q=>[q.question_id,q.answer]))
 let queue=Promise.resolve()
 const run=(uid,fn)=>{const pending=queue.then(async()=>{await db.exec('reset role');await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid||'']);await db.exec(uid?'set role authenticated':'set role anon');try{return await fn()}finally{await db.exec('reset role')}});queue=pending.catch(()=>{});return pending}
 const client=token=>{
  const user=sessions.find(s=>s.access_token===token)?.user
  return {auth:{getUser:async()=>({data:{user:user||null},error:user?null:{message:'invalid'}})},rpc:async(name,args={})=>{
   try{if(!/^bk_[a-z_]+$/.test(name)||Object.keys(args).some(k=>!/^p_[a-z_]+$/.test(k)))throw new Error('Invalid fixture RPC');const names=Object.keys(args);const result=await run(user?.id,()=>db.query(`select public.${name}(${names.map((k,i)=>k+' => $'+(i+1)).join(',')}) value`,names.map(k=>args[k]!==null&&(k==='p_answer'||typeof args[k]==='object')?JSON.stringify(args[k]):args[k])));return {data:result.rows[0].value,error:null}}catch(error){return {data:null,error:{code:error.code,message:error.message}}}
  },from:table=>{if(table!=='learner_profiles')throw new Error('Unknown fixture table');let patch=null;const chain={select:()=>chain,eq:()=>chain,update:value=>{patch=value;return chain},single:async()=>{try{const result=await run(user?.id,async()=>{await db.exec('reset role');if(patch)await db.query('update learner_profiles set name=coalesce($2,name),grade=coalesce($3,grade),goal=coalesce($4,goal),preferences=coalesce($5,preferences) where user_id=$1',[user.id,patch.name||null,patch.grade||null,patch.goal||null,patch.preferences?JSON.stringify(patch.preferences):null]);return db.query('select * from learner_profiles where user_id=$1',[user.id])});return {data:result.rows[0],error:null}}catch(e){return {data:null,error:e}}}};return chain}}
 }
 const app=createApp(client)
 const server=app.listen(0,'127.0.0.1');await new Promise(resolve=>server.once('listening',resolve))
 const origin='http://127.0.0.1:'+server.address().port
 return {db,keys,users,sessions,preferences,origin,close:async()=>{await new Promise(resolve=>server.close(resolve));await queue;await db.close()}}
}
