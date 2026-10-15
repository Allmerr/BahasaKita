import type { Express, Response } from 'express'
import type { SupabaseClient } from '@supabase/supabase-js'

import { id, object, text, questionPayload, lessonPayload } from './learning-validation.js'
import { installPreviewRoutes } from './preview-routes.js'

async function run(res:Response,name:string,args:Record<string,unknown>={}) {
 const {data,error}=await res.locals.client.rpc(name,args)
 if (error) {
  const missing=['PGRST202','42883','42P01'].includes(error.code)
  const status=error.code==='42501'?403:error.code==='40001'?409:error.code==='P0001'?400:503
  res.status(missing?503:status).json({error:missing?'Fitur belajar online belum disiapkan. Hubungi pengelola aplikasi.':status===503?'Data belajar belum dapat diproses. Coba kembali.':error.message,code:missing?'learning_not_ready':undefined})
  return
 }
 res.json(data)
}
export function installLearningRoutes(app:Express,clientForToken:(token:string)=>SupabaseClient) {
 app.get('/api/catalog',async (_req,res)=>{res.locals.client=clientForToken('');res.setHeader('Cache-Control','no-store');await run(res,'bk_catalog')})
 app.get('/api/v1/me/access',async (_req,res)=>{
  const {data,error}=await res.locals.client.rpc('bk_is_admin')
  if (error) {res.status(503).json({error:'Hak akses akun belum dapat dimuat. Coba lagi.'});return}
  const role=await res.locals.client.rpc('bk_support_role')
  if(role.error&&!['PGRST202','42883','42P01'].includes(role.error.code)){res.status(503).json({error:'Hak akses akun belum dapat dimuat. Coba lagi.'});return}
  if(!role.error&&!['student','teacher','parent','admin'].includes(role.data)){res.status(503).json({error:'Hak akses akun belum dapat dimuat. Coba lagi.'});return}
  res.json({isAdmin:data===true,role:data===true?'admin':role.error?'student':role.data,supportReady:!role.error})
 })
 app.get('/api/v1/me/learning',async (_req,res)=>{await run(res,'bk_learning_state')})
 app.post('/api/v1/me/learning/import',async(req,res)=>{
  try {object(req.body);if (JSON.stringify(req.body).length>100000) throw new Error('Arsip perangkat terlalu besar.');await run(res,'bk_import_legacy',{p_payload:req.body})}catch(error){res.status(400).json({error:(error as Error).message})}
 })
 app.post('/api/v1/me/learning/attempts',async(req,res)=>{
  try {const p=object(req.body);if(!['assessment','lesson'].includes(p.kind))throw new Error('Jenis sesi tidak valid.');await run(res,'bk_start_attempt',{p_kind:p.kind,p_lesson:p.kind==='lesson'?text(p.lesson,100):null})}catch(error){res.status(400).json({error:(error as Error).message})}
 })
 app.get('/api/v1/me/learning/attempts/:id',async(req,res)=>{try{await run(res,'bk_get_attempt',{p_attempt:id(req.params.id)})}catch(error){res.status(400).json({error:(error as Error).message})}})
 app.post('/api/v1/me/learning/attempts/:id/answers',async(req,res)=>{
  try {const p=object(req.body);if(p.answer!==null&&!Number.isInteger(p.answer)&&typeof p.answer!=='string')throw new Error('Pilihan jawaban tidak valid.');if(typeof p.answer==='string'&&p.answer.length>1000)throw new Error('Jawaban terlalu panjang.');await run(res,'bk_answer',{p_attempt:id(req.params.id),p_question:id(p.questionId),p_answer:p.answer,p_request:id(p.requestId),p_practice:p.practice===true})}catch(error){res.status(400).json({error:(error as Error).message})}
 })
 app.patch('/api/v1/me/learning/attempts/:id/stage',async(req,res)=>{try{const p=object(req.body);if(!Number.isInteger(p.stage)||p.stage<0||p.stage>3)throw new Error('Tahap tidak valid.');await run(res,'bk_set_stage',{p_attempt:id(req.params.id),p_stage:p.stage})}catch(error){res.status(400).json({error:(error as Error).message})}})
 app.use('/api/v1/me/admin',async (_req,res,next)=>{const {data,error}=await res.locals.client.rpc('bk_is_admin');if(error||data!==true){res.status(403).json({error:'Halaman ini hanya tersedia untuk admin.'});return}next()})
 installPreviewRoutes(app)
 app.get('/api/v1/me/admin/content',async(_req,res)=>{await run(res,'bk_admin_content')})
 for(const kind of ['questions','lessons'])app.post(`/api/v1/me/admin/${kind}`,async(req,res)=>{
  try{const p=object(req.body);await run(res,kind==='questions'?'bk_admin_save_question':'bk_admin_save_lesson',{p_source:id(p.sourceId,true),p_payload:kind==='questions'?questionPayload(p.payload):lessonPayload(p.payload)})}catch(error){res.status(400).json({error:(error as Error).message})}
 })
 app.post('/api/v1/me/admin/publish',async(req,res)=>{try{const p=object(req.body);if(!['question','lesson'].includes(p.kind))throw new Error('Jenis konten tidak valid.');await run(res,'bk_admin_publish',{p_kind:p.kind,p_id:id(p.id)})}catch(error){res.status(400).json({error:(error as Error).message})}})
}
