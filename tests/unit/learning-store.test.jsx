import { renderHook,act,waitFor } from '@testing-library/react'
import { beforeEach,it,expect,vi } from 'vitest'
import { profile,preferences,onlineState,lesson,scores } from '../fixtures.js'
const mocks=vi.hoisted(()=>({account:{session:{user:{id:'student-a'}},accountApi:vi.fn()},catalog:vi.fn()}))
vi.mock('../../src/Account.jsx',()=>({useAccount:()=>mocks.account}))
vi.mock('../../src/supabase.js',()=>({fetchCatalog:(...args)=>mocks.catalog(...args)}))
import { Provider,useStore } from '../../src/learning.jsx'
let learning,serverProfile
beforeEach(()=>{learning=structuredClone(onlineState);serverProfile={...profile};mocks.account.session={user:{id:'student-a'}};mocks.catalog.mockResolvedValue({lessons:[lesson,{...lesson,id:'smp-buah',grade:'SMP'}],basicMaterials:[]});mocks.account.accountApi.mockImplementation(async(path,body)=>{if(!path)return {profile:serverProfile,preferences};if(path==='/access')return {isAdmin:true};if(path==='/learning')return learning;if(path==='/profile'){serverProfile={...serverProfile,...body};return serverProfile}if(path==='/learning/import'){learning={...learning,legacy:body};return true}if(path==='/avatar')return body?{avatar_path:'student-a/new.png',avatar_url:'https://photo.test/new.png'}:{avatar_path:null,avatar_url:null};return {ok:true}})})
async function setup(){const hook=renderHook(()=>useStore(),{wrapper:Provider});await waitFor(()=>expect(hook.result.current.state.learningReady).toBe(true));return hook}
it('loads online profile, permissions, grade-scoped content and progress',async()=>{const {result}=await setup();expect(result.current.state.profile).toEqual(profile);expect(result.current.isAdmin).toBe(true);expect(result.current.lessons.map(l=>l.id)).toEqual([lesson.id]);expect(result.current.path).toHaveLength(1)})
it('applies appearance preferences locally and saves them online explicitly',async()=>{const {result}=await setup();act(()=>result.current.setting('theme','dark'));act(()=>result.current.setting('textSize','large'));expect(document.documentElement.dataset.theme).toBe('dark');expect(document.documentElement.dataset.size).toBe('large');expect(JSON.parse(localStorage.getItem('bahasakita-preferences')).theme).toBe('dark');await act(()=>result.current.savePreferences());expect(mocks.account.accountApi).toHaveBeenCalledWith('/preferences',expect.objectContaining({theme:'dark'}))})
it('keeps the last device theme after refresh even when account preferences are older',async()=>{const first=await setup();act(()=>first.result.current.setting('theme','dark'));first.unmount();const second=await setup();expect(second.result.current.state.settings.theme).toBe('dark');expect(document.documentElement.dataset.theme).toBe('dark')})
it('imports legacy progress as an archive, retaining server assessment',async()=>{const original=mocks.account.accountApi.getMockImplementation();mocks.account.accountApi.mockImplementation((path,...args)=>path==='/access'?Promise.resolve({isAdmin:false}):original(path,...args));const old={assessment:{kosakata:100},mastered:['forged']};localStorage.setItem('bahasakita-learning-student-a',JSON.stringify(old));const {result}=await setup();expect(mocks.account.accountApi).toHaveBeenCalledWith('/learning/import',old,{method:'POST'});expect(result.current.state.mastered).toEqual([]);expect(result.current.state.assessment).toEqual(scores);expect(localStorage.getItem('bahasakita-learning-student-a')).toBeTruthy()})
it('does not reimport an already archived legacy record',async()=>{learning.legacy={archived:true};localStorage.setItem('bahasakita-learning-student-a',JSON.stringify({mastered:['old']}));await setup();expect(mocks.account.accountApi.mock.calls.some(([p])=>p==='/learning/import')).toBe(false)})
it('persists all profile fields and reloads grade-scoped learning',async()=>{const {result}=await setup();learning={...learning,assessment:null,mastered:[]};await act(()=>result.current.saveProfile({name:'Dina Baru',grade:'SMP',goal:'Memahami cerita'}));expect(result.current.state.profile).toMatchObject({name:'Dina Baru',grade:'SMP',goal:'Memahami cerita'});expect(result.current.state.assessment).toBeNull();expect(result.current.lessons[0].id).toBe('smp-buah')})
it('uploads and removes avatars without changing profile text',async()=>{const {result}=await setup();const file=new File(['png'],'photo.png',{type:'image/png'});await act(()=>result.current.uploadAvatar(file));expect(result.current.state.profile.avatar_path).toBe('student-a/new.png');await act(()=>result.current.removeAvatar());expect(result.current.state.profile.avatar_path).toBeNull();expect(result.current.state.profile.name).toBe('Dina');expect(mocks.account.accountApi).toHaveBeenCalledWith('/avatar',undefined,{method:'DELETE'})})
it('starts/resumes assessments using server session and saves answers with request ID',async()=>{const {result}=await setup();const attempt={id:'attempt',kind:'assessment',status:'active',answers:[]};mocks.account.accountApi.mockResolvedValueOnce(attempt);await act(()=>result.current.startAttempt('assessment'));expect(result.current.state.activeAssessment).toEqual(attempt);mocks.account.accountApi.mockResolvedValueOnce({...attempt,answers:[{correct:true}]});await act(()=>result.current.answerAttempt('attempt','question',2,'request'));expect(mocks.account.accountApi).toHaveBeenLastCalledWith('/learning/attempts/attempt/answers',{questionId:'question',answer:2,requestId:'request',practice:false},{method:'POST'});expect(result.current.state.assessmentDraft).toHaveLength(1)})
it('refreshes canonical progress after completion and clears active assessment',async()=>{const {result}=await setup();mocks.account.accountApi.mockResolvedValueOnce({id:'attempt',kind:'assessment',status:'completed'});await act(()=>result.current.answerAttempt('attempt','question',1,'request'));expect(result.current.state.activeAssessment).toBeNull();expect(result.current.state.assessmentDraft).toBeNull();expect(mocks.account.accountApi).toHaveBeenLastCalledWith('/learning')})
it('exposes learning failures and recovers on explicit retry',async()=>{const {result}=await setup();mocks.account.accountApi.mockRejectedValueOnce(new Error('Database offline'));await act(async()=>{await expect(result.current.reloadLearning()).rejects.toThrow('Database offline')});expect(result.current.learningError).toBe('Database offline');expect(result.current.state.learningReady).toBe(false);await act(()=>result.current.reloadLearning());expect(result.current.learningError).toBe('');expect(result.current.state.learningReady).toBe(true)})
it('isolates account state and ignores late responses from an old account',async()=>{const {result,rerender}=await setup();let resolveOld;mocks.account.accountApi.mockImplementation(path=>!path?new Promise(resolve=>{resolveOld=resolve}):Promise.resolve(path==='/access'?{isAdmin:false}:learning));mocks.account.session={user:{id:'student-b'}};rerender();await waitFor(()=>expect(result.current.accountReady).toBe(false));mocks.account.session=null;rerender();await act(async()=>resolveOld({profile:{...profile,name:'Old account'},preferences}));expect(result.current.state.profile).toBeNull();expect(result.current.isAdmin).toBe(false);expect(result.current.state.attempts).toEqual([])})
it('shows catalog failure and retries without inventing local content',async()=>{mocks.catalog.mockRejectedValueOnce(new Error('Catalog unavailable'));const {result}=await setup();expect(result.current.contentError).toBe('Catalog unavailable');expect(result.current.lessons).toEqual([]);await act(()=>result.current.reloadCatalog());expect(result.current.contentError).toBe('');expect(result.current.lessons).toHaveLength(1)})

function previewResponses(){
 const original=mocks.account.accountApi.getMockImplementation(),id='preview-id'
 const sandbox={...structuredClone(onlineState),profile:{...profile,name:'Siswa uji'},settings:{...preferences},learningReady:true}
 mocks.account.accountApi.mockImplementation(async(path,body,options)=>{
  if(path==='/admin/preview')return {id,state:structuredClone(sandbox),catalog:{lessons:[lesson],basicMaterials:[]}}
  if(path==='/admin/preview/'+id)return options?.method==='DELETE'?{ended:true}:{id,state:structuredClone(sandbox),catalog:{lessons:[lesson],basicMaterials:[]}}
  if(path==='/admin/preview/'+id+'/profile'){sandbox.profile={...sandbox.profile,...body};return structuredClone(sandbox)}
  if(path==='/admin/preview/'+id+'/preferences'){sandbox.settings=body;return structuredClone(sandbox)}
  if(path==='/admin/preview/'+id+'/learning')return structuredClone(sandbox)
  if(path?.startsWith('/admin/preview/'+id+'/learning/attempts'))return {id:'sandbox-attempt',kind:'assessment',status:'active',answers:[]}
  return original(path,body,options)
 })
 return {id,sandbox}
}
it('admin preview isolates progress, profile edits, preferences and photo uploads',async()=>{
 const {result}=await setup(),{id}=previewResponses()
 await act(()=>result.current.startPreview());expect(result.current.studentPreview).toBe(true);expect(result.current.state.profile.name).toBe('Siswa uji')
 await act(()=>result.current.saveProfile({name:'Siswa tes',grade:'SD',goal:'Memahami cerita'}))
 await act(()=>result.current.startAttempt('assessment'));await act(()=>result.current.answerAttempt('sandbox-attempt','question',1,'request'))
 act(()=>result.current.setting('theme','dark'));await act(()=>result.current.savePreferences())
 await act(()=>result.current.uploadAvatar(new File(['test'],'photo.png',{type:'image/png'})))
 expect(mocks.account.accountApi.mock.calls.filter(([path,,options])=>options?.method==='POST'||path==='/profile'||path==='/preferences'||path==='/avatar').every(([path])=>path.startsWith('/admin/preview'))).toBe(true)
 await act(()=>result.current.stopPreview());expect(result.current.studentPreview).toBe(false);expect(result.current.state.profile).toEqual(profile);expect(result.current.state.settings.theme).toBe('light');expect(result.current.state.attempts).toEqual([])
 expect(sessionStorage.getItem('bahasakita-preview-student-a')).toBeNull();expect(mocks.account.accountApi).toHaveBeenCalledWith('/admin/preview/'+id,undefined,{method:'DELETE'});expect(URL.revokeObjectURL).toHaveBeenCalled()
})
it('restores a preview after refresh only after verifying admin access',async()=>{
 const {id}=previewResponses();sessionStorage.setItem('bahasakita-preview-student-a',id)
 const {result}=await setup();await waitFor(()=>expect(result.current.accessReady).toBe(true));expect(result.current.studentPreview).toBe(true);expect(result.current.state.profile.name).toBe('Siswa uji')
})
it('keeps access blocked on a failed role lookup and recovers on retry',async()=>{
 const original=mocks.account.accountApi.getMockImplementation();let failing=true
 mocks.account.accountApi.mockImplementation((path,...args)=>path==='/access'&&failing?Promise.reject(new Error('Role offline')):original(path,...args))
 const {result}=await setup();expect(result.current.accessReady).toBe(false);expect(result.current.accessError).toBe('Role offline');failing=false;await act(()=>result.current.reloadAccess());expect(result.current.accessReady).toBe(true)
})
it('ignores a delayed preview answer after the sandbox is closed',async()=>{
 const {result}=await setup(),{id}=previewResponses();await act(()=>result.current.startPreview())
 const original=mocks.account.accountApi.getMockImplementation();let resolveAnswer
 mocks.account.accountApi.mockImplementation((path,...args)=>path.endsWith('/answers')?new Promise(resolve=>{resolveAnswer=resolve}):original(path,...args))
 let pending;act(()=>{pending=result.current.answerAttempt('attempt','question',1,'request')});const rejection=expect(pending).rejects.toThrow('Pratinjau sudah berakhir.')
 await act(()=>result.current.stopPreview());await act(async()=>resolveAnswer({kind:'assessment',status:'active',answers:[{correct:true}]}));await rejection;expect(result.current.state.profile).toEqual(profile);expect(result.current.studentPreview).toBe(false)
})
