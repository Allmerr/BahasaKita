import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { existsSync,writeFileSync,unlinkSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { homedir,tmpdir } from 'node:os'
import { join } from 'node:path'
import { learningFixture } from './learning-fixture.mjs'
const require=createRequire(import.meta.url),runtime=process.env.PLAYWRIGHT_MODULE_PATH||join(homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')
const {chromium}=require(require.resolve('playwright',{paths:[process.cwd(),runtime]}))
const executablePath=[process.env.CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p=>p&&existsSync(p))
const fixture=await learningFixture(),browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})})
const configPath=join(process.cwd(),'.check-preview-vite.mjs')
writeFileSync(configPath,`import original from './vite.config.js';export default input=>{const c=original(input);return {...c,server:{...c.server,port:5193,strictPort:true,open:false,proxy:{'/api':{target:'${fixture.origin}',changeOrigin:true}}}}};`,{flag:'wx'})
const vite=spawn(process.execPath,['node_modules/vite/bin/vite.js','--config',configPath,'--host','127.0.0.1'],{windowsHide:true,stdio:'pipe',env:{...process.env,VITE_SUPABASE_URL:'https://preview-check.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_preview_fixture'}})
const errors=[]
async function api(path,user=2,body,method=body?'POST':'GET'){
 const r=await fetch(fixture.origin+'/api/v1/me'+path,{method,headers:{Authorization:'Bearer '+fixture.sessions[user].access_token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}
}
const navigate=(page,path)=>page.evaluate(path=>{history.pushState({},'',path);dispatchEvent(new PopStateEvent('popstate'))},path)
let page
try{
 page=await browser.newPage({viewport:{width:1366,height:900}});page.on('pageerror',e=>errors.push(e.message))
 await page.route('https://preview-check.supabase.co/**',route=>{const path=new URL(route.request().url()).pathname;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(path.endsWith('/token')?fixture.sessions[2]:path.endsWith('/user')?fixture.users[2]:{})})})
 for(let n=0;n<40;n++){try{await page.goto('http://127.0.0.1:5193');break}catch{await new Promise(r=>setTimeout(r,200))}}
 await page.getByRole('heading',{name:'Caramu belajar, cerita hebatmu.'}).waitFor();await navigate(page,'/signin');await page.getByLabel('Email',{exact:true}).fill(fixture.users[2].email);await page.getByLabel('Kata sandi',{exact:true}).fill('PreviewPassword123!');await page.getByRole('button',{name:'Masuk dan lanjutkan',exact:true}).click()
 await page.getByRole('heading',{name:'Kelola materi & asesmen',exact:true}).waitFor();await page.waitForURL('**/admin')
 assert.equal(await page.getByRole('link',{name:'Beranda',exact:true}).count(),0);assert.equal(await page.locator('.assessment-access-notice').count(),0)
 await navigate(page,'/assessment');await page.waitForURL('**/admin')
 const originalProfile=(await api('')).data,originalLearning=(await api('/learning')).data
 const responsePromise=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/v1/me/admin/preview'&&r.request().method()==='POST')
 await page.getByRole('button',{name:'Lihat sebagai siswa',exact:true}).click();const record=await (await responsePromise).json(),prefix='/admin/preview/'+record.id
 await page.getByRole('region',{name:'Mode pratinjau siswa'}).waitFor();assert.ok(!JSON.stringify(record).includes('"answer":'));assert.equal((await api(prefix,0)).status,403)
 await navigate(page,'/assessment');await page.getByRole('button',{name:'Mulai asesmen',exact:true}).click();await page.getByText('Soal 1 dari 8',{exact:true}).waitFor()
 for(let n=0;n<8;n++){
  const a=(await api(prefix+'/learning')).data.activeAssessment
  await page.getByRole('heading',{name:a.question.prompt,exact:true}).waitFor();await page.locator('.answer-option').nth(fixture.keys.get(a.question.id)).click();await page.getByRole('button',{name:'Lanjut',exact:true}).click()
  await page.getByText(n===7?'Nilai asesmenmu 100/100. Batas kelulusan adalah 80.':`Soal ${n+2} dari 8`,{exact:true}).waitFor()
  if(n===0){await page.reload();await page.getByText('Soal 2 dari 8',{exact:true}).waitFor();await page.getByRole('region',{name:'Mode pratinjau siswa'}).waitFor()}
 }
 await navigate(page,'/lesson/sd-tumbuhan');await page.getByRole('button',{name:'Mulai belajar',exact:true}).click();await page.getByRole('button',{name:'Lanjut ke latihan',exact:true}).click()
 let l=(await api(prefix+'/learning/attempts',2,{kind:'lesson',lesson:'sd-tumbuhan'})).data
 await page.locator('.answer-option').nth(fixture.keys.get(l.practice.id)).click();await page.getByRole('button',{name:'Periksa jawaban',exact:true}).click();await page.getByRole('button',{name:'Mulai evaluasi',exact:true}).click()
 for(let n=0;n<5;n++){
  l=(await api(prefix+'/learning/attempts/'+l.id)).data;await page.getByRole('heading',{name:l.question.prompt,exact:true}).waitFor();await page.locator('.answer-option').nth(fixture.keys.get(l.question.id)).click();await page.getByRole('button',{name:'Periksa jawaban',exact:true}).click();await page.getByRole('button',{name:n===4?'Lihat hasil':'Soal berikutnya',exact:true}).click()
 }
 await page.getByRole('heading',{name:'Materi sudah kamu kuasai!',exact:true}).waitFor();assert.deepEqual((await api(prefix+'/learning')).data.mastered,['sd-tumbuhan'])
 assert.deepEqual((await api('/learning')).data,originalLearning)
 await navigate(page,'/settings');await page.getByLabel('Nama panggilan',{exact:true}).fill('Siswa uji baru');await page.locator('select[name="grade"]').selectOption('SMP');await page.getByRole('button',{name:'Simpan profil',exact:true}).click();await page.getByText('Nama, jenjang, dan tujuan belajar berhasil disimpan.',{exact:true}).waitFor();assert.deepEqual((await api('')).data,originalProfile);assert.equal((await api(prefix+'/learning')).data.assessment,null)
 assert.equal(await page.getByRole('button',{name:'Keluar akun',exact:true}).count(),0);assert.equal(await page.getByRole('button',{name:'Bersihkan arsip perangkat',exact:true}).count(),0)
 await page.getByLabel('Jenjang pratinjau').selectOption('SMA');await page.getByRole('heading',{name:'Halo, Siswa uji baru!',exact:true}).waitFor();assert.equal((await api(prefix+'/learning')).data.profile.grade,'SMA')
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:join(tmpdir(),'bahasakita-student-preview-mobile.png'),fullPage:true})
 await page.getByRole('button',{name:'Kembali ke admin',exact:true}).click();await page.getByRole('heading',{name:'Kelola materi & asesmen',exact:true}).waitFor();await page.waitForURL('**/admin');assert.equal((await api(prefix)).status,404);assert.deepEqual((await api('/learning')).data,originalLearning);assert.deepEqual((await api('')).data,originalProfile)
 assert.equal(await page.getByRole('link',{name:'Beranda',exact:true}).count(),0);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.setViewportSize({width:1366,height:900});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:join(tmpdir(),'bahasakita-admin-workspace-desktop.png'),fullPage:true})
 assert.deepEqual(errors,[])
 console.log('PASS: admin default workspace, hidden learner navigation, isolated preview assessment/mastery/profile/grades, reload/resume, student denial, return/delete, no real account progress writes and mobile layout.')
}catch(e){if(page){console.log((await page.locator('body').innerText()).slice(-1800));await page.screenshot({path:join(tmpdir(),'bahasakita-preview-failure.png'),fullPage:true})}throw e}
finally{await browser.close();vite.kill();await fixture.close();try{unlinkSync(configPath)}catch{}}
