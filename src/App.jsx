import { useCallback, useState } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { Provider } from './learning.jsx'
import { AccessContext } from './access.jsx'
import { Splash, AuthLayout, Login, Register } from './EntryFlow.jsx'
import { Shell, Dashboard, Assessment, LearningPath, Lesson, Dictionary, Progress, Profile, Settings, Missing } from './LearningApp.jsx'
function Protected({ authorized }) { return authorized ? <Outlet/> : <Navigate to="/signin" replace/> }
export function AppRoutes({ authorized, enter }) {
 return <AccessContext.Provider value={{ authorized }}><Routes><Route element={<AuthLayout/>}><Route path="signin" element={<Login onEnter={enter}/>}/><Route path="signup" element={<Register onEnter={enter}/>}/></Route><Route element={<Shell/>}><Route index element={<Dashboard/>}/><Route path="learning" element={<LearningPath/>}/><Route path="dictionary" element={<Dictionary/>}/><Route path="progress" element={<Progress/>}/><Route element={<Protected authorized={authorized}/>}><Route path="assessment" element={<Assessment/>}/><Route path="lesson/:id" element={<Lesson/>}/><Route path="profile" element={<Profile/>}/><Route path="settings" element={<Settings/>}/></Route><Route path="*" element={<Missing/>}/></Route></Routes></AccessContext.Provider>
}
function EntryApp() {
 const [opening, setOpening] = useState(true)
 const [authorized, setAuthorized] = useState(false)
 const navigate = useNavigate()
 const finishOpening = useCallback(() => { setOpening(false); navigate('/', { replace: true }) }, [navigate])
 if (opening) return <Splash onFinish={finishOpening}/>
 return <AppRoutes authorized={authorized} enter={() => setAuthorized(true)}/>
}
export default function App() { return <Provider><EntryApp/></Provider> }
