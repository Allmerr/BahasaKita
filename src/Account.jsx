import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigError, accountApi } from './supabase'
import { authErrorMessage } from './authErrors'
const Context = createContext(null)
export const useAccount = () => useContext(Context)
export function AccountProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!supabase) { setLoading(false); return }
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      if (active) { setSession(next); setLoading(false) }
    })
    supabase.auth.getSession().then(({ data, error }) => {
      if (active) { setSession(error ? null : data.session); setLoading(false) }
    }).catch(() => { if (active) setLoading(false) })
    return () => { active = false; subscription.unsubscribe() }
  }, [])
  const requireClient = () => { if (!supabase) throw new Error(supabaseConfigError || 'Supabase belum dikonfigurasi. Lihat panduan setup.') }
  const login = async (email, password) => {
    requireClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (error) throw new Error(authErrorMessage(error, 'login'))
  }
  const register = async (email, password, profile) => {
    requireClient()
    const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password,
      options: { data: profile, emailRedirectTo: window.location.origin } })
    if (error) throw new Error(authErrorMessage(error))
    return !!data.session
  }
  const logout = async () => {
    requireClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error('Belum berhasil keluar. Coba lagi.')
    try { if(session?.user.id)sessionStorage.removeItem('bahasakita-preview-'+session.user.id) } catch {}
  }
  const requestAccount = async (...args) => {
    try { return await accountApi(...args) }
    catch (error) {
      if (error.code === 'AUTH_SESSION_EXPIRED') setSession(null)
      throw error
    }
  }
  return <Context.Provider value={{ session, loading, login, register, logout, accountApi: requestAccount }}>{children}</Context.Provider>
}
