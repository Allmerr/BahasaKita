import { buildSync } from 'esbuild'
import { writeFileSync, unlinkSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const output = '.check-learning.cjs'
const test = `
import React from 'react';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import EntryApp, { AppRoutes } from './src/App.jsx';
import { Provider } from './src/learning.jsx';
import { needsLogin, publicPages } from './src/access.jsx';
import { youtubeMaterials, videosForGrade, youtubeEmbedUrl } from './src/youtubeMaterials.js';
import { dictionaryForGrade } from './src/gradeDictionary.js';
import { lessonsForGrade } from './src/gradeLessons.js';
function App() { return <Provider><AppRoutes authorized={true} enter={() => {}}/></Provider> }
import { initialState, buildPath, canOpen, lessons, questionBank, dictionary, evaluateLesson, assessmentScore, learningDestination } from './src/learning.jsx';
let saved = null;
global.localStorage = { getItem: () => saved, setItem: () => {} };
const state = structuredClone(initialState);
state.profile = { grade: 'SD' };
const sdLessons = lessonsForGrade('SD');
assert.equal(canOpen('sd-tumbuhan', state, buildPath(state)), false, 'No lessons before assessment');
state.assessment = { kosakata: 0, kalimat: 50, bacaan: 100, akademik: 50 };
let path = buildPath(state);
assert.equal(path[0].id, 'sd-tumbuhan');
assert.equal(path.filter(l => canOpen(l.id, state, path)).length, 0, 'Low assessment locks all lessons');
assert.equal(learningDestination(state), '/basic-class');
state.attempts.push({ type: 'assessment', scores: { kosakata: 80, kalimat: 80, bacaan: 80, akademik: 80 } });
assert.equal(assessmentScore(state), 80);
assert.equal(learningDestination(state), '/', '80 passes');
assert.equal(path.filter(l => canOpen(l.id, state, path)).length, sdLessons.length, 'All lessons open after passing');
state.assessment.kosakata = 60;
state.attempts.push({ type: 'lesson', lesson: 'sd-tumbuhan', mastered: false });
path = buildPath(state);
assert.equal(path[0].id, 'sd-tumbuhan', 'Failed evaluation retains access to reinforcement');
state.mastered = ['sd-tumbuhan']; state.attempts.push({ type: 'lesson', lesson: 'sd-tumbuhan', mastered: true });
path = buildPath(state);
assert.equal(canOpen('sd-tumbuhan', state, path), true, 'Mastered lesson remains open');
assert.equal(path.filter(l => canOpen(l.id, state, path)).length, sdLessons.length, 'All lessons remain open');
state.mastered = sdLessons.map(l => l.id);
assert.ok(buildPath(state).every(l => canOpen(l.id, state, buildPath(state))), 'All mastered lessons can be reviewed');
for (const lesson of lessons) {
 assert.equal(lesson.quiz.length, 5);
 assert.ok(dictionary.some(d => d.word === lesson.word));
 lesson.quiz.forEach(q => assert.ok(q.options[q.correct]));
}
for (const grade of ['SD', 'SMP', 'SMA']) {
 Object.values(questionBank[grade]).flat().forEach(q => assert.ok(q.options[q.correct]));
}
const fourCorrect = [true, true, true, true, false].map(correct => ({ correct }));
assert.equal(evaluateLesson(fourCorrect, null).mastered, true, '80 percent can master');
assert.equal(evaluateLesson(fourCorrect, { answers: fourCorrect }).mastered, false, 'Repeated error requires reinforcement even at 80 percent');
assert.equal(evaluateLesson([true, true, true, false, false].map(correct => ({ correct })), null).mastered, false, '60 percent requires reinforcement');
const warnings = console.error; console.error = () => {};
for (const [route, expected] of [['/', 'Caramu belajar'], ['/learning', 'Jalur yang dibuat'], ['/dictionary', 'Kamus visual'], ['/progress', 'Kemajuan saya'], ['/signup', 'Mari kenalan'], ['/assessment', 'Bukan ujian'], ['/settings', 'Aksesibilitas'], ['/missing', 'belum ditemukan']]) {
 saved = null;
 assert.ok(renderToString(<MemoryRouter initialEntries={[route]}><App/></MemoryRouter>).includes(expected), 'Render ' + route);
}
saved = JSON.stringify({ ...initialState, profile: { name: 'Teman', grade: 'SD' }, assessment: { kosakata: 100, kalimat: 100, bacaan: 100, akademik: 100 } });
assert.ok(renderToString(<MemoryRouter initialEntries={['/lesson/sd-tumbuhan']}><App/></MemoryRouter>).includes('Hari ini, kita belajar'), 'Available lesson renders');
saved = JSON.stringify({ ...initialState, assessmentDraft: [{ aspect: 'kosakata', correct: true }] });
assert.ok(renderToString(<MemoryRouter initialEntries={['/assessment']}><App/></MemoryRouter>).includes('Memberi air pada tanaman'), 'Resume uses harder question after correct answer');
saved = JSON.stringify({ ...initialState, profile: { name: 'Teman SMP', grade: 'SMP' }, assessmentDraft: [{ aspect: 'kosakata', correct: true }] });
assert.ok(renderToString(<MemoryRouter initialEntries={['/assessment']}><App/></MemoryRouter>).includes('Kapal bersandar dan menaikkan penumpang'), 'SMP uses SMP question bank');
saved = JSON.stringify({ ...initialState, profile: { name: 'Teman SMA', grade: 'SMA' }, assessmentDraft: [{ aspect: 'kosakata', correct: true }] });
assert.ok(renderToString(<MemoryRouter initialEntries={['/assessment']}><App/></MemoryRouter>).includes('Mempromosikan produk atau jasa kepada khalayak'), 'SMA uses SMA question bank');
saved = '{broken json';
assert.ok(renderToString(<MemoryRouter><App/></MemoryRouter>).includes('app-shell'), 'Corrupt storage falls back safely');
for (const route of ['/', '/learning', '/lesson/sd-tumbuhan', '/signin', '/signup']) {
 const fresh = renderToString(<MemoryRouter initialEntries={[route]}><EntryApp/></MemoryRouter>);
 assert.ok(fresh.includes('Layar pembuka BahasaKita'), 'Fresh load begins at logo: ' + route);
 assert.ok(!fresh.includes('app-shell'), 'No dashboard flash during opening');
}
saved = JSON.stringify({ ...initialState, profile: { name: 'Teman', grade: 'SD' } });
assert.ok(renderToString(<MemoryRouter><EntryApp/></MemoryRouter>).includes('Layar pembuka BahasaKita'), 'Saved profile does not bypass splash on refresh');
const login = renderToString(<MemoryRouter initialEntries={['/signin']}><Provider><AppRoutes authorized={false} enter={() => {}}/></Provider></MemoryRouter>);
assert.ok(login.includes('Masuk dan lanjutkan') && login.includes('Register'), 'Login and register actions exist');
assert.ok(!login.includes('app-shell'), 'Auth page has no workspace sidebar');
for (const [route, title] of [['/', 'Caramu belajar'], ['/learning', 'Jalur yang dibuat untukmu'], ['/dictionary', 'Kamus visual'], ['/progress', 'Kemajuan saya']]) {
 const publicPage = renderToString(<MemoryRouter initialEntries={[route]}><Provider><AppRoutes authorized={false} enter={() => {}}/></Provider></MemoryRouter>);
 assert.ok(publicPage.includes(title), 'Guest may browse ' + route);
 assert.ok(!publicPage.includes('Kamu sedang menjelajah'), 'Guest banner removed from ' + route);
 const publicLinks = (publicPage.match(/<a[^>]*>/g) || []).filter(a => a.includes('data-public-navigation="true"'));
 for (const link of publicLinks) { const href = link.match(/href="([^"]+)"/)[1]; assert.ok(publicPages.includes(href) || href === '#main', 'No private destinations bypass login'); }
}
for (const route of ['/assessment', '/settings', '/lesson/sd-tumbuhan', '/basic-class']) {
 const privatePage = renderToString(<MemoryRouter initialEntries={[route]}><Provider><AppRoutes authorized={false} enter={() => {}}/></Provider></MemoryRouter>);
 assert.ok(!privatePage.includes('Bukan ujian') && !privatePage.includes('Data &amp; privasi') && !privatePage.includes('Hari ini, kita belajar'), 'Private route requires login: ' + route);
}
assert.deepEqual(publicPages, ['/', '/learning', '/dictionary', '/progress']);
assert.equal(needsLogin(false, true), false, 'Guest can use navigation');
assert.equal(needsLogin(false, false), true, 'All other guest actions request login');
assert.equal(needsLogin(true, false), false, 'Logged-in users can use features');

for (const score of [0, 79.9, 80, 87.5, 100]) {
 const restricted = { ...structuredClone(initialState), profile: { grade: 'SD' }, assessment: Object.fromEntries(['kosakata','kalimat','bacaan','akademik'].map(a => [a, score])) };
 assert.equal(learningDestination(restricted), score < 80 ? '/basic-class' : '/');
 saved = JSON.stringify(restricted);
 const basic = renderToString(<MemoryRouter initialEntries={['/basic-class']}><App/></MemoryRouter>);
 assert.equal(basic.includes('Teks penjelasan video'), score < 80, 'Basic class only for low score');
 const home = renderToString(<MemoryRouter initialEntries={['/']}><App/></MemoryRouter>);
 assert.equal(home.includes('href="/basic-class"'), score < 80, 'Basic navigation only below 80');
 for (const label of ['Beranda', 'Belajar', 'Kamus visual', 'Kemajuan saya']) assert.ok(home.includes(label), 'Main navigation preserved');
 for (const [route, content] of [['/','Caramu belajar'], ['/learning','Jalur yang dibuat'], ['/dictionary','Kosakata dan video pembelajaran'], ['/progress','Jejak belajarmu'], ['/lesson/sd-tumbuhan','Hari ini, kita belajar']]) {
  const html = renderToString(<MemoryRouter initialEntries={[route]}><App/></MemoryRouter>);
  assert.equal(html.includes(content), route === '/' || score >= 80, 'Score gate: ' + score + ' ' + route);
 }
}
const immutable = { ...structuredClone(initialState), assessment: { kosakata: 100, kalimat: 100, bacaan: 100, akademik: 100 }, attempts: [{ type: 'assessment', answers: Array.from({length:8}, (_,i) => ({correct:i < 6})) }] };
assert.equal(assessmentScore(immutable), 75, 'Lesson updates cannot bypass assessment gate');
immutable.assessment = null;
assert.equal(learningDestination(immutable), '/assessment', 'Reset requires fresh assessment');


for (const grade of ['SD', 'SMP', 'SMA']) {
 const videos = videosForGrade(grade);
 assert.equal(videos.length, 5);
 assert.ok(videos.every(video => /^[a-zA-Z0-9_-]{11}$/.test(video.id) && video.creator && video.description && video.audience === 'tunarungu' && video.sourceLevel && video.accessibility));
 assert.ok(videos.every(video => youtubeEmbedUrl(video.id).startsWith('https://www.youtube-nocookie.com/embed/')));
 saved = JSON.stringify({ ...initialState, profile: { name: 'Teman', grade }, assessment: { kosakata: 100, kalimat: 100, bacaan: 100, akademik: 100 } });
 const html = renderToString(<MemoryRouter initialEntries={['/dictionary']}><App/></MemoryRouter>);
 assert.ok(html.includes('Materi ' + grade + ' sesuai jenjang'));
 videos.forEach(video => assert.ok(html.includes(video.title), 'Matching grade material'));
 for (const other of Object.keys(youtubeMaterials).filter(g => g !== grade)) {
  for (const video of videosForGrade(other)) if (!videos.some(v => v.title === video.title)) assert.ok(!html.includes(video.title), 'Other grade excluded');
 }
 assert.ok(!html.includes('<iframe'), 'Video only loads after explicit selection');
 const words = dictionaryForGrade(grade);
 assert.ok(words.length >= 5);
 for (const entry of words) {
  assert.ok(entry.video && videos.some(v => v.id === entry.videoId), 'Word source belongs to grade');
  assert.ok(Number.isInteger(entry.start) && entry.start > 0);
  assert.ok(html.includes(entry.word), 'Matching dictionary word');
  assert.ok(youtubeEmbedUrl(entry.videoId, entry.start).includes('&start=' + entry.start));
 }
 assert.ok(!html.includes('Video isyarat menunggu konten tervalidasi'));
 assert.ok(!html.includes('Lihat arti &amp; isyarat'), 'Old generic cards replaced');
 for (const other of ['SD','SMP','SMA'].filter(g => g !== grade)) for (const entry of dictionaryForGrade(other)) if (!words.some(w => w.word === entry.word)) assert.ok(!html.includes('Lihat arti dan video kata ' + entry.word));
}
assert.deepEqual(videosForGrade('Kuliah'), []);
assert.deepEqual(videosForGrade(undefined), []);
assert.deepEqual(dictionaryForGrade(undefined), []);


for (const grade of ['SD', 'SMP', 'SMA']) {
 const catalog = lessonsForGrade(grade);
 assert.equal(catalog.length, 4);
 assert.equal(new Set(catalog.map(l => l.aspect)).size, 4);
 const words = dictionaryForGrade(grade);
 for (const lesson of catalog) {
  assert.equal(lesson.grade, grade);
  assert.ok(lesson.wordEntry && words.some(w => w.word === lesson.word));
  assert.ok(lesson.relatedWords.every(w => w && words.some(entry => entry.word === w.word)));
  assert.ok(lesson.video && videosForGrade(grade).some(v => v.id === lesson.video.id));
  assert.equal(lesson.quiz.length, 5);
  assert.ok(lesson.quiz.every(q => q.options.length === 3 && Number.isInteger(q.correct) && q.options[q.correct]));
  if (lesson.practice.words) { const [a,b,c] = lesson.practice.words; assert.equal(lesson.practice.words.length, 3); assert.ok([[a,b,c],[a,c,b],[b,a,c],[b,c,a],[c,a,b],[c,b,a]].some(words => words.join(' ') === lesson.practice.answer), 'Practice can form the required sentence'); }
 }
 const scoped = { ...structuredClone(initialState), profile: { grade }, assessment: { kosakata: 100, kalimat: 100, bacaan: 100, akademik: 100 }, mastered: ['kata', 'sd-tumbuhan'] };
 assert.ok(buildPath(scoped).every(l => l.grade === grade));
 for (const other of lessons.filter(l => l.grade !== grade)) assert.equal(canOpen(other.id, scoped, lessons), false, 'Cross-grade lesson blocked');
 saved = JSON.stringify(scoped);
 const html = renderToString(<MemoryRouter initialEntries={['/learning']}><App/></MemoryRouter>);
 catalog.forEach(lesson => assert.ok(html.includes(lesson.title)));
 lessons.filter(l => l.grade !== grade).forEach(lesson => assert.ok(!html.includes(lesson.title)));
 assert.ok(html.replace(/<!--.*?-->/g, '').includes((grade === 'SD' ? '1/4' : '0/4') + ' materi selesai'), 'Progress scoped to current grade');
 for (const lesson of catalog) assert.ok(renderToString(<MemoryRouter initialEntries={['/lesson/' + lesson.id]}><App/></MemoryRouter>).includes(lesson.intro), 'Lesson renders for grade');
 const other = lessons.find(l => l.grade !== grade);
 assert.ok(renderToString(<MemoryRouter initialEntries={['/lesson/' + other.id]}><App/></MemoryRouter>).includes('Materi tidak tersedia untuk jenjangmu'), 'Wrong grade route denied');
}
assert.deepEqual(lessonsForGrade(undefined), []);

console.error = warnings;
console.log('PASS: assessment adaptation, prerequisites, remediation, mastery, content integrity, route/storage render checks, fresh-load splash, auth layout and access gate');
`
try {
 buildSync({ stdin: { contents: test, loader: 'jsx', resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', outfile: output, packages: 'external', logLevel: 'silent' })
 const result = spawnSync(process.execPath, [output], { stdio: 'inherit' })
 process.exitCode = result.status ?? 1
} finally { try { unlinkSync(output) } catch {} }
