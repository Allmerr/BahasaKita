import { lazy, Suspense, useCallback, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AccountProvider, useAccount } from './Account.jsx'
import { Provider, useStore, learningDestination } from './learning.jsx'
import { AccessContext, publicPages } from './access.jsx'
import { Splash, AuthLayout, Login, Register } from './EntryFlow.jsx'
import { Shell, Dashboard, LearningPath, Dictionary, Progress, Profile, Settings, Missing } from './LearningApp.jsx'
import { Assessment, Lesson, LearningStatus } from './OnlineLearning.jsx'
const Admin = lazy(()=>import('./Admin.jsx'))
import BasicClass from './BasicClass.jsx'
function Protected({ authorized }) { return authorized ? <Outlet/> : <Navigate to="/signin" replace/> }
function WorkspaceGate({authorized}){
 const {accountReady,accountError,accessReady,accessError,reloadAccess,isAdmin,studentPreview}=useStore(),{pathname}=useLocation()
 if(authorized&&(!accountReady||accessReady===false))return <main className="workspace-loading panel" role="status"><p>{accountError||accessError||'Menyiapkan ruang akun…'}</p>{(accountError||accessError)&&<button className="btn" onClick={()=>accountError?window.location.reload():reloadAccess().catch(()=>{})}>Coba lagi</button>}</main>
 if(authorized&&isAdmin&&!studentPreview&&!['/admin','/profile','/settings'].includes(pathname))return <Navigate to="/admin" replace/>
 if(authorized&&studentPreview&&pathname==='/admin')return <Navigate to="/" replace/>
 return <Outlet/>
}
function LearningGate({ authorized }) {
 const { state, accountReady,isAdmin,studentPreview } = useStore()
 const destination = learningDestination(state)
 const { pathname } = useLocation()
 if (authorized && accountReady && !state.learningReady) return <LearningStatus/>
 const canViewHome = pathname === '/' && destination === '/basic-class'
 const canBrowseBeforeAssessment = destination === '/assessment' && publicPages.includes(pathname)
 return authorized && accountReady && destination !== '/' && !canViewHome && !canBrowseBeforeAssessment ? <Navigate to={destination} replace/> : <Outlet/>
}
function BasicGate() {
 const { state } = useStore()
 const destination = learningDestination(state)
 return destination === '/basic-class' ? <BasicClass/> : <Navigate to={destination} replace/>
}
export function AppRoutes({ authorized, enter }) {
 return <AccessContext.Provider value={{ authorized }}><Routes><Route element={<AuthLayout/>}><Route path="signin" element={<Login onEnter={enter}/>}/><Route path="signup" element={<Register onEnter={enter}/>}/></Route><Route element={<WorkspaceGate authorized={authorized}/>}><Route element={<Shell/>}><Route element={<LearningGate authorized={authorized}/>}><Route index element={<Dashboard/>}/><Route path="learning" element={<LearningPath/>}/><Route path="dictionary" element={<Dictionary/>}/><Route element={<Protected authorized={authorized}/>}><Route path="progress" element={<Progress/>}/><Route path="lesson/:id" element={<Lesson/>}/></Route></Route><Route path="settings" element={<Settings/>}/><Route element={<Protected authorized={authorized}/>}><Route path="assessment" element={<Assessment/>}/><Route path="basic-class" element={<BasicGate/>}/><Route path="profile" element={<Profile/>}/><Route path="admin" element={<Suspense fallback={<div className="panel">Memuat pengelola…</div>}><Admin/></Suspense>}/></Route><Route path="*" element={<Missing/>}/></Route></Route></Routes></AccessContext.Provider>
}
function EntryApp() {
 const [opening, setOpening] = useState(true)
 const { session, loading } = useAccount()
 const { state, accountReady,isAdmin,studentPreview } = useStore()
 const authorized = !!session
 const navigate = useNavigate()
 const finishOpening = useCallback(() => { setOpening(false); navigate(authorized && accountReady ? isAdmin&&!studentPreview?'/admin':learningDestination(state) : '/', { replace: true }) }, [navigate, authorized, accountReady, state,isAdmin,studentPreview])
 if (opening || loading) return <Splash onFinish={finishOpening}/>
 return <AppRoutes authorized={authorized} enter={() => {}}/>
}
function AccountWorkspace() {
 const { session } = useAccount()
 return <Provider key={session?.user.id || 'guest'}><EntryApp/></Provider>
}
export default function App() { return <AccountProvider><AccountWorkspace/></AccountProvider> }
