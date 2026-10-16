import { render,screen,fireEvent,waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach,it,expect,vi } from 'vitest'
import { profile,preferences,lesson,scores } from '../fixtures.js'
const mocks=vi.hoisted(()=>({store:{},api:vi.fn()}))
vi.mock('../../src/learning.jsx',async original=>({...await original(),useStore:()=>mocks.store}))
vi.mock('../../src/Account.jsx',()=>({useAccount:()=>({session:{user:{id:'teacher-id'}},accountApi:mocks.api})}))
import Support,{SupportAccounts} from '../../src/Support.jsx'
import { AppRoutes } from '../../src/App.jsx'
let detail,studentSupport
beforeEach(()=>{
 detail={id:'student-id',name:'Dina',grade:'SD',goal:'Mengenal kata',mastered:1,totalLessons:4,assessmentScore:100,scores,lastActivity:null,history:[],difficulties:[{aspect:'bacaan',incorrect:2,total:4}],assignments:[],notes:[]}
 studentSupport={links:[],invites:[],assignments:[],notes:[]}
 mocks.store={state:{profile,settings:preferences,learningReady:true,assessment:scores,attempts:[],mastered:[]},role:'student',isSupporter:false,isAdmin:false,supportReady:true,accountReady:true,accessReady:true,allLessons:[lesson],lessons:[lesson],dictionary:[],setting:vi.fn(),masteredLessons:[],lessonAttempts:[]}
 mocks.api.mockImplementation(async(path)=>path.startsWith('/support/chat/')?{messages:[],hasOlder:false}:path==='/support'?studentSupport:path==='/support/dashboard'?{students:[{...detail,linkId:'link-id'}]}:path==='/support/students/student-id'?detail:path==='/support/invites'?{id:'invite-id',kind:'teacher',code:'A'.repeat(32),expiresAt:'2030-01-01T00:00:00Z'}:{ok:true})
})
const mount=element=>render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{element||<Support/>}</MemoryRouter>)
it('student sees independent study, creates a role-bound invite and can revoke it',async()=>{
 mount();await screen.findByText('Belum ada pendamping terhubung.');fireEvent.click(screen.getByRole('button',{name:'Buat kode undangan'}));expect(await screen.findByLabelText('Kode undangan')).toHaveTextContent('A'.repeat(32));expect(mocks.api).toHaveBeenCalledWith('/support/invites',{kind:'teacher'},{method:'POST'})
})
it('student sees teacher feedback and the assessment prerequisite on assigned lessons',async()=>{
 mocks.store.state={...mocks.store.state,assessment:null};studentSupport.assignments=[{id:'task',teacherId:'teacher-id',teacherName:'Bu Guru',title:'Latihan cerita',lessonTitle:lesson.title,lesson:lesson.id,grade:'SD',available:true}];studentSupport.notes=[{id:'note',teacherId:'teacher-id',teacherName:'Bu Guru',body:'Perhatikan urutan kejadian.'}]
 mount();expect(await screen.findByText('Latihan cerita')).toBeInTheDocument();expect(screen.getByText('Perhatikan urutan kejadian.')).toBeInTheDocument();expect(screen.getByRole('link',{name:'Selesaikan asesmen'})).toHaveAttribute('href','/assessment');expect(screen.queryByRole('button',{name:'Tarik tugas'})).not.toBeInTheDocument()
})
it('teacher sees linked progress and can submit a targeted task and note',async()=>{
 mocks.store.role='teacher';mocks.store.isSupporter=true;mount();await screen.findByText('Perkembangan Dina');expect(screen.getByText('Bacaan: 2 dari 4 jawaban perlu diperbaiki.')).toBeInTheDocument()
 fireEvent.change(screen.getByLabelText('Materi tugas'),{target:{value:lesson.versionId}});fireEvent.change(screen.getByLabelText('Judul tugas'),{target:{value:'Penguatan bacaan'}});fireEvent.click(screen.getByRole('button',{name:'Berikan tugas'}));await waitFor(()=>expect(mocks.api).toHaveBeenCalledWith('/support/assignments',expect.objectContaining({studentId:'student-id',title:'Penguatan bacaan',requestId:expect.any(String)}),{method:'POST'}))
 fireEvent.change(screen.getByLabelText('Catatan untuk siswa'),{target:{value:'Gunakan gambar untuk mengurutkan cerita.'}});fireEvent.click(screen.getByRole('button',{name:'Simpan catatan'}));expect(await screen.findByText('Catatan tersimpan.')).toBeInTheDocument()
})
it('parent sees home activities, but no grading, task creation or note creation controls',async()=>{
 mocks.store.role='parent';mocks.store.isSupporter=true;mount();await screen.findByText('Perkembangan Dina');expect(screen.getByRole('heading',{name:'Kegiatan bersama di rumah'})).toBeInTheDocument();expect(screen.queryByLabelText('Materi tugas')).not.toBeInTheDocument();expect(screen.queryByLabelText('Catatan untuk siswa')).not.toBeInTheDocument();expect(screen.queryByText(/Waktu menjawab/)).not.toBeInTheDocument()
})
it('failed reads can be retried and empty rosters explain how to connect',async()=>{
 mocks.store.role='teacher';mocks.store.isSupporter=true;mocks.api.mockRejectedValueOnce(new Error('Offline'));mount();await screen.findByText('Offline');mocks.api.mockResolvedValueOnce({students:[]});fireEvent.click(screen.getByRole('button',{name:'Coba lagi'}));expect(await screen.findByText(/Belum ada siswa terhubung/)).toBeInTheDocument()
})
it('admin preview never queries real student relationships',()=>{
 mocks.store.studentPreview=true;mocks.store.role='admin';mount();expect(screen.getByText(/Hubungan pendamping dan tugas menggunakan akun siswa asli/)).toBeInTheDocument();expect(mocks.api).not.toHaveBeenCalled()
})
it('revoked progress is removed from the dashboard after a denied refresh',async()=>{
 mocks.store.role='teacher';mocks.store.isSupporter=true;mount();await screen.findByText('Perkembangan Dina');mocks.api.mockRejectedValueOnce(new Error('Hubungan diputuskan.'));fireEvent.click(screen.getByRole('button',{name:'Perbarui progres'}));await screen.findByText('Hubungan diputuskan.');expect(screen.queryByText('Perkembangan Dina')).not.toBeInTheDocument()
})
it('admin can assign a support role through the current user editor',async()=>{
 mocks.store.isAdmin=true
 const user={id:'teacher-id',name:'Bu Guru',email:'guru@example.test',role:'student',grade:'SD',goal:'Mengenal kata',created_at:'2026-10-01T00:00:00Z'}
 mocks.api.mockResolvedValue({users:[user],total:1})
 mount(<SupportAccounts/>);fireEvent.click(await screen.findByRole('button',{name:'Edit',exact:true}));fireEvent.change(screen.getByLabelText('Peran'),{target:{value:'teacher'}});fireEvent.click(screen.getByRole('button',{name:'Simpan perubahan'}));await waitFor(()=>expect(mocks.api).toHaveBeenCalledWith('/admin/users/teacher-id',expect.objectContaining({role:'teacher'}),{method:'PATCH'}))
})
it('supporters go directly to their dashboard without learner navigation or assessment prompts',async()=>{
 mocks.store.role='teacher';mocks.store.isSupporter=true;mocks.store.state={...mocks.store.state,assessment:null}
 render(<MemoryRouter initialEntries={['/assessment']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AppRoutes authorized enter={()=>{}}/></MemoryRouter>)
 await screen.findByRole('heading',{name:'Dashboard guru'});expect(screen.queryByRole('link',{name:'Beranda',exact:true})).not.toBeInTheDocument();expect(screen.queryByText(/Selesaikan asesmen awal sebelum/)).not.toBeInTheDocument()
})
