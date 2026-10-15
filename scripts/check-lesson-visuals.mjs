import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync, writeFileSync, unlinkSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'
import { learningFixture } from './learning-fixture.mjs'
const require=createRequire(import.meta.url)
const runtime=process.env.PLAYWRIGHT_MODULE_PATH||join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd(),runtime]}))
const executablePath=[process.env.CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p=>p&&existsSync(p))
const fixture=await learningFixture(),browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})})
const configPath=join(process.cwd(),'.check-visual-vite.mjs')
writeFileSync(configPath,`import original from './vite.config.js';export default input=>{const c=original(input);return {...c,server:{...c.server,port:5192,strictPort:true,open:false,proxy:{'/api':{target:'${fixture.origin}',changeOrigin:true}}}}};`,{flag:'wx'})
const vite=spawn(process.execPath,['node_modules/vite/bin/vite.js','--config',configPath,'--host','127.0.0.1'],{windowsHide:true,stdio:'pipe',env:{...process.env,VITE_SUPABASE_URL:'https://visual-check.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_visual_fixture'}})
const errors=[],token=fixture.sessions[0].access_token
async function api(path,body,method=body?'POST':'GET') {
 const response=await fetch(fixture.origin+'/api'+path,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})})
 const result=await response.json();assert.ok(response.ok,JSON.stringify(result));return result
}
const navigate=(page,path)=>page.evaluate(path=>{history.pushState({},'',path);dispatchEvent(new PopStateEvent('popstate'))},path)
try {
 const catalog=await api('/catalog')
 // Complete the prerequisite on the fixture server; no real Supabase accounts are used.
 for(const grade of ['SD','SMP','SMA']) {
  await api('/v1/me/profile',{name:'Siswa',grade,goal:'Mengenal kata'},'PATCH')
  let a=await api('/v1/me/learning/attempts',{kind:'assessment'})
  while(a.status==='active')a=await api('/v1/me/learning/attempts/'+a.id+'/answers',{questionId:a.question.id,answer:fixture.keys.get(a.question.id),requestId:crypto.randomUUID()})
 }
 const page=await browser.newPage({viewport:{width:1366,height:900}})
 page.on('pageerror',e=>errors.push(e.message))
 await page.route('https://visual-check.supabase.co/**',route=>{const path=new URL(route.request().url()).pathname;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(path.endsWith('/token')?fixture.sessions[0]:path.endsWith('/user')?fixture.users[0]:{})})})
 for(let i=0;i<40;i++){try{await page.goto('http://127.0.0.1:5192');break}catch{await new Promise(r=>setTimeout(r,200))}}
 await page.getByRole('heading',{name:'Caramu belajar, cerita hebatmu.'}).waitFor()
 await navigate(page,'/signin');await page.getByLabel('Email',{exact:true}).fill(fixture.users[0].email);await page.getByLabel('Kata sandi',{exact:true}).fill('FixturePassword123!');await page.getByRole('button',{name:'Masuk dan lanjutkan',exact:true}).click();await page.getByRole('heading',{name:'Halo, Siswa!',exact:true}).waitFor()
 for(const grade of ['SD','SMP','SMA']) {
  await api('/v1/me/profile',{name:'Siswa',grade,goal:'Mengenal kata'},'PATCH')
  await page.reload();await page.getByRole('heading',{name:'Halo, Siswa!',exact:true}).waitFor()
  for(const lesson of catalog.lessons.filter(l=>l.grade===grade)) {
   await navigate(page,'/lesson/'+lesson.id)
   const intro=page.locator('.lesson-big-visual');await intro.waitFor();assert.equal(await intro.innerText(),lesson.visual)
   assert.ok(await intro.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=32),'Intro uses the existing visual CSS')
   await page.getByRole('button',{name:'Mulai belajar',exact:true}).click()
   const explanation=page.locator('.visual-explanation > span');await explanation.waitFor();assert.equal(await explanation.innerText(),lesson.visual)
   await page.getByRole('button',{name:'Lanjut ke latihan',exact:true}).click()
   const visual=page.locator('.question-visual');await visual.waitFor();assert.equal(await visual.innerText(),lesson.practice.visual||lesson.visual,'Question visual takes priority; missing visual inherits lesson context')
   if(lesson.id==='sd-hitung') {
    await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('.lesson-main').screenshot({path:join(tmpdir(),'bahasakita-lesson-visual-mobile.png')});await page.setViewportSize({width:1366,height:900});await page.locator('.lesson-main').screenshot({path:join(tmpdir(),'bahasakita-lesson-visual-desktop.png')})
   }
   const attempt=await api('/v1/me/learning/attempts',{kind:'lesson',lesson:lesson.id})
   await api('/v1/me/learning/attempts/'+attempt.id+'/stage',{stage:3},'PATCH')
   await navigate(page,'/learning');await page.getByRole('heading',{name:'Jalur yang dibuat untukmu.',exact:true}).waitFor();await navigate(page,'/lesson/'+lesson.id)
   await page.getByText('Soal 1 dari 5',{exact:true}).waitFor();assert.equal(await page.locator('.question-visual').innerText(),lesson.visual,'Evaluation retains the lesson visual when question visual is empty')
  }
 }
 assert.deepEqual(errors,[])
 console.log('PASS: visuals across all 12 SD/SMP/SMA lessons at introduction, explanation, choice/word-order practice and evaluation; question-specific priority, existing intro styles, and mobile layout. PostgreSQL fixture only.')
}finally{await browser.close();vite.kill();await fixture.close();try{unlinkSync(configPath)}catch{}}
