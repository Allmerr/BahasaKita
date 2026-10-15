import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Link } from 'react-router-dom'
import { it, expect, vi } from 'vitest'
import { preferences } from '../fixtures.js'

const mocks = vi.hoisted(() => ({ grade: 'SD', start: vi.fn() }))
vi.mock('../../src/Account.jsx', async () => {
 const { createContext, useContext, useState } = await import('react')
 const Context = createContext(null)
 return {
  AccountProvider: ({ children }) => {
   const [session, setSession] = useState(null)
   return <Context.Provider value={{ session, loading: false, register: async (_email, _password, profile) => {
    mocks.grade = profile.grade
    setSession({ user: { id: 'new-student' } })
    return true
   } }}>{children}</Context.Provider>
  },
  useAccount: () => useContext(Context),
 }
})
vi.mock('../../src/learning.jsx', async original => ({
 ...await original(),
 Provider: ({ children }) => children,
 useStore: () => ({ state: { profile: { name: 'Dina', grade: mocks.grade }, settings: preferences, assessment: null, learningReady: true, activeAssessment: null }, accountReady: true, accessReady: true, startAttempt: mocks.start }),
}))
vi.mock('../../src/EntryFlow.jsx', async original => ({
 ...await original(),
 Splash: ({ onFinish }) => <button onClick={onFinish}>Selesai layar pembuka</button>,
}))
vi.mock('../../src/LearningApp.jsx', async () => {
 const { Outlet } = await import('react-router-dom')
 const Empty = () => null
 return { Shell: () => <Outlet/>, Dashboard: () => <h1>Beranda</h1>, LearningPath: Empty, Dictionary: Empty, Progress: Empty, Profile: Empty, Settings: Empty, Missing: Empty, ProfileGrid: Empty }
})
import App from '../../src/App.jsx'

it.each(['SD', 'SMP', 'SMA'])('registration opens the %s assessment introduction without restarting the splash', async grade => {
 render(<MemoryRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><Link to="/signup">Buat akun</Link><App/></MemoryRouter>)
 fireEvent.click(screen.getByRole('button', { name: 'Selesai layar pembuka' }))
 fireEvent.click(screen.getByRole('link', { name: 'Buat akun' }))
 for (const [label, value] of [['Nama panggilan', 'Dina'], ['Email', 'dina@example.test'], ['Kata sandi', 'Password123!'], ['Konfirmasi kata sandi', 'Password123!'], ['Jenjang belajar', grade]]) {
  fireEvent.change(screen.getByLabelText(label, { exact: true }), { target: { value } })
 }
 fireEvent.click(screen.getByRole('button', { name: 'Register', exact: true }))
 expect(await screen.findByRole('heading', { name: 'Bukan ujian. Ini titik awalmu.' })).toBeInTheDocument()
 expect(screen.getByRole('heading', { name: `8 soal, 4 aspek kemampuan (${grade})` })).toBeInTheDocument()
 expect(screen.getByRole('button', { name: 'Mulai asesmen' })).toBeInTheDocument()
 expect(screen.queryByRole('button', { name: 'Selesai layar pembuka' })).not.toBeInTheDocument()
 expect(mocks.start).not.toHaveBeenCalled()
})
