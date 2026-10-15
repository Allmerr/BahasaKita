import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
const id='11111111-1111-4111-8111-111111111111'
async function fixture(t:{after:(fn:()=>Promise<void>)=>void}){
 const calls:{name:string,args:unknown}[]=[]
 const state={admin:false,error:null as null|{code:string,message:string},data:{ok:true} as unknown,catalog:{lessons:[{id:'first',grade:'SD',aspect:'kosakata'},{id:'second',grade:'SD',aspect:'kalimat'}]},learning:{mastered:[] as string[],attempts:[],assessment:{kosakata:80,kalimat:100}}}
 const client={auth:{getUser:async(token:string)=>({data:{user:token==='valid'?{id,email:'test@example.test'}:null},error:null})},rpc:async(name:string,args:unknown)=>{calls.push({name,args});return name==='bk_is_admin'?{data:state.admin,error:null}:{data:state.error?null:name==='bk_catalog'?state.catalog:name==='bk_learning_state'?state.learning:state.data,error:state.error}}}
 const server=createApp(()=>client as unknown as SupabaseClient).listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));t.after(()=>new Promise<void>(resolve=>server.close(()=>resolve())))
 const address=server.address();assert.ok(address&&typeof address!=='string');const origin='http://127.0.0.1:'+address.port
 const request=(path:string,body?:unknown,method=body===undefined?'GET':'POST')=>fetch(origin+path,{method,headers:{Authorization:'Bearer valid','Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})})
 return {state,calls,request,origin}
}
test('catalog is public, account state is authenticated and responses disable caching',async t=>{
 const f=await fixture(t);assert.equal((await fetch(f.origin+'/api/catalog')).status,200)
 const r=await f.request('/api/v1/me/learning');assert.equal(r.status,200);assert.equal(r.headers.get('cache-control'),'no-store')
 assert.equal((await fetch(f.origin+'/api/v1/me/learning')).status,401)
 assert.equal((await fetch(f.origin+'/api/v1/me/learning',{headers:{Authorization:'Bearer forged'}})).status,401)
})
test('lesson starts enforce sequential progress before reaching the grading RPC',async t=>{
 const f=await fixture(t),url='/api/v1/me/learning/attempts'
 assert.equal((await f.request(url,{kind:'lesson',lesson:'second'})).status,403)
 assert.ok(!f.calls.some(c=>c.name==='bk_start_attempt'))
 assert.equal((await f.request(url,{kind:'lesson',lesson:'first'})).status,200)
 f.state.learning.mastered=['first']
 assert.equal((await f.request(url,{kind:'lesson',lesson:'second'})).status,200)
 assert.equal((await f.request(url,{kind:'lesson',lesson:'first'})).status,200)
 assert.equal((await f.request(url,{kind:'lesson',lesson:'unknown'})).status,403)
})
test('all admin endpoints reject a student before any content write',async t=>{
 const f=await fixture(t)
 for(const [path,body] of [['content',undefined],['questions',{}],['lessons',{}],['publish',{}]] as const)assert.equal((await f.request('/api/v1/me/admin/'+path,body)).status,403)
 assert.ok(f.calls.every(c=>c.name==='bk_is_admin'))
})
test('answer endpoint discards forged grading fields and passes only server RPC input',async t=>{
 const f=await fixture(t);const body={questionId:id,answer:2,requestId:id,practice:true,score:100,correct:true,mastered:true,user_id:'other'}
 assert.equal((await f.request('/api/v1/me/learning/attempts/'+id+'/answers',body)).status,200)
 assert.deepEqual(f.calls.at(-1),{name:'bk_answer',args:{p_attempt:id,p_question:id,p_answer:2,p_request:id,p_practice:true}})
})
test('malformed answers, stages, sessions and imports never reach the grading RPC',async t=>{
 const f=await fixture(t),base='/api/v1/me/learning/attempts/'
 for(const answer of [true,{},[],1.5,'a'.repeat(1001)])assert.equal((await f.request(base+id+'/answers',{questionId:id,requestId:id,answer})).status,400)
 assert.equal((await f.request(base+'invalid/answers',{questionId:id,requestId:id,answer:0})).status,400)
 for(const stage of [-1,4,1.5,'1',null])assert.equal((await f.request(base+id+'/stage',{stage},'PATCH')).status,400)
 assert.equal((await f.request('/api/v1/me/learning/attempts',{kind:'unknown'})).status,400)
 assert.equal((await f.request('/api/v1/me/learning/import',[])).status,400)
 assert.equal(f.calls.length,0)
})
test('RPC errors map to useful HTTP codes without exposing internal failure details',async t=>{
 const f=await fixture(t)
 for(const [code,status] of [['42501',403],['40001',409],['P0001',400],['PGRST202',503],['42883',503],['42P01',503],['XX000',503]] as const){f.state.error={code,message:'Internal private diagnostic'};const r=await f.request('/api/v1/me/learning');assert.equal(r.status,status);const data=await r.json();if(status===503)assert.ok(!data.error.includes('Internal private diagnostic'));if(code==='PGRST202')assert.equal(data.code,'learning_not_ready')}
})
test('admin saves normalized draft inputs and explicitly publishes selected revision',async t=>{
 const f=await fixture(t);f.state.admin=true
 assert.equal((await f.request('/api/v1/me/admin/questions',{sourceId:id,payload:{prompt:' Buah? ',visual:'🥭',options:[' Mangga ','Ayam'],answer:0,grade:'SD',aspect:'kosakata',slot:'first'}})).status,200)
 assert.deepEqual(f.calls.at(-1),{name:'bk_admin_save_question',args:{p_source:id,p_payload:{prompt:'Buah?',visual:'🥭',options:['Mangga','Ayam'],answer:0,grade:'SD',aspect:'kosakata',slot:'first'}}})
 assert.equal((await f.request('/api/v1/me/admin/publish',{kind:'lesson',id})).status,200);assert.deepEqual(f.calls.at(-1),{name:'bk_admin_publish',args:{p_kind:'lesson',p_id:id}})
 assert.equal((await f.request('/api/v1/me/admin/publish',{kind:'role',id})).status,400)
})
test('malformed JSON and oversized requests return controlled API errors',async t=>{
 const f=await fixture(t)
 const malformed=await fetch(f.origin+'/api/v1/me/learning/import',{method:'POST',headers:{Authorization:'Bearer valid','Content-Type':'application/json'},body:'{broken'});assert.equal(malformed.status,400)
 const large=await f.request('/api/v1/me/learning/import',{data:'x'.repeat(140000)});assert.equal(large.status,413);assert.equal(f.calls.length,0)
})
