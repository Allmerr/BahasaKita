import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
const uuid='11111111-1111-4111-8111-111111111111'
test('support HTTP: authentication, narrow RPC inputs, validation and controlled failures',async t=>{
 const calls:any[]=[],state={error:null as any,role:'teacher'}
 const client={auth:{getUser:async()=>({data:{user:{id:uuid}},error:null})},rpc:async(name:string,args:any)=>{calls.push({name,args});return {data:name==='bk_is_admin'?false:name==='bk_support_role'?state.role:{ok:true},error:state.error}}}
 const server=createApp(()=>client as unknown as SupabaseClient).listen(0,'127.0.0.1');await new Promise<void>(resolve=>server.once('listening',resolve));t.after(()=>new Promise<void>(resolve=>server.close(()=>resolve())))
 const address=server.address();assert.ok(address&&typeof address!=='string');const origin='http://127.0.0.1:'+address.port
 const request=(path:string,body?:unknown,method=body===undefined?'GET':'POST')=>fetch(origin+'/api/v1/me'+path,{method,headers:{Authorization:'Bearer valid','Content-Type':'application/json'},...(body!==undefined?{body:JSON.stringify(body)}:{})})
 assert.equal((await fetch(origin+'/api/v1/me/support/dashboard')).status,401)
 assert.deepEqual(await (await request('/access')).json(),{isAdmin:false,role:'teacher',supportReady:true})
 await request('/support/notes',{studentId:uuid,body:' Arahan ',requestId:uuid,teacherId:'forged',role:'admin'});assert.deepEqual(calls.at(-1),{name:'bk_add_support_note',args:{p_student:uuid,p_body:'Arahan',p_request:uuid}})
 await request('/support/assignments',{studentId:uuid,lessonId:uuid,title:' Tugas ',instructions:' Contoh ',requestId:uuid,dueAt:null,completed:true});assert.deepEqual(calls.at(-1),{name:'bk_assign_support_lesson',args:{p_student:uuid,p_lesson:uuid,p_title:'Tugas',p_instructions:'Contoh',p_due:null,p_request:uuid}})
 await request('/support/redeem',{code:'aaaa-aaaa aaaaaaaa aaaaaaaa aaaaaaaa'});assert.equal(calls.at(-1).args.p_code,'A'.repeat(32))
 await request('/support/chat/'+uuid,{body:' Halo ',requestId:uuid,senderId:'forged'});assert.deepEqual(calls.at(-1),{name:'bk_chat_send',args:{p_link:uuid,p_body:'Halo',p_request:uuid}})
 await request('/support/chat/'+uuid+'?before=25');assert.deepEqual(calls.at(-1),{name:'bk_chat_messages',args:{p_link:uuid,p_before:'25'}})
 assert.equal((await request('/support/chat/'+uuid+'?before=invalid')).status,400)
 assert.equal((await request('/support/chat/'+uuid,{body:' ',requestId:uuid})).status,400)
 const count=calls.length
 for(const [path,body] of [['/support/redeem',{code:'bad'}],['/support/invites',{kind:'admin'}],['/support/notes',{studentId:uuid,body:' ',requestId:uuid}],['/support/assignments',{studentId:uuid,lessonId:uuid,title:'Tugas',instructions:[],requestId:uuid}],['/support/assignments',{studentId:uuid,lessonId:uuid,title:'Tugas',requestId:uuid,dueAt:1}]] as const)assert.equal((await request(path,body)).status,400)
 assert.equal((await request('/support/students/invalid')).status,400);assert.equal((await request('/support/links/invalid',undefined,'DELETE')).status,400);assert.equal(calls.length,count)
 assert.equal((await request('/admin/support/roles',{email:'a@b.test',role:'teacher'})).status,403)
 state.error={code:'42501',message:'Siswa belum terhubung.'};assert.equal((await request('/support/students/'+uuid)).status,403)
 state.error={code:'PGRST202',message:'Internal missing function'};const missing=await request('/support');assert.equal(missing.status,503);assert.equal((await missing.json()).code,'support_not_ready')
 state.error={code:'XX000',message:'Internal private detail'};const failed=await request('/support');assert.equal(failed.status,503);assert.ok(!(await failed.text()).includes('Internal'))
})
