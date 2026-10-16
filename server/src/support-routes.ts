import type { Express, Response } from 'express'
import { id, object, text } from './learning-validation.js'

async function rpc(res:Response,name:string,args:Record<string,unknown>={}) {
 const {data,error}=await res.locals.client.rpc(name,args)
 if(error){
  const missing=['PGRST202','42883','42P01'].includes(error.code)
  const status=error.code==='42501'?403:error.code==='P0001'||error.code==='22007'||error.code==='22008'?400:error.code==='23505'||error.code==='40001'?409:503
  res.status(missing?503:status).json({error:missing?(name.startsWith('bk_chat_')?'Chat belum diaktifkan. Hubungi admin untuk menjalankan migrasi 010.':'Fitur pendampingan belum diaktifkan. Hubungi admin untuk menjalankan migrasi 007.'):status===503?'Data pendampingan belum dapat diproses. Coba kembali.':error.message,code:missing?'support_not_ready':undefined});return
 }
 res.json(data)
}
export function installSupportRoutes(app:Express){
 const route=(method:'get'|'post'|'delete',path:string,name:string,parse:(req:any)=>Record<string,unknown>=()=>({}))=>{
  app[method]('/api/v1/me'+path,async(req,res)=>{try{await rpc(res,name,parse(req))}catch(e){res.status(400).json({error:(e as Error).message})}})
 }
 route('get','/support','bk_student_support')
 route('get','/support/chat/:id','bk_chat_messages',req=>{
  const before=req.query.before
  if(before!==undefined&&(typeof before!=='string'||!/^\d{1,18}$/.test(before)))throw new Error('Posisi pesan tidak valid.')
  return {p_link:id(req.params.id),p_before:before||null}
 })
 route('post','/support/chat/:id','bk_chat_send',req=>{
  const p=object(req.body);return {p_link:id(req.params.id),p_body:text(p.body,2000),p_request:id(p.requestId)}
 })
 route('get','/support/dashboard','bk_support_dashboard')
 route('get','/support/students/:id','bk_support_student',req=>({p_student:id(req.params.id)}))
 route('post','/support/invites','bk_create_support_invite',req=>{
  const p=object(req.body);if(!['teacher','parent'].includes(p.kind))throw new Error('Pilih pendamping guru atau orang tua.');return {p_kind:p.kind}
 })
 route('post','/support/redeem','bk_redeem_support_invite',req=>{
  const code=text(object(req.body).code,64).replace(/[\s-]/g,'').toUpperCase();if(!/^[A-F0-9]{32}$/.test(code))throw new Error('Kode undangan terdiri dari 32 huruf dan angka.');return {p_code:code}
 })
 route('delete','/support/invites/:id','bk_revoke_support_invite',req=>({p_id:id(req.params.id)}))
 route('delete','/support/links/:id','bk_unlink_support',req=>({p_id:id(req.params.id)}))
 route('post','/support/assignments','bk_assign_support_lesson',req=>{
  const p=object(req.body);let due:string|null=null
  if(p.dueAt!==null&&p.dueAt!==undefined&&p.dueAt!==''){
   if(typeof p.dueAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(p.dueAt)||!Number.isFinite(Date.parse(p.dueAt)))throw new Error('Tenggat tugas belum valid.')
   due=new Date(p.dueAt).toISOString()
  }
  return {p_student:id(p.studentId),p_lesson:id(p.lessonId),p_title:text(p.title,160),p_instructions:text(p.instructions,2000,true),p_due:due,p_request:id(p.requestId)}
 })
 route('delete','/support/assignments/:id','bk_withdraw_support_assignment',req=>({p_id:id(req.params.id)}))
 route('post','/support/notes','bk_add_support_note',req=>{
  const p=object(req.body);return {p_student:id(p.studentId),p_body:text(p.body,2000),p_request:id(p.requestId)}
 })
 route('delete','/support/notes/:id','bk_delete_support_note',req=>({p_id:id(req.params.id)}))
 // SQL checks the admin role as well; a caller cannot promote themselves or create an admin.
 route('post','/admin/support/roles','bk_admin_set_support_role',req=>{
  const p=object(req.body),email=text(p.email,254).toLowerCase()
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['student','teacher','parent'].includes(p.role))throw new Error('Isi email dan peran yang valid.')
  return {p_email:email,p_role:p.role}
 })
}
