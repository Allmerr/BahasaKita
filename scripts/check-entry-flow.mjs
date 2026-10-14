import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { youtubeMaterials } from '../src/youtubeMaterials.js'
import { dictionaryForGrade } from '../src/gradeDictionary.js'
import { lessonsForGrade } from '../src/gradeLessons.js'
const require = createRequire(import.meta.url)
const { chromium } = require('C:/Users/Faris Daffa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5178'], { stdio: 'pipe' })
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
try {
 const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })
 const errors = []; page.on('pageerror', error => errors.push(error.message))
 for (let i = 0; i < 30; i++) { try { await page.goto('http://127.0.0.1:5178'); break } catch { await new Promise(resolve => setTimeout(resolve, 200)) } }
 await page.getByRole('heading', { name: 'Caramu belajar, cerita hebatmu.' }).waitFor()
 const route = async path => { await page.evaluate(path => { history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')) }, path) }
 await route('/signup')
 await page.getByLabel('Nama panggilan').fill('Uji Belajar')
 await page.getByLabel('Email', { exact: true }).fill('uji@example.com')
 await page.getByLabel('Kata sandi', { exact: true }).fill('Belajar123!')
 await page.getByLabel('Konfirmasi kata sandi').fill('Belajar123!')
 await page.getByLabel('Jenjang belajar').selectOption('SD')
 await page.getByRole('button', { name: 'Register', exact: true }).click()
 await page.waitForURL('**/assessment')
 for (const [path, label, heading, action] of [
  ['/', 'Beranda', 'Caramu belajar, cerita hebatmu.', 'Mulai perjalananmu'],
  ['/learning', 'Belajar', 'Jalur yang dibuat untukmu.', 'Mulai asesmen'],
  ['/dictionary', 'Kamus visual', 'Kamus visual', 'Putar video Tumbuhan di sekitar kita'],
  ['/progress', 'Kemajuan saya', 'Kemajuan saya', 'Mulai asesmen'],
 ]) {
  await page.locator('.sidebar nav').getByRole('link', { name: label, exact: true }).click();
  await page.waitForURL('http://127.0.0.1:5178' + path);
  await page.getByRole('heading', { name: heading, exact: true }).waitFor();
  assert.equal(await page.locator('.assessment-access-notice').count(), 1);
  const control = page.getByRole(path === '/dictionary' ? 'button' : 'link', { name: action, exact: true });
  await control.click(); await page.waitForURL('**/assessment');
  assert.equal(await page.locator('iframe').count(), 0, 'No video before assessment');
 }
 await route('/dictionary'); await page.getByLabel('Cari kata', { exact: true }).focus(); await page.waitForURL('**/assessment');
 await route('/lesson/sd-tumbuhan'); await page.waitForURL('**/assessment');
 await page.locator('.sidebar-profile').click(); await page.waitForURL('**/profile');
 await page.getByRole('link', { name: 'Edit profil', exact: true }).click(); await page.waitForURL('**/assessment');
 await page.getByRole('button', { name: 'Mulai asesmen', exact: true }).click()
 for (let i = 0; i < 8; i++) await page.getByRole('button', { name: 'Saya belum tahu', exact: true }).click()
 await page.getByRole('heading', { name: 'Mulai dari kelas belajar dasar 🌱' }).waitFor()
 await page.getByRole('link', { name: 'Masuk kelas belajar dasar' }).click()
 await page.getByRole('heading', { name: 'Kelas belajar dasar', exact: true }).waitFor()
 for (const label of ['Beranda', 'Belajar', 'Kamus visual', 'Kemajuan saya', 'Kelas Dasar']) assert.equal(await page.locator('.sidebar nav').getByRole('link', { name: label, exact: true }).count(), 1)
 for (const title of ['Mengenal kata dan arti', 'Memahami dan menyusun kalimat', 'Menemukan informasi dalam bacaan', 'Penjumlahan dan pengurangan dasar']) {
  await page.getByRole('button', { name: new RegExp(title) }).click()
  await page.waitForFunction(() => document.querySelector('video')?.readyState >= 1)
  const video = await page.locator('video').evaluate(async video => { await video.play(); return { width: video.videoWidth, error: video.error?.message } })
  assert.equal(video.width, 1280); assert.equal(video.error, undefined)
 }
 await page.screenshot({ path: join(tmpdir(), 'bahasakita-basic-desktop.png'), fullPage: true })
 await page.setViewportSize({ width: 390, height: 844 })
 assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'No mobile overflow')
 await page.screenshot({ path: join(tmpdir(), 'bahasakita-basic-mobile.png'), fullPage: true })
 assert.equal(await page.locator('.bottom-nav a').count(), 5)
 await page.locator('.bottom-nav').getByRole('link', { name: 'Beranda', exact: true }).click()
 await page.waitForURL('http://127.0.0.1:5178/'); await page.getByRole('heading', { name: 'Caramu belajar, cerita hebatmu.' }).waitFor()
 await page.getByRole('link', { name: 'Lanjutkan kelas dasar', exact: true }).click(); await page.waitForURL('**/basic-class')
 for (const path of ['/learning', '/dictionary', '/progress', '/lesson/sd-tumbuhan']) { await route(path); await page.waitForURL('**/basic-class'); assert.equal(await page.getByRole('heading', { name: 'Kelas belajar dasar', exact: true }).count(), 1) }
 await page.reload(); await page.getByRole('heading', { name: 'Caramu belajar, cerita hebatmu.' }).waitFor()
 await route('/signin'); await page.getByLabel('Email', { exact: true }).fill('uji@example.com'); await page.getByLabel('Kata sandi', { exact: true }).fill('Belajar123!')
 await page.getByRole('button', { name: 'Masuk dan lanjutkan', exact: true }).click(); await page.waitForURL('**/basic-class')
 await page.getByRole('link', { name: 'Ulangi asesmen awal' }).click()
 await page.getByRole('button', { name: 'Mulai asesmen', exact: true }).click()
 // Seven correct answers out of eight: 87.5, passing the assessment.
 for (const index of [0, 1, 1, 2, 1, 0, 1, 0]) { await page.locator('.answer-options button').nth(index).click(); await page.getByRole('button', { name: 'Lanjut', exact: true }).click() }
 await page.getByRole('heading', { name: 'Semua fitur belajar terbuka ✨' }).waitFor()
 await page.getByRole('link', { name: 'Lanjut belajar', exact: true }).click()
 assert.equal(await page.locator('.path-card a.btn').count(), 4, 'All materials available')
 assert.equal(await page.locator('.bottom-nav a').count(), 4)
 assert.equal(await page.locator('.sidebar nav a[href="/basic-class"], .bottom-nav a[href="/basic-class"]').count(), 0, 'Basic navigation hidden after passing')
 await route('/dictionary'); await page.getByRole('heading', { name: 'Kamus visual', exact: true }).waitFor()
 // Isolate app behavior from external YouTube availability for deterministic UI checks.
 await page.route('https://www.youtube-nocookie.com/embed/**', route => route.fulfill({ contentType: 'text/html', body: '<html><body>Embedded YouTube player</body></html>' }));
 for (const [grade, title, id] of Object.entries(youtubeMaterials).map(([grade, videos]) => [grade, videos[0].title, videos[0].id])) {
  if (grade !== 'SD') { await route('/settings'); await page.locator('select[name=grade]').selectOption(grade); await page.getByRole('button', { name: 'Simpan profil', exact: true }).click(); await route('/dictionary') }
  assert.equal(await page.locator('.youtube-lesson').count(), 2);
  if (grade === 'SD') {
   for (const width of [1366, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Dictionary layout at ' + width);
    await page.screenshot({ path: join(tmpdir(), 'bahasakita-dictionary-' + width + '.png'), fullPage: true });
   }
   await page.setViewportSize({ width: 1366, height: 900 });
   await page.evaluate(() => { document.documentElement.dataset.theme = 'dark' });
   await page.screenshot({ path: join(tmpdir(), 'bahasakita-dictionary-dark.png'), fullPage: true });
   await page.evaluate(() => { document.documentElement.dataset.theme = 'light' });
   await page.setViewportSize({ width: 390, height: 844 });
  }
  assert.equal(await page.locator('.youtube-frame iframe').count(), 0, 'Changing grade clears player');
  await page.getByRole('button', { name: 'Putar video ' + title, exact: true }).click();
  const frame = page.locator('.youtube-frame iframe');
  assert.ok((await frame.getAttribute('src')).includes('/embed/' + id));
  assert.equal(await frame.getAttribute('title'), 'Video ' + grade + ': ' + title);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'YouTube mobile layout');
  await page.screenshot({ path: join(tmpdir(), 'bahasakita-youtube-' + grade + '.png'), fullPage: true });
  const words = dictionaryForGrade(grade);
  assert.equal(await page.locator('.dictionary-card').count(), words.length, 'Words follow grade');
  const word = words[0];
  await page.getByLabel('Cari kata', { exact: true }).fill(word.word);
  assert.equal(await page.locator('.dictionary-card').count(), 1, 'Search filters words');
  await page.getByRole('button', { name: 'Lihat arti dan video kata ' + word.word, exact: true }).click();
  assert.equal(await page.locator('.youtube-player iframe').count(), 0, 'Main player stops for word video');
  const dialog = page.getByRole('dialog'); await dialog.getByRole('button', { name: 'Putar bagian video' }).click();
  assert.ok((await dialog.locator('iframe').getAttribute('src')).includes('/embed/' + word.videoId));
  assert.ok((await dialog.locator('iframe').getAttribute('src')).includes('&start=' + word.start));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Word modal has no mobile overflow');
  await page.screenshot({ path: join(tmpdir(), 'bahasakita-word-' + grade + '.png'), fullPage: true });
  await page.keyboard.press('Escape'); assert.equal(await page.locator('.source-word-dialog').count(), 0);
  await page.getByLabel('Cari kata', { exact: true }).fill('');
  const source = youtubeMaterials[grade][1].id;
  await page.getByLabel('Video sumber').selectOption(source);
  assert.equal(await page.locator('.dictionary-card').count(), words.filter(w => w.videoId === source).length, 'Video filter');
  await page.getByLabel('Video sumber').selectOption('Semua');
  const category = words[0].category;
  await page.locator('.filter-tabs').getByRole('button', { name: category, exact: true }).click();
  assert.equal(await page.locator('.dictionary-card').count(), words.filter(w => w.category === category).length, 'Category filter');
  await page.locator('.filter-tabs').getByRole('button', { name: 'Semua', exact: true }).click();
  const lesson = lessonsForGrade(grade)[0];
  await route('/learning');
  assert.equal(await page.locator('.path-card a.btn').count(), 4);
  assert.ok((await page.locator('.page-heading').innerText()).includes('0/4 materi selesai'), 'Other grades do not inherit mastery');
  await page.locator('.path-card a[href="/lesson/' + lesson.id + '"]').click();
  await page.getByRole('heading', { name: lesson.title, exact: true }).waitFor();
  await page.getByRole('button', { name: 'Putar video kosakata', exact: true }).click();
  assert.ok((await page.locator('.lesson-source-video iframe').getAttribute('src')).includes('/embed/' + lesson.wordEntry.videoId));
  const related = lesson.relatedWords.at(-1);
  await page.locator('.lesson-related-words').getByRole('button', { name: related.emoji + ' ' + related.word, exact: true }).click();
  assert.equal(await page.locator('.lesson-source-video iframe').count(), 0, 'Lesson video stops for dictionary modal');
  await page.getByRole('dialog').getByRole('heading', { name: related.word, exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Lihat materi', exact: true }).click();
  await page.getByRole('button', { name: 'Coba latihan', exact: true }).click();
  await page.locator('.answer-options button').nth(grade === 'SMA' ? 1 : 0).click();
  await page.getByRole('button', { name: 'Periksa jawaban', exact: true }).click();
  await page.getByRole('button', { name: 'Mulai evaluasi', exact: true }).click();
  for (const [questionIndex, answerIndex] of [1,0,2,1,0].entries()) {
   await page.locator('.answer-options button').nth(answerIndex).click();
   await page.getByRole('button', { name: 'Periksa jawaban', exact: true }).click();
   await page.getByRole('button', { name: questionIndex === 4 ? 'Lihat hasil' : 'Soal berikutnya', exact: true }).click();
  }
  assert.equal(await page.locator('.result-score').innerText(), '100%');
  await page.waitForFunction(id => JSON.parse(localStorage.getItem('bahasakita-v1')).mastered.includes(id), lesson.id);
  const attempt = await page.evaluate(id => JSON.parse(localStorage.getItem('bahasakita-v1')).attempts.filter(a => a.lesson === id).at(-1), lesson.id);
  assert.equal(attempt.grade, grade); assert.equal(attempt.mastered, true);
  await route('/learning'); assert.ok((await page.locator('.page-heading').innerText()).includes('1/4 materi selesai'));
  const foreignId = grade === 'SD' ? 'smp-percakapan' : 'sd-tumbuhan';
  await route('/lesson/' + foreignId); await page.getByRole('heading', { name: 'Materi tidak tersedia untuk jenjangmu.', exact: true }).waitFor();
  await route('/learning');
  await page.screenshot({ path: join(tmpdir(), 'bahasakita-learning-' + grade + '.png'), fullPage: true });
 }
 assert.deepEqual(errors, [])
 console.log('PASS: entry/assessment gates, grade dictionary/video, all lesson stages for SD/SMP/SMA, scoped mastery and wrong-grade routes')
} finally { await browser.close(); server.kill() }
