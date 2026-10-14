import { useCallback, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { AccountProvider, useAccount } from './Account.jsx'
import { Provider } from './learning.jsx'
import { AccessContext } from './access.jsx'
import { Splash, AuthLayout, Login, Register } from './EntryFlow.jsx'
import { Shell, Dashboard, Assessment, LearningPath, Lesson, Dictionary, Progress, Profile, Settings, Missing } from './LearningApp.jsx'
function Protected({ authorized }) { return authorized ? <Outlet/> : <Navigate to="/signin" replace/> }
export function AppRoutes({ authorized, enter }) {
 return <AccessContext.Provider value={{ authorized }}><Routes><Route element={<AuthLayout/>}><Route path="signin" element={<Login onEnter={enter}/>}/><Route path="signup" element={<Register onEnter={enter}/>}/></Route><Route element={<Shell/>}><Route index element={<Dashboard/>}/><Route path="learning" element={<LearningPath/>}/><Route path="dictionary" element={<Dictionary/>}/><Route path="settings" element={<Settings/>}/><Route element={<Protected authorized={authorized}/>}><Route path="assessment" element={<Assessment/>}/><Route path="lesson/:id" element={<Lesson/>}/><Route path="profile" element={<Profile/>}/><Route path="progress" element={<Progress/>}/></Route><Route path="*" element={<Missing/>}/></Route></Routes></AccessContext.Provider>
}
function EntryApp() {
 const [opening, setOpening] = useState(true)
 const { session, loading } = useAccount()
 const authorized = !!session
 const navigate = useNavigate()
 const finishOpening = useCallback(() => { setOpening(false); navigate('/', { replace: true }) }, [navigate])
 if (opening || loading) return <Splash onFinish={finishOpening}/>
 return <AppRoutes authorized={authorized} enter={() => {}}/>
}
function AccountWorkspace() {
 const { session } = useAccount()
 return <Provider key={session?.user.id || 'guest'}><EntryApp/></Provider>
}
export default function App() { return <AccountProvider><AccountWorkspace/></AccountProvider> }
