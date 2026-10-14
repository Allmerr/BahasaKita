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
function App() { return <Provider><AppRoutes authorized={true} enter={() => {}}/></Provider> }
import { initialState, buildPath, canOpen, lessons, questionBank, dictionary, evaluateLesson } from './src/learning.jsx';
let saved = null;
global.localStorage = { getItem: () => saved, setItem: () => {} };
const state = structuredClone(initialState);
assert.equal(canOpen('kata', state, buildPath(state)), false, 'No lessons before assessment');
state.assessment = { kosakata: 0, kalimat: 50, bacaan: 100, akademik: 50 };
let path = buildPath(state);
assert.equal(path[0].id, 'kata');
assert.equal(path.filter(l => canOpen(l.id, state, path)).length, 1, 'Only first recommended lesson opens');
state.assessment.kosakata = 60;
state.attempts.push({ type: 'lesson', lesson: 'kata', mastered: false });
path = buildPath(state);
assert.equal(path[0].id, 'kata', 'Failed evaluation retains access to reinforcement');
state.mastered = ['kata']; state.attempts.push({ type: 'lesson', lesson: 'kata', mastered: true });
path = buildPath(state);
assert.equal(canOpen('kata', state, path), true, 'Mastered lesson remains open');
assert.equal(path.filter(l => canOpen(l.id, state, path)).length, 2, 'Next lesson unlocks');
state.mastered = lessons.map(l => l.id);
assert.ok(buildPath(state).every(l => canOpen(l.id, state, buildPath(state))), 'All mastered lessons can be reviewed');
for (const lesson of lessons) {
 assert.equal(lesson.quiz.length, 5);
 assert.ok(dictionary.some(d => d.word === lesson.word));
 lesson.quiz.forEach(q => assert.ok(q.options[q.correct]));
}
Object.values(questionBank).flat().forEach(q => assert.ok(q.options[q.correct]));
const fourCorrect = [true, true, true, true, false].map(correct => ({ correct }));
assert.equal(evaluateLesson(fourCorrect, null).mastered, true, '80 percent can master');
assert.equal(evaluateLesson(fourCorrect, { answers: fourCorrect }).mastered, false, 'Repeated error requires reinforcement even at 80 percent');
assert.equal(evaluateLesson([true, true, true, false, false].map(correct => ({ correct })), null).mastered, false, '60 percent requires reinforcement');
const warnings = console.error; console.error = () => {};
for (const [route, expected] of [['/', 'Caramu belajar'], ['/signup', 'Mari kenalan'], ['/assessment', 'Bukan ujian'], ['/learning', 'Selesaikan asesmen'], ['/dictionary', 'Kamus visual'], ['/progress', 'Kemajuan saya'], ['/settings', 'Aksesibilitas'], ['/lesson/kata', 'belum terbuka'], ['/missing', 'belum ditemukan']]) {
 saved = null;
 assert.ok(renderToString(<MemoryRouter initialEntries={[route]}><App/></MemoryRouter>).includes(expected), 'Render ' + route);
}
saved = JSON.stringify({ ...initialState, profile: { name: 'Teman', grade: 'SD' }, assessment: { kosakata: 0, kalimat: 50, bacaan: 100, akademik: 50 } });
assert.ok(renderToString(<MemoryRouter initialEntries={['/lesson/kata']}><App/></MemoryRouter>).includes('Hari ini, kita belajar'), 'Available lesson renders');
saved = JSON.stringify({ ...initialState, assessmentDraft: [{ aspect: 'kosakata', correct: true }] });
assert.ok(renderToString(<MemoryRouter initialEntries={['/assessment']}><App/></MemoryRouter>).includes('Memberi air pada tanaman'), 'Resume uses harder question after correct answer');
saved = '{broken json';
assert.ok(renderToString(<MemoryRouter><App/></MemoryRouter>).includes('teman belajar'), 'Corrupt storage falls back safely');
for (const route of ['/', '/learning', '/lesson/kata', '/signin', '/signup']) {
 const fresh = renderToString(<MemoryRouter initialEntries={[route]}><EntryApp/></MemoryRouter>);
 assert.ok(fresh.includes('Layar pembuka BahasaKita'), 'Fresh load begins at logo: ' + route);
 assert.ok(!fresh.includes('app-shell'), 'No dashboard flash during opening');
}
saved = JSON.stringify({ ...initialState, profile: { name: 'Teman', grade: 'SD' } });
assert.ok(renderToString(<MemoryRouter><EntryApp/></MemoryRouter>).includes('Layar pembuka BahasaKita'), 'Saved profile does not bypass splash on refresh');
const login = renderToString(<MemoryRouter initialEntries={['/signin']}><Provider><AppRoutes authorized={false} enter={() => {}}/></Provider></MemoryRouter>);
assert.ok(login.includes('Masuk ke beranda') && login.includes('Register'), 'Login and register actions exist');
assert.ok(!login.includes('app-shell'), 'Auth page has no workspace sidebar');
for (const [route, title] of [['/', 'Caramu belajar'], ['/learning', 'Jalur yang dibuat untukmu'], ['/dictionary', 'Kamus visual'], ['/progress', 'Kemajuan saya']]) {
 const publicPage = renderToString(<MemoryRouter initialEntries={[route]}><Provider><AppRoutes authorized={false} enter={() => {}}/></Provider></MemoryRouter>);
 assert.ok(publicPage.includes(title), 'Guest may browse ' + route);
 assert.ok(!publicPage.includes('Kamu sedang menjelajah'), 'Guest banner removed from ' + route);
 const publicLinks = (publicPage.match(/<a[^>]*>/g) || []).filter(a => a.includes('data-public-navigation="true"'));
 for (const link of publicLinks) { const href = link.match(/href="([^"]+)"/)[1]; assert.ok(publicPages.includes(href) || href === '#main', 'No private destinations bypass login'); }
}
for (const route of ['/assessment', '/settings', '/lesson/kata']) {
 const privatePage = renderToString(<MemoryRouter initialEntries={[route]}><Provider><AppRoutes authorized={false} enter={() => {}}/></Provider></MemoryRouter>);
 assert.ok(!privatePage.includes('Bukan ujian') && !privatePage.includes('Data &amp; privasi') && !privatePage.includes('Hari ini, kita belajar'), 'Private route requires login: ' + route);
}
assert.deepEqual(publicPages, ['/', '/learning', '/dictionary', '/progress']);
assert.equal(needsLogin(false, true), false, 'Guest can use navigation');
assert.equal(needsLogin(false, false), true, 'All other guest actions request login');
assert.equal(needsLogin(true, false), false, 'Logged-in users can use features');
console.error = warnings;
console.log('PASS: assessment adaptation, prerequisites, remediation, mastery, content integrity, route/storage render checks, fresh-load splash, auth layout and access gate');
`
try {
 buildSync({ stdin: { contents: test, loader: 'jsx', resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', outfile: output, packages: 'external', logLevel: 'silent' })
 const result = spawnSync(process.execPath, [output], { stdio: 'inherit' })
 process.exitCode = result.status ?? 1
} finally { try { unlinkSync(output) } catch {} }
