import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { existsSync,writeFileSync,unlinkSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { learningFixture } from './learning-fixture.mjs'
const executablePath=[process.env.CHROME_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(p=>p&&existsSync(p))
const fixture=await learningFixture(),browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})}),errors=[]
const configPath=join(process.cwd(),'.check-support-vite.mjs')
writeFileSync(configPath,`import original from './vite.config.js';export default input=>{const c=original(input);return {...c,server:{...c.server,port:5194,strictPort:true,open:false,proxy:{'/api':{target:'${fixture.origin}',changeOrigin:true}}}}};`,{flag:'wx'})
const vite=spawn(process.execPath,['node_modules/vite/bin/vite.js','--config',configPath,'--host','127.0.0.1'],{windowsHide:true,stdio:'pipe',env:{...process.env,VITE_SUPABASE_URL:'https://support-check.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_support_fixture'}})
const api=async(index,path,body,method=body?'POST':'GET')=>{
 const r=await fetch(fixture.origin+'/api/v1/me'+path,{method,headers:{Authorization:'Bearer '+fixture.sessions[index].access_token,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,data:await r.json()}
}
const navigate=(page,path)=>page.evaluate(path=>{history.pushState({},'',path);dispatchEvent(new PopStateEvent('popstate'))},path)
const pages=[]
async function login(index){
 const context=await browser.newContext({viewport:{width:1366,height:900}}),page=await context.newPage();pages.push(page);page.on('pageerror',e=>errors.push(e.message))
 await page.route('https://support-check.supabase.co/**',route=>{const path=new URL(route.request().url()).pathname;return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(path.endsWith('/token')?fixture.sessions[index]:path.endsWith('/user')?fixture.users[index]:{})})})
 for(let n=0;n<50;n++){try{await page.goto('http://127.0.0.1:5194');break}catch{await new Promise(r=>setTimeout(r,200))}}
 await page.getByRole('heading',{name:'Caramu belajar, cerita hebatmu.'}).waitFor();await navigate(page,'/signin');await page.getByLabel('Email',{exact:true}).fill(fixture.users[index].email);await page.getByLabel('Kata sandi',{exact:true}).fill('SupportPassword123!');await page.getByRole('button',{name:'Masuk dan lanjutkan',exact:true}).click()
 await page.getByRole('heading',{name:index===3?'Dashboard guru':index===4?'Dashboard orang tua':'Bukan ujian. Ini titik awalmu.',exact:true}).waitFor();return page
}
try{
 const student=await login(0);await navigate(student,'/support');await student.getByRole('heading',{name:'Pendamping belajarku',exact:true}).waitFor();await student.getByRole('button',{name:'Buat kode undangan',exact:true}).click();const teacherCode=await student.getByLabel('Kode undangan',{exact:true}).innerText()
 assert.equal((await api(4,'/support/redeem',{code:teacherCode})).status,400)
 const teacher=await login(3);assert.equal(await teacher.getByRole('link',{name:'Beranda',exact:true}).count(),0);assert.equal(await teacher.locator('.assessment-access-notice').count(),0)
 await teacher.getByLabel('Kode undangan siswa').fill(teacherCode);await teacher.getByRole('button',{name:'Hubungkan siswa',exact:true}).click();await teacher.getByRole('heading',{name:'Perkembangan Siswa',exact:true}).waitFor()
 assert.equal((await api(5,'/support/students/'+fixture.users[0].id)).status,403);assert.equal((await api(3,'/support/students/'+fixture.users[1].id)).status,403)
 await teacher.getByLabel('Materi tugas').selectOption({label:'Kenali tumbuhan dan buah'});await teacher.getByLabel('Judul tugas',{exact:true}).fill('Penguatan dari Bu Guru');await teacher.getByLabel('Arahan tugas',{exact:true}).fill('Cocokkan gambar dengan nama buah.');await teacher.getByRole('button',{name:'Berikan tugas',exact:true}).click();await teacher.getByText('Tugas diberikan.',{exact:true}).waitFor()
 // A lost response must not create duplicate feedback when the same form is retried.
 let dropped=false;await teacher.route('**/api/v1/me/support/notes',async route=>{if(!dropped&&route.request().method()==='POST'){dropped=true;await route.fetch();return route.abort('failed')}return route.continue()})
 await teacher.getByLabel('Catatan untuk siswa').fill('Perhatikan nama buah pada gambar.');await teacher.getByRole('button',{name:'Simpan catatan',exact:true}).click();await teacher.locator('[role="alert"]').last().waitFor();await teacher.getByRole('button',{name:'Simpan catatan',exact:true}).click();await teacher.getByText('Catatan tersimpan.',{exact:true}).waitFor();assert.equal((await api(3,'/support/students/'+fixture.users[0].id)).data.notes.length,1)
 await student.getByRole('button',{name:'Perbarui tugas'}).click();await student.getByText('Penguatan dari Bu Guru',{exact:true}).waitFor();await student.getByText('Perhatikan nama buah pada gambar.',{exact:true}).waitFor();assert.equal(await student.getByRole('button',{name:'Tarik tugas',exact:true}).count(),0)
 await student.getByLabel('Jenis pendamping').selectOption('parent');await student.getByRole('button',{name:'Buat kode undangan',exact:true}).click();await student.getByText('Kode untuk Orang tua',{exact:true}).waitFor();const parentCode=await student.getByLabel('Kode undangan',{exact:true}).innerText()
 const parent=await login(4);await parent.getByLabel('Kode undangan siswa').fill(parentCode);await parent.getByRole('button',{name:'Hubungkan siswa',exact:true}).click();await parent.getByRole('heading',{name:'Kegiatan bersama di rumah',exact:true}).waitFor();assert.equal(await parent.getByRole('button',{name:'Berikan tugas',exact:true}).count(),0);assert.equal(await parent.getByLabel('Catatan untuk siswa').count(),0)
 assert.equal((await api(4,'/support/notes',{studentId:fixture.users[0].id,body:'Forged parent note',requestId:crypto.randomUUID()})).status,403)
 let a=(await api(0,'/learning/attempts',{kind:'assessment'})).data;while(a.status==='active')a=(await api(0,'/learning/attempts/'+a.id+'/answers',{questionId:a.question.id,answer:fixture.keys.get(a.question.id),requestId:crypto.randomUUID()})).data
 a=(await api(0,'/learning/attempts',{kind:'lesson',lesson:'sd-tumbuhan'})).data;while(a.status==='active')a=(await api(0,'/learning/attempts/'+a.id+'/answers',{questionId:a.question.id,answer:fixture.keys.get(a.question.id),requestId:crypto.randomUUID()})).data
 await student.getByRole('button',{name:'Perbarui tugas'}).click();await student.locator('.support-item').filter({has:student.getByRole('heading',{name:'Penguatan dari Bu Guru',exact:true})}).getByText('Selesai',{exact:true}).waitFor()
 await parent.getByRole('button',{name:'Perbarui progres'}).click();await parent.getByText('1/4',{exact:true}).waitFor();await teacher.getByRole('button',{name:'Perbarui progres'}).click();await teacher.getByText('1/4',{exact:true}).waitFor()
 await teacher.setViewportSize({width:390,height:844});assert.ok(await teacher.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await teacher.screenshot({path:join(tmpdir(),'bahasakita-teacher-mobile.png'),fullPage:true})
 await parent.screenshot({path:join(tmpdir(),'bahasakita-parent-desktop.png'),fullPage:true});await student.screenshot({path:join(tmpdir(),'bahasakita-student-support.png'),fullPage:true})
 await student.getByRole('button',{name:'Perbarui tugas'}).click();const teacherCard=student.locator('.support-item').filter({has:student.getByRole('heading',{name:'Bu Guru',exact:true})});await teacherCard.getByRole('button',{name:'Putuskan hubungan',exact:true}).click();await teacherCard.getByRole('button',{name:'Ya, putuskan hubungan',exact:true}).click();await student.getByText('Hubungan pendampingan diputuskan.',{exact:true}).waitFor();assert.equal((await api(3,'/support/students/'+fixture.users[0].id)).status,403)
 await teacher.getByRole('button',{name:'Perbarui progres'}).click();await teacher.getByText(/Belum ada siswa terhubung/).waitFor();assert.equal((await api(3,'/support/redeem',{code:teacherCode})).status,400);assert.deepEqual(errors,[])
 console.log('PASS: linked teacher/parent dashboards, single-use student invites, scoped access, tasks, idempotent note retry, real grading-based completion, parent restrictions, consent revocation and mobile layout. Cloud data untouched.')
}catch(e){for(let i=0;i<pages.length;i++){console.log('PAGE '+i+': '+(await pages[i].locator('body').innerText()).slice(-1800));await pages[i].screenshot({path:join(tmpdir(),'bahasakita-support-failure-'+i+'.png'),fullPage:true})}throw e}
finally{await browser.close();vite.kill();await fixture.close();try{unlinkSync(configPath)}catch{}}
