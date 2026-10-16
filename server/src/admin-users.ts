import type { Express } from 'express'
import type { SupabaseClient } from '@supabase/supabase-js'
import { profileInput } from './validation.js'
import { AVATAR_BUCKET } from './avatar.js'
export function installAdminUsers(app: Express, admin?: SupabaseClient) {
 app.use('/api/v1/me/admin/users', async (_req,res,next) => {
  const {data,error}=await res.locals.client.rpc('bk_is_admin')
  if(error){res.status(503).json({error:'Hak akses belum dapat diperiksa.'});return}
  if(data!==true){res.status(403).json({error:'Hanya admin dapat mengelola akun.'});return}
  next()
 })
 app.get('/api/v1/me/admin/users',async(req,res)=>{
  const page=Number(req.query.page||1),search=String(req.query.search||'').trim()
  if(!Number.isSafeInteger(page)||page<1||page>100000||search.length>100){res.status(400).json({error:'Filter tidak valid.'});return}
  const {data,error}=await res.locals.client.rpc('bk_admin_users',{p_search:search,p_page:page})
  if(error){res.status(503).json({error:'Daftar akun belum tersedia. Pastikan migrasi 009 sudah dijalankan.'});return}
  res.json(data)
 })
 app.patch('/api/v1/me/admin/users/:id',async(req,res)=>{
  let profile
  try{profile=profileInput(req.body);if(!/^[\da-f-]{36}$/i.test(String(req.params.id))||!['student','teacher','parent'].includes(req.body.role))throw Error('Peran atau ID tidak valid.')}
  catch(e){res.status(400).json({error:(e as Error).message});return}
  const {data,error}=await res.locals.client.rpc('bk_admin_edit_user',{p_id:req.params.id,p_name:profile.name,p_grade:profile.grade,p_goal:profile.goal,p_role:req.body.role})
  if(error){res.status(error.code==='42501'?403:400).json({error:'Perubahan ditolak. Akun admin dilindungi; putuskan hubungan pendamping aktif sebelum mengganti peran.'});return}
  res.json(data)
 })
 app.delete('/api/v1/me/admin/users/:id',async(req,res)=>{
  const id=String(req.params.id)
  if(!/^[\da-f-]{36}$/i.test(id)||req.body?.confirmation!=='HAPUS AKUN'){res.status(400).json({error:'Konfirmasi penghapusan tidak valid.'});return}
  if(!admin){res.status(503).json({error:'Penghapusan belum dikonfigurasi.'});return}
  const role=await admin.from('user_roles').select('role').eq('user_id',id).maybeSingle()
  if(role.error){res.status(503).json({error:'Peran akun belum dapat diperiksa.'});return}
  if(id===res.locals.user.id||role.data?.role==='admin'){res.status(403).json({error:'Akun sendiri dan akun admin tidak dapat dihapus di sini.'});return}
  const target=await admin.auth.admin.getUserById(id)
  if(target.error||!target.data.user){res.status(404).json({error:'Akun tidak ditemukan.'});return}
  while(true){
   const files=await admin.storage.from(AVATAR_BUCKET).list(id,{limit:100})
   if(files.error){res.status(503).json({error:'Foto belum dapat dibersihkan.'});return}
   const paths=(files.data||[]).filter(f=>f.id).map(f=>`${id}/${f.name}`)
   if(!paths.length)break
   const removed=await admin.storage.from(AVATAR_BUCKET).remove(paths)
   if(removed.error){res.status(503).json({error:'Foto belum dapat dibersihkan.'});return}
  }
  const result=await admin.auth.admin.deleteUser(id)
  if(result.error){res.status(503).json({error:'Akun belum dihapus. Foto mungkin sudah dibersihkan; coba lagi.'});return}
  res.json({deleted:true})
 })
}
