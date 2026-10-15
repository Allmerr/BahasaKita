import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
import { previewContent } from './test-support/preview-content.js'
test('admin preview API grades without writing learner tables; students and foreign admins cannot access it',async t=>{
 const calls:string[]=[],content=previewContent()
 const app=createApp(token=>({auth:{getUser:async()=>({data:{user:token?{id:token,email:token+'@test.example'}:null},error:null})},rpc:async(name:string)=>{calls.push(name);return {data:name==='bk_is_admin'?token.startsWith('admin'):content,error:null}},from:()=>{throw new Error('Sandbox must not access profile/learning tables')},storage:{from:()=>{throw new Error('Sandbox must not upload to Storage')}}} as unknown as SupabaseClient))
 const server=app.listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));t.after(()=>new Promise<void>(resolve=>server.close(()=>resolve())))
 const address=server.address();assert.ok(address&&typeof address!=='string');const base='http://127.0.0.1:'+address.port+'/api/v1/me/admin/preview'
 const request=(token:string,path='',body?:unknown,method=body?'POST':'GET')=>fetch(base+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})})
 assert.equal((await request('student','',{grade:'SD'})).status,403)
 const response=await request('admin-a','',{grade:'SD'});assert.equal(response.status,200);const record=await response.json()
 assert.equal(record.state.profile.name,'Siswa uji');assert.ok(!JSON.stringify(record).includes('"answer":'))
 assert.equal((await request('admin-b','/'+record.id)).status,404)
 let a=await (await request('admin-a','/'+record.id+'/learning/attempts',{kind:'assessment'})).json()
 for(let n=0;n<8;n++){const r=await request('admin-a','/'+record.id+'/learning/attempts/'+a.id+'/answers',{questionId:a.question.id,answer:1,requestId:crypto.randomUUID(),correct:false,score:0});assert.equal(r.status,200);a=await r.json()}
 assert.equal(a.score,100)
 const state=await (await request('admin-a','/'+record.id+'/learning')).json();assert.equal(state.attempts.length,1)
 assert.equal((await request('admin-a','/'+record.id,undefined,'DELETE')).status,200)
 assert.equal((await request('admin-a','/'+record.id)).status,404)
 assert.ok(calls.every(name=>['bk_is_admin','bk_admin_content'].includes(name)),'No persisted grading/profile RPC may be called')
})
