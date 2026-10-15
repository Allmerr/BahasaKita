import { defineConfig } from 'vitest/config'
import { transform } from 'esbuild'

export default defineConfig({
 plugins:[{name:'test-jsx',enforce:'pre',async transform(source,id){
  if(!id.endsWith('.jsx'))return null
  const {code,map}=await transform(source,{loader:'jsx',jsx:'automatic',sourcemap:true,sourcefile:id})
  return {code,map}
 }}],
 define:{'import.meta.env.VITE_SUPABASE_URL':JSON.stringify('https://unit-tests.supabase.co'),'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY':JSON.stringify('sb_publishable_unit_tests')},
 test:{
  environment:'jsdom',include:['tests/unit/**/*.test.{js,jsx}'],setupFiles:['./tests/setup.js'],
  clearMocks:true,restoreMocks:true,maxWorkers:2,execArgv:['--no-experimental-webstorage'],
  coverage:{provider:'v8',reportsDirectory:'./coverage',reporter:['text','html','json-summary'],include:['src/**/*.{js,jsx}'],exclude:['src/main.jsx','src/components/Icon.jsx']},
 },
})
