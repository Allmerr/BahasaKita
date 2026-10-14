import { buildSync } from 'esbuild'
import { writeFileSync, unlinkSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const output = '.check-learning.cjs'
const test = `
import React from 'react';
import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AccountProvider } from './src/Account.jsx';
import { Provider, initialState, buildPath, canOpen, evaluateLesson } from './src/learning.jsx';
import { AppRoutes } from './src/App.jsx';
import { publicPages } from './src/access.jsx';
global.localStorage = { getItem: () => null, setItem: () => {} };
const state = structuredClone(initialState);
assert.equal(canOpen('kata', state, buildPath(state)), false);
state.assessment = { kosakata: 0, kalimat: 50, bacaan: 100, akademik: 50 };
assert.equal(buildPath(state)[0].id, 'kata');
assert.equal(buildPath(state).filter(l => canOpen(l.id, state, buildPath(state))).length, 1);
state.mastered = ['kata'];
assert.equal(buildPath(state).filter(l => canOpen(l.id, state, buildPath(state))).length, 2);
assert.equal(evaluateLesson([true,true,true,true,false].map(correct => ({correct})), null).mastered, true);
const warnings = console.error; console.error = () => {};
function render(route, authorized=false) { return renderToString(<MemoryRouter initialEntries={[route]}><AccountProvider><Provider><AppRoutes authorized={authorized} enter={() => {}}/></Provider></AccountProvider></MemoryRouter>); }
assert.ok(render('/signin').includes('Masuk ke beranda'));
assert.ok(render('/signup').includes('Konfirmasi kata sandi'));
assert.ok(!render('/signup').includes('value="SMA"'));
assert.ok(render('/settings').includes('Ukuran teks'));
assert.ok(!render('/settings').includes('Simpan profil'));
assert.ok(render('/dictionary').includes('Kamus visual'));
for (const route of ['/profile','/progress','/assessment','/lesson/kata']) assert.ok(!render(route).includes('Profil kemampuanmu') && !render(route).includes('Profil saya</h1>') && !render(route).includes('Bukan ujian') && !render(route).includes('Hari ini, kita belajar'));
assert.ok(!render('/settings').includes('Keluar akun'));
assert.deepEqual(publicPages, ['/', '/learning', '/dictionary', '/settings']);
console.error = warnings;
console.log('PASS: sequential lesson gates, scoring, auth forms, public accessibility/dictionary and private routes');
`

try {
 buildSync({ stdin: { contents: test, loader: 'jsx', resolveDir: process.cwd() }, define: { 'import.meta.env': '{}' }, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', outfile: output, packages: 'external', logLevel: 'silent' })
 const result = spawnSync(process.execPath, [output], { stdio: 'inherit' })
 process.exitCode = result.status ?? 1
} finally { try { unlinkSync(output) } catch {} }
