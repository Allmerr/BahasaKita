import { render,screen,fireEvent,waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach,it,expect,vi } from 'vitest'
import { profile,preferences,scores,lesson } from '../fixtures.js'
const mocks=vi.hoisted(()=>({store:{},account:{}}))
vi.mock('../../src/learning.jsx',async original=>({...await original(),useStore:()=>mocks.store}))
vi.mock('../../src/Account.jsx',()=>({useAccount:()=>mocks.account,AccountProvider:({children})=>children}))
import { Dashboard,PhotoStoriesCarousel,LearningPath,Progress,Profile,Settings } from '../../src/LearningApp.jsx'
import BasicClass from '../../src/BasicClass.jsx'
import { AppRoutes } from '../../src/App.jsx'
beforeEach(()=>{mocks.account={session:{user:{id:'dina'}},logout:vi.fn().mockResolvedValue(undefined)};mocks.store={state:{profile:{...profile},settings:{...preferences},learningReady:true,assessment:scores,attempts:[],mastered:[],legacy:null},path:[lesson],lessons:[lesson],next:lesson,masteredLessons:[],lessonAttempts:[],accountReady:true,isAdmin:false,accountError:'',learningError:'',contentError:'',clips:{},dictionary:[],basicMaterials:[{id:'basic-kosakata',title:'Dasar kosakata',videoSrc:'/videos/basic.webm',slides:[['Kenali kata','Mangga adalah buah.']]}],setting:vi.fn(),setClips:vi.fn(),savePreferences:vi.fn().mockResolvedValue(undefined),saveProfile:vi.fn(),reloadCatalog:vi.fn().mockResolvedValue(undefined)}})
const router=element=>render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}>{element}</MemoryRouter>)
it('dashboard shows account name, next lesson and mastery count',()=>{router(<Dashboard/>);expect(screen.getByRole('heading',{name:'Halo, Dina!'})).toBeInTheDocument();expect(screen.getByRole('link',{name:'Lanjutkan belajar: '+lesson.title})).toHaveAttribute('href','/lesson/'+lesson.id)})
it('video selection opens the player and closes the dialog',()=>{router(<PhotoStoriesCarousel state={mocks.store.state}/>);fireEvent.click(screen.getAllByRole('button',{name:/Tonton video SD:/})[0]);expect(screen.getByRole('dialog')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Tutup video pembelajaran'}));expect(screen.queryByRole('dialog')).not.toBeInTheDocument()})
it('video gallery only moves when requested and respects comfortable mode',()=>{vi.useFakeTimers();mocks.store.state.settings.comfortable=true;router(<PhotoStoriesCarousel state={mocks.store.state}/>);vi.advanceTimersByTime(8000);expect(HTMLElement.prototype.scrollBy).not.toHaveBeenCalled();fireEvent.click(screen.getByRole('button',{name:'Geser ke kanan'}));expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledWith(expect.objectContaining({behavior:'auto'}))})
it('manual video scrolling follows the system reduced-motion preference',()=>{
 vi.stubGlobal('matchMedia',vi.fn(()=>({matches:true,addEventListener:vi.fn(),removeEventListener:vi.fn()})))
 mocks.store.state.settings.comfortable=false;router(<PhotoStoriesCarousel state={mocks.store.state}/>)
 fireEvent.click(screen.getByRole('button',{name:'Geser ke kanan'}));expect(HTMLElement.prototype.scrollBy).toHaveBeenCalledWith(expect.objectContaining({behavior:'auto'}))
})
it('home recommends the basic class when assessment has not unlocked lessons',()=>{
 mocks.store.state.assessment={kosakata:50,kalimat:50,bacaan:50,akademik:50};router(<Dashboard/>)
 expect(screen.getByRole('link',{name:'Lanjutkan kelas dasar'})).toHaveAttribute('href','/basic-class')
 expect(screen.queryByRole('link',{name:'Lanjutkan belajar: '+lesson.title})).not.toBeInTheDocument()
})
it('home offers to resume an unfinished assessment',()=>{
 mocks.store.state.assessment=null;mocks.store.state.activeAssessment={answered:2};router(<Dashboard/>)
 expect(screen.getByRole('link',{name:'Lanjutkan asesmen'})).toHaveAttribute('href','/assessment')
})
it('home offers progress after all available lessons are mastered',()=>{
 mocks.store.next=null;mocks.store.masteredLessons=[lesson.id];router(<Dashboard/>)
 expect(screen.getByRole('heading',{name:'Semua materi sudah kamu kuasai!'})).toBeInTheDocument()
 expect(screen.getByRole('link',{name:'Lihat kemajuanmu'})).toHaveAttribute('href','/progress')
})
it('learning path exposes current-grade lessons after assessment',()=>{router(<LearningPath/>);expect(screen.getByRole('heading',{name:lesson.title})).toBeInTheDocument();expect(screen.getByRole('link',{name:'Mulai'})).toHaveAttribute('href','/lesson/'+lesson.id)})
it('shows a disabled locked button until the preceding lesson is mastered',()=>{
 const second={...lesson,id:'second',title:'Materi kedua'};mocks.store.path=[lesson,second];mocks.store.lessons=[lesson,second]
 const view=router(<LearningPath/>);expect(screen.getByRole('button',{name:'Materi Materi kedua terkunci'})).toBeDisabled()
 expect(screen.queryByRole('link',{name:'Mulai',exact:true})).toHaveAttribute('href','/lesson/'+lesson.id)
 mocks.store.state.mastered=[lesson.id];mocks.store.masteredLessons=[lesson.id]
 view.rerender(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><LearningPath/></MemoryRouter>)
 expect(screen.getByRole('link',{name:'Mulai',exact:true})).toHaveAttribute('href','/lesson/second')
 expect(screen.getByRole('link',{name:'Ulangi'})).toHaveAttribute('href','/lesson/'+lesson.id)
})
it('catalog failure has a retry action',async()=>{mocks.store.lessons=[];mocks.store.path=[];mocks.store.contentError='Catalog offline';router(<LearningPath/>);expect(screen.getByText('Catalog offline')).toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Coba lagi'}));await waitFor(()=>expect(mocks.store.reloadCatalog).toHaveBeenCalled())})
it('progress shows canonical attempts and unverified legacy archive separately',()=>{mocks.store.state.legacy={mastered:['old']};mocks.store.state.attempts=[{id:'a',type:'assessment',grade:'SD',date:'2026-10-15T00:00:00Z',scores,answers:[]},{id:'b',type:'lesson',title:lesson.title,aspect:'kosakata',grade:'SD',date:'2026-10-15T01:00:00Z',score:80,mastered:true,answers:[{seconds:60}]}];mocks.store.lessonAttempts=[mocks.store.state.attempts[1]];mocks.store.masteredLessons=[lesson.id];router(<Progress/>);expect(screen.getByText(/Progres dari versi lama telah diarsipkan/)).toBeInTheDocument();expect(screen.getByText('80%')).toBeInTheDocument();expect(screen.getByText('1 menit')).toBeInTheDocument()})
it('profile displays every saved field',()=>{router(<Profile/>);expect(screen.getByText('Dina',{selector:'dd'})).toBeInTheDocument();expect(screen.getByText('SD',{selector:'dd'})).toBeInTheDocument();expect(screen.getByText(profile.goal,{selector:'dd'})).toBeInTheDocument()})
it.each([false,true])('student settings omit advanced panels, including admin student preview: %s',preview=>{
 mocks.store.isAdmin=preview;mocks.store.studentPreview=preview;router(<Settings/>)
 expect(screen.queryByRole('heading',{name:'Aksesibilitas'})).not.toBeInTheDocument()
 expect(screen.queryByRole('heading',{name:'Pratinjau video isyarat'})).not.toBeInTheDocument()
 expect(screen.getByRole('heading',{name:'Profil belajarmu'})).toBeInTheDocument()
 expect(screen.getByRole('heading',{name:'Data & privasi'})).toBeInTheDocument()
})
it('admin settings apply accessibility preferences and save online',async()=>{mocks.store.isAdmin=true;router(<Settings/>);fireEvent.change(screen.getByLabelText('Ukuran teks'),{target:{value:'extra'}});fireEvent.change(screen.getByLabelText('Tampilan'),{target:{value:'dark'}});fireEvent.change(screen.getByLabelText('Kecepatan video awal'),{target:{value:'0.5'}});fireEvent.click(screen.getByRole('checkbox',{name:/Kontras tinggi/}));fireEvent.click(screen.getByRole('checkbox',{name:/Hemat data video/}));expect(mocks.store.setting.mock.calls).toEqual(expect.arrayContaining([['textSize','extra'],['theme','dark'],['speed','0.5'],['contrast',true],['dataSaver',true]]));fireEvent.click(screen.getByRole('button',{name:'Simpan pengaturan akun'}));expect(await screen.findByText('Pengaturan tersimpan online.')).toBeInTheDocument()})
it('admin settings display save errors and no longer contain a logout button',async()=>{mocks.store.isAdmin=true;mocks.store.savePreferences.mockRejectedValue(new Error('Offline'));router(<Settings/>);fireEvent.click(screen.getByRole('button',{name:'Simpan pengaturan akun'}));await screen.findByText('Offline');expect(screen.queryByRole('button',{name:'Keluar akun'})).not.toBeInTheDocument();expect(mocks.account.logout).not.toHaveBeenCalled()})
it('clearing device archives preserves online progress',()=>{localStorage.setItem('bahasakita-learning-dina','old');mocks.store.clips={word:'blob:old'};router(<Settings/>);fireEvent.click(screen.getByRole('button',{name:'Bersihkan arsip perangkat'}));fireEvent.click(screen.getByRole('button',{name:'Ya, hapus data'}));expect(localStorage.getItem('bahasakita-learning-dina')).toBeNull();expect(mocks.store.state.assessment).toEqual(scores);expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:old')})
it('basic class loads database slides, handles video failure and links reassessment',()=>{const {container}=router(<BasicClass/>);expect(screen.getByText('Mangga adalah buah.')).toBeInTheDocument();expect(container.querySelector('source')).toHaveAttribute('src','/videos/basic.webm');fireEvent.error(container.querySelector('video'));expect(screen.getByRole('alert')).toHaveTextContent('Video belum dapat diputar');expect(screen.getByRole('link',{name:'Ulangi asesmen awal'})).toHaveAttribute('href','/assessment')})
it('basic class reports a missing catalog without crashing',()=>{mocks.store.basicMaterials=[];mocks.store.contentError='Catalog offline';router(<BasicClass/>);expect(screen.getByRole('status')).toHaveTextContent('Catalog offline')})
it.each(['SD','SMP','SMA'])('basic class selects only %s content and starts YouTube on request',grade=>{
 mocks.store.state.profile.grade=grade
 mocks.store.basicMaterials=['SD','SMP','SMA'].flatMap(g=>[1,2].map(i=>({id:`${g}-${i}`,grade:'ALL',targetGrade:g,title:`Materi ${g} ${i}`,videoSrc:'https://www.youtube.com/watch?v=iDDkYTki6pU',sourceAuthor:'Guru',slides:[['Ringkasan',`Penjelasan ${g} ${i}`]]})))
 const {container}=router(<BasicClass/>);expect(screen.getByText(`Penjelasan ${grade} 1`)).toBeInTheDocument()
 for(const other of ['SD','SMP','SMA'].filter(g=>g!==grade))expect(screen.queryByText(`Materi ${other} 1`)).not.toBeInTheDocument()
 expect(container.querySelector('iframe')).toBeNull()
 fireEvent.click(screen.getByRole('button',{name:'Putar video pembelajaran'}))
 expect(container.querySelector('iframe')).toHaveAttribute('src',expect.stringContaining('youtube-nocookie.com/embed/iDDkYTki6pU'))
 expect(screen.getByRole('link',{name:'Buka di YouTube'})).toHaveAttribute('href','https://www.youtube.com/watch?v=iDDkYTki6pU')
 fireEvent.click(screen.getByRole('button',{name:new RegExp(`Materi ${grade} 2`)}))
 expect(container.querySelector('iframe')).toBeNull();expect(screen.getByText(`Penjelasan ${grade} 2`)).toBeInTheDocument()
})
it('private progress route redirects visitors to login',async()=>{mocks.account.session=null;render(<MemoryRouter initialEntries={['/progress']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AppRoutes authorized={false} enter={()=>{}}/></MemoryRouter>);expect(await screen.findByRole('heading',{name:'Selamat datang kembali'})).toBeInTheDocument()})
it('lesson routes require initial assessment',async()=>{mocks.store.state.assessment=null;mocks.store.startAttempt=vi.fn();render(<MemoryRouter initialEntries={['/lesson/'+lesson.id]} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AppRoutes authorized enter={()=>{}}/></MemoryRouter>);expect(await screen.findByRole('heading',{name:'Bukan ujian. Ini titik awalmu.'})).toBeInTheDocument();expect(mocks.store.startAttempt).not.toHaveBeenCalled()})
it('admin is redirected to content management and sees no student navigation or assessment prompt',async()=>{
 mocks.store.isAdmin=true;mocks.store.state.assessment=null;mocks.account.accountApi=vi.fn().mockResolvedValue({lessons:[],questions:[]})
 render(<MemoryRouter initialEntries={['/assessment']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AppRoutes authorized enter={()=>{}}/></MemoryRouter>)
 expect(await screen.findByRole('heading',{name:'Kelola materi & asesmen'})).toBeInTheDocument();expect(screen.queryByRole('link',{name:'Beranda',exact:true})).not.toBeInTheDocument();expect(screen.queryByText('Selesaikan asesmen awal sebelum menggunakan fitur belajar.')).not.toBeInTheDocument();expect(screen.getByRole('button',{name:'Lihat sebagai siswa'})).toBeInTheDocument()
})
it('admin preview sees student navigation and a persistent return control',()=>{
 mocks.store.isAdmin=true;mocks.store.studentPreview=true;mocks.store.state.profile={...profile,name:'Siswa uji'}
 render(<MemoryRouter initialEntries={['/learning']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AppRoutes authorized enter={()=>{}}/></MemoryRouter>)
 expect(screen.getAllByRole('link',{name:'Beranda',exact:true}).length).toBeGreaterThan(0);expect(screen.queryByRole('link',{name:'Kelola konten'})).not.toBeInTheDocument();expect(screen.getByRole('button',{name:'Kembali ke admin'})).toBeInTheDocument()
})
it('waits for verified permissions before rendering protected workspaces',()=>{
 mocks.store.accessReady=false;mocks.store.accessError='Role offline';mocks.store.reloadAccess=vi.fn().mockResolvedValue(undefined)
 render(<MemoryRouter initialEntries={['/']} future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AppRoutes authorized enter={()=>{}}/></MemoryRouter>)
 expect(screen.getByRole('status')).toHaveTextContent('Role offline');expect(screen.queryByRole('navigation')).not.toBeInTheDocument();fireEvent.click(screen.getByRole('button',{name:'Coba lagi'}));expect(mocks.store.reloadAccess).toHaveBeenCalled()
})
