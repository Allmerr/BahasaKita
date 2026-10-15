import type { Express } from 'express'
import { PreviewStore,PreviewError } from './preview.js'
import { id,object } from './learning-validation.js'

export function installPreviewRoutes(app:Express){
 const store=new PreviewStore(),root='/api/v1/me/admin/preview'
 app.post(root,async(req,res)=>{
  try{
   const body=object(req.body),{data,error}=await res.locals.client.rpc('bk_admin_content')
   if(error||!Array.isArray(data?.lessons)||!Array.isArray(data?.questions)){res.status(503).json({error:'Konten pratinjau belum dapat dimuat. Coba kembali.'});return}
   res.json(store.create(res.locals.user.id,data,body.grade,body.preferences))
  }catch(e){res.status(e instanceof PreviewError?e.status:400).json({error:(e as Error).message})}
 })
 app.use(root+'/:previewId',(req,res,next)=>{
  try{res.locals.preview=store.get(res.locals.user.id,id(req.params.previewId)!);next()}catch(e){res.status(e instanceof PreviewError?e.status:400).json({error:(e as Error).message})}
 })
 const handle=(action:(req:any,res:any)=>unknown)=>(req:any,res:any)=>{try{res.json(action(req,res))}catch(e){res.status(e instanceof PreviewError?e.status:400).json({error:(e as Error).message})}}
 app.get(root+'/:previewId',handle((_req,res)=>({id:res.locals.preview.id,state:res.locals.preview.state(),catalog:res.locals.preview.catalog()})))
 app.delete(root+'/:previewId',handle((_req,res)=>{store.remove(res.locals.user.id,res.locals.preview.id);return {ended:true}}))
 app.get(root+'/:previewId/learning',handle((_req,res)=>res.locals.preview.state()))
 app.patch(root+'/:previewId/profile',handle((req,res)=>res.locals.preview.setProfile(req.body)))
 app.patch(root+'/:previewId/preferences',handle((req,res)=>res.locals.preview.setPreferences(req.body)))
 app.post(root+'/:previewId/learning/attempts',handle((req,res)=>{const p=object(req.body);return res.locals.preview.start(p.kind,p.lesson)}))
 app.get(root+'/:previewId/learning/attempts/:attemptId',handle((req,res)=>res.locals.preview.get(id(req.params.attemptId))))
 app.patch(root+'/:previewId/learning/attempts/:attemptId/stage',handle((req,res)=>res.locals.preview.stage(id(req.params.attemptId),object(req.body).stage)))
 app.post(root+'/:previewId/learning/attempts/:attemptId/answers',handle((req,res)=>{const p=object(req.body);return res.locals.preview.answer(id(req.params.attemptId),id(p.questionId),p.answer,id(p.requestId),p.practice===true)}))
}
