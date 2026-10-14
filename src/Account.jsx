import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, accountApi } from './supabase'
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
  const requireClient = () => { if (!supabase) throw new Error('Supabase belum dikonfigurasi. Lihat panduan setup.') }
  const login = async (email, password) => {
    requireClient()
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (error) throw new Error('Login gagal. Periksa email, kata sandi, dan konfirmasi email Anda.')
  }
  const register = async (email, password, profile) => {
    requireClient()
    const { data, error } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password,
      options: { data: profile, emailRedirectTo: window.location.origin } })
    if (error) throw new Error('Pendaftaran gagal. Periksa data atau coba kembali nanti.')
    return !!data.session
  }
  const logout = async () => {
    requireClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error('Belum berhasil keluar. Coba lagi.')
  }
  return <Context.Provider value={{ session, loading, login, register, logout, accountApi }}>{children}</Context.Provider>
}
