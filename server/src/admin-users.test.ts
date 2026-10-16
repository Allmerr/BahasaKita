import {test} from 'node:test'
import assert from 'node:assert/strict'
import type {SupabaseClient} from '@supabase/supabase-js'
import {createApp} from './app.js'
test('admin user endpoints deny non-admin and validate requests before mutations',async t=>{
 let allowed=false;const calls:string[]=[]
 const client={auth:{getUser:async()=>({data:{user:{id:'owner'}},error:null})},rpc:async(name:string)=>{calls.push(name);return {data:name==='bk_is_admin'?allowed:{users:[],total:0},error:null}}}
 const server=createApp(()=>client as unknown as SupabaseClient).listen(0,'127.0.0.1')
 await new Promise<void>(r=>server.once('listening',r));t.after(()=>new Promise<void>(r=>server.close(()=>r())))
 const address=server.address();assert.ok(address&&typeof address!=='string');const base=`http://127.0.0.1:${address.port}/api/v1/me/admin/users`
 const headers={Authorization:'Bearer valid','Content-Type':'application/json'}
 assert.equal((await fetch(base)).status,401)
 for(const method of ['GET','PATCH','DELETE'])assert.equal((await fetch(base+(method==='GET'?'':'/11111111-1111-4111-8111-111111111111'),{method,headers})).status,403)
 assert.ok(calls.every(c=>c==='bk_is_admin'))
 allowed=true
 assert.equal((await fetch(base+'?page=-1',{headers})).status,400)
 assert.equal((await fetch(base,{headers})).status,200)
 assert.equal((await fetch(base+'/11111111-1111-4111-8111-111111111111',{method:'PATCH',headers,body:JSON.stringify({name:'Demo',grade:'SD',goal:'Mengenal kata',role:'admin'})})).status,400)
 assert.ok(!(calls as string[]).includes('bk_admin_edit_user'))
})

