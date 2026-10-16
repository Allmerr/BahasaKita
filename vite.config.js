import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readSupabaseConfig } from './src/supabaseConfig.js'
import { bahasaKitaPwa } from './scripts/pwa-plugin.mjs'

export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), 'VITE_SUPABASE_')
 const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
 const config = readSupabaseConfig(env.VITE_SUPABASE_URL, key)
 if (key && key !== 'YOUR_PUBLISHABLE_KEY' && config.error) throw new Error(config.error)
 return {
  plugins: [react(), bahasaKitaPwa()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://127.0.0.1:3001' },
    open: true,
  },
 }
})
