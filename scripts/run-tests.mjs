import { spawn } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const root=fileURLToPath(new URL('../',import.meta.url))
const mode=process.argv[2]||'default'
const frontend=['node_modules/vitest/vitest.mjs','run',...(['coverage','all'].includes(mode)?['--coverage']:[])]
const serverTests=readdirSync(new URL('../server/src/',import.meta.url)).filter(name=>name.endsWith('.test.ts')).map(name=>'src/'+name)
const steps=[]
if(['default','all','coverage','unit'].includes(mode))steps.push(['Frontend unit/components',frontend,root])
if(['default','all'].includes(mode))steps.push(['API and PostgreSQL integration',['server/node_modules/tsx/dist/cli.mjs','--test',...serverTests.map(name=>'server/'+name)],root])
if(mode==='unit')steps.push(['Server unit validation',['server/node_modules/tsx/dist/cli.mjs','--test',...serverTests.filter(name=>['validation.test.ts','avatar.test.ts','learning-validation.test.ts','preview.test.ts'].some(file=>name.endsWith('/'+file))).map(name=>'server/'+name)],root])
if(['all','e2e'].includes(mode)){
 steps.push(['Compile API',['server/node_modules/typescript/bin/tsc','--project','server/tsconfig.json'],root])
 if(mode==='all')steps.push(['Production frontend build',['node_modules/vite/bin/vite.js','build'],root])
 for(const [label,file] of [['Profile and photo browser flow','check-profile-flow.mjs'],['Learning and admin browser flow','check-learning-flow.mjs'],['All lesson visuals','check-lesson-visuals.mjs'],['Admin workspace and isolated preview','check-admin-preview.mjs']])steps.push([label,['scripts/'+file],root])
}
if(!steps.length)throw new Error('Unknown test group: '+mode)
for(const [name,args,cwd] of steps){
 console.log('\n'+name)
 const status=await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,args,{cwd,stdio:'inherit',windowsHide:true,env:process.env})
  child.once('error',reject);child.once('exit',(code,signal)=>resolve(signal?1:code??1))
 })
 if(status!==0){process.exitCode=status;break}
}
