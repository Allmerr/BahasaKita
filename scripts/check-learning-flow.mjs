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
const fixture=await learningFixture()
const browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})})
const configPath=join(process.cwd(),'.check-learning-vite.mjs')
writeFileSync(configPath,`import original from './vite.config.js';export default input=>{const c=original(input);return {...c,server:{...c.server,port:5191,strictPort:true,open:false,proxy:{'/api':{target:'${fixture.origin}',changeOrigin:true}}}}};`,{flag:'wx'})
const vite=spawn(process.execPath,['node_modules/vite/bin/vite.js','--config',configPath,'--host','127.0.0.1'],{windowsHide:true,stdio:'pipe',env:{...process.env,VITE_SUPABASE_URL:'https://learning-check.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_learning_fixture'}})
const errors=[]
const api=async(path,user=0,body,method=body?'POST':'GET')=>{
 const response=await fetch(fixture.origin+'/api'+path,{method,headers:{Authorization:'Bearer '+fixture.sessions[user].access_token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})})
 return {status:response.status,data:await response.json()}
}
const state=async()=> (await api('/v1/me/learning')).data
async function pageFor(index) {
 const context=await browser.newContext({viewport:{width:1366,height:900}})
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message))
 await page.route('https://learning-check.supabase.co/**',route=>{const path=new URL(route.request().url()).pathname;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(path.endsWith('/token')?fixture.sessions[index]:path.endsWith('/user')?fixture.users[index]:{})})})
 for(let i=0;i<40;i++){try{await page.goto('http://127.0.0.1:5191');break}catch{await new Promise(r=>setTimeout(r,200))}}
 await page.getByRole('heading',{name:'Caramu belajar, cerita hebatmu.'}).waitFor()
 await navigate(page,'/signin');await page.getByLabel('Email',{exact:true}).fill(fixture.users[index].email);await page.getByLabel('Kata sandi',{exact:true}).fill('FixturePassword123!');await page.getByRole('button',{name:'Masuk dan lanjutkan',exact:true}).click();await page.getByRole('heading',{name:/Halo, |Bukan ujian|Kelola materi & asesmen/ }).waitFor({timeout:10000}).catch(async e=>{console.log(await page.locator('body').innerText());console.log('Browser errors',errors);throw e})
 return page
}
const navigate=(page,path)=>page.evaluate(path=>{history.pushState({},'',path);dispatchEvent(new PopStateEvent('popstate'))},path)
const choose=async(page,q)=>{await page.getByRole('heading',{name:q.prompt,exact:true}).waitFor();await page.locator('.answer-option').nth(fixture.keys.get(q.id)).click()}
try {
 const catalog=(await api('/catalog')).data;assert.equal(catalog.lessons.length,12);assert.ok(!JSON.stringify(catalog).includes('"answer"'))
 assert.equal((await fetch(fixture.origin+'/api/v1/me/learning')).status,401)
 assert.equal((await api('/v1/me/admin/content')).status,403)
 const page=await pageFor(0);await navigate(page,'/assessment');await page.getByRole('button',{name:'Mulai asesmen',exact:true}).click();await page.getByText('Soal 1 dari 8',{exact:true}).waitFor()
 let a=(await state()).activeAssessment
 await choose(page,a.question);await page.getByRole('button',{name:'Lanjut',exact:true}).click()
 await page.getByText('Soal 2 dari 8',{exact:true}).waitFor()
 await page.getByRole('link',{name:'Jeda & kembali ke beranda',exact:true}).click();await page.reload();await navigate(page,'/assessment');await page.getByText('Soal 2 dari 8',{exact:true}).waitFor()
 // Simulate an answer committed in the DB whose HTTP response is lost.
 await page.route('**/api/v1/me/learning/attempts/*/answers',async route=>{await route.fetch();await route.abort('failed');await page.unroute('**/api/v1/me/learning/attempts/*/answers')},{times:1})
 a=(await state()).activeAssessment;await choose(page,a.question);await page.getByRole('button',{name:'Lanjut',exact:true}).click();await page.getByRole('button',{name:'Coba simpan lagi',exact:true}).waitFor();await page.getByRole('button',{name:'Coba simpan lagi',exact:true}).click();await page.getByText('Soal 3 dari 8',{exact:true}).waitFor();assert.equal((await state()).activeAssessment.answered,2)
 for(let n=2;n<8;n++){a=(await state()).activeAssessment;await choose(page,a.question);await page.getByRole('button',{name:'Lanjut',exact:true}).click();await page.getByText(n===7?'Nilai asesmenmu 100/100. Batas kelulusan adalah 80.':`Soal ${n+2} dari 8`,{exact:true}).waitFor()}
 assert.equal((await state()).attempts[0].score,100)
 await page.getByRole('link',{name:'Lanjut belajar',exact:true}).click();await page.getByRole('heading',{name:'Jalur yang dibuat untukmu.',exact:true}).waitFor()
 await navigate(page,'/lesson/sd-tumbuhan');await page.getByRole('button',{name:'Mulai belajar',exact:true}).click();await page.getByRole('button',{name:'Lanjut ke latihan',exact:true}).click()
 let l=(await api('/v1/me/learning/attempts',0,{kind:'lesson',lesson:'sd-tumbuhan'})).data
 await choose(page,l.practice);await page.getByRole('button',{name:'Periksa jawaban',exact:true}).click();await page.getByRole('button',{name:'Mulai evaluasi',exact:true}).click()
 await choose(page,l.question);await page.getByRole('button',{name:'Periksa jawaban',exact:true}).click();await page.getByRole('button',{name:'Soal berikutnya',exact:true}).waitFor()
 await page.reload();await page.getByRole('heading',{name:'Halo, Siswa!',exact:true}).waitFor();await navigate(page,'/lesson/sd-tumbuhan');await page.getByText('Soal 2 dari 5',{exact:true}).waitFor()
 for(let n=1;n<5;n++){l=(await api('/v1/me/learning/attempts/'+l.id)).data;await choose(page,l.question);await page.getByRole('button',{name:'Periksa jawaban',exact:true}).click();await page.getByRole('button',{name:n===4?'Lihat hasil':'Soal berikutnya',exact:true}).click()}
 await page.getByRole('heading',{name:'Materi sudah kamu kuasai!',exact:true}).waitFor();assert.deepEqual((await state()).mastered,['sd-tumbuhan'])
 await navigate(page,'/progress');await page.getByRole('heading',{name:'Kemajuan saya',exact:true}).waitFor();await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:join(tmpdir(),'bahasakita-learning-progress-mobile.png'),fullPage:true})
 const admin=await pageFor(2);await navigate(admin,'/admin');await admin.getByRole('heading',{name:'Kelola materi & asesmen',exact:true}).waitFor();await admin.locator('.admin-row').filter({hasText:'Kenali tumbuhan dan buah'}).click();await admin.getByLabel('Judul materi',{exact:true}).fill('Materi tumbuhan dari admin');await admin.getByRole('button',{name:'Simpan draft',exact:true}).click();await admin.getByText('Draft tersimpan. Tekan Terbitkan agar versi ini tampil kepada siswa.',{exact:true}).waitFor()
 assert.equal((await api('/catalog')).data.lessons.find(l=>l.id==='sd-tumbuhan').title,'Kenali tumbuhan dan buah')
 await admin.getByRole('button',{name:'Terbitkan versi 2',exact:true}).click();await admin.getByText('Versi baru berhasil diterbitkan. Sesi siswa yang sedang berjalan tetap memakai versi sebelumnya.',{exact:true}).waitFor();assert.equal((await api('/catalog')).data.lessons.find(l=>l.id==='sd-tumbuhan').title,'Materi tumbuhan dari admin');assert.deepEqual((await state()).mastered,[])
 await admin.getByRole('button',{name:'Soal asesmen',exact:true}).click();await admin.locator('.admin-row').filter({hasText:'SD · Kosakata · Awal'}).click();await admin.getByLabel('Pertanyaan',{exact:true}).fill('Apa nama buah pada gambar ini?');await admin.getByRole('button',{name:'Simpan draft',exact:true}).click();await admin.getByRole('button',{name:'Terbitkan versi 2',exact:true}).waitFor();await admin.getByRole('button',{name:'Terbitkan versi 2',exact:true}).click();await admin.getByText('Versi baru berhasil diterbitkan. Sesi siswa yang sedang berjalan tetap memakai versi sebelumnya.',{exact:true}).waitFor()
 await admin.getByRole('button',{name:'Kelas dasar',exact:true}).click();await admin.locator('.admin-row').first().click();await admin.getByLabel('Judul materi',{exact:true}).fill('Kelas dasar dari admin');await admin.getByRole('button',{name:'Simpan draft',exact:true}).click();await admin.getByRole('button',{name:'Terbitkan versi 2',exact:true}).waitFor();await admin.getByRole('button',{name:'Terbitkan versi 2',exact:true}).click();await admin.getByText('Versi baru berhasil diterbitkan. Sesi siswa yang sedang berjalan tetap memakai versi sebelumnya.',{exact:true}).waitFor();assert.ok((await api('/catalog')).data.basicMaterials.some(m=>m.title==='Kelas dasar dari admin'))
 await admin.setViewportSize({width:390,height:844});assert.ok(await admin.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await admin.screenshot({path:join(tmpdir(),'bahasakita-admin-mobile.png'),fullPage:true});await admin.setViewportSize({width:1366,height:900});await admin.screenshot({path:join(tmpdir(),'bahasakita-admin-desktop.png'),fullPage:true})
 const studentB=await pageFor(1);await navigate(studentB,'/assessment');await studentB.getByRole('button',{name:'Mulai asesmen',exact:true}).click();for(let n=0;n<8;n++){await studentB.getByText(`Soal ${n+1} dari 8`,{exact:true}).waitFor();await studentB.getByRole('button',{name:'Saya belum tahu',exact:true}).click()};await studentB.getByRole('link',{name:'Masuk kelas belajar dasar',exact:true}).click();await studentB.getByRole('heading',{name:'Kelas belajar dasar',exact:true}).waitFor();assert.equal((await api('/v1/me/learning',1)).data.attempts[0].score,0);await navigate(studentB,'/admin');await studentB.getByText('Akunmu belum memiliki akses untuk mengelola konten.',{exact:true}).waitFor()
 assert.deepEqual(errors,[])
 console.log('PASS: real Express + PostgreSQL grading, adaptive assessment/resume, lost-response retry, lesson mastery/resume, admin drafts/publishing for lessons/questions/basic, student restrictions, account isolation and mobile layout. Auth uses test sessions; cloud Supabase is untouched.')
}catch(error){for(const c of browser.contexts())for(const p of c.pages()){console.log('Page at failure',p.url(),(await p.locator('body').innerText()).slice(-2200));await p.screenshot({path:join(tmpdir(),'bahasakita-learning-failure-'+browser.contexts().indexOf(c)+'.png'),fullPage:true})}console.log('Browser errors',errors);throw error}finally{await browser.close();vite.kill();await fixture.close();try{unlinkSync(configPath)}catch{}}
