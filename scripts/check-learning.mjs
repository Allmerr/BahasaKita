import { build } from 'esbuild'
import { readFileSync, unlinkSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const output='.check-learning.cjs'
const source=`
import React from 'react';import assert from 'node:assert/strict';import {renderToString} from 'react-dom/server';import {MemoryRouter} from 'react-router-dom';
import {initialState,buildPath,canOpen,assessmentScore,learningDestination,StoreForTests} from './src/learning.jsx';import {AppRoutes} from './src/App.jsx';import {AccountProvider} from './src/Account.jsx';
import {allGradeLessons,lessonsForGrade} from './content/legacy-lessons.js';import {questionBank} from './content/legacy-assessment.js';import {basicMaterials} from './content/legacy-basic.js';import {dictionaryForGrade} from './src/gradeDictionary.js';
const warnings=console.error;console.error=()=>{};
for(const grade of ['SD','SMP','SMA']){
 const state={...structuredClone(initialState),profile:{grade,name:'Siswa'},learningReady:true};const lessons=lessonsForGrade(grade);assert.equal(lessons.length,4);
 assert.equal(learningDestination(state),'/assessment');assert.ok(lessons.every(l=>!canOpen(l.id,state,lessons)));
 state.assessment={kosakata:50,kalimat:50,bacaan:50,akademik:50};assert.equal(learningDestination(state),'/basic-class');
 state.attempts=[{type:'assessment',grade,scores:{kosakata:100,kalimat:100,bacaan:100,akademik:100}}];assert.equal(assessmentScore(state),100);assert.equal(learningDestination(state),'/');assert.ok(lessons.every(l=>canOpen(l.id,state,lessons)));
 const another=allGradeLessons().find(l=>l.grade!==grade);assert.equal(canOpen(another.id,state,[another]),false);
 state.attempts.push({type:'assessment',grade:grade==='SD'?'SMP':'SD',scores:{kosakata:0,kalimat:0,bacaan:0,akademik:0}});assert.equal(assessmentScore(state),100,'Only current-grade assessment gates access');
 state.attempts.push({type:'lesson',lesson:lessons[2].id,mastered:false});const path=buildPath(state,lessons);assert.equal(path[0].id,lessons[2].id,'Failed lesson is recommended for reinforcement');
 const value={state,path,lessons,next:path[0],masteredLessons:[],lessonAttempts:[],dictionary:dictionaryForGrade(grade),basicMaterials,clips:{},accountReady:true,isAdmin:false,setting:()=>{},contentError:'',learningError:''};
 const html=renderToString(<AccountProvider><StoreForTests.Provider value={value}><MemoryRouter initialEntries={['/learning']}><AppRoutes authorized enter={()=>{}}/></MemoryRouter></StoreForTests.Provider></AccountProvider>);
 lessons.forEach(l=>assert.ok(html.includes(l.title)));assert.ok(!html.includes(another.title));
 for(const lesson of lessons){assert.equal(lesson.quiz.length,5);lesson.quiz.forEach(q=>assert.ok(q.options[q.correct]));assert.ok(lesson.wordEntry.videoId)}
 Object.values(questionBank[grade]).flat().forEach(q=>assert.ok(q.options[q.correct]));
}
assert.equal(basicMaterials.length,4);console.error=warnings;console.log('PASS: grade-scoped routes, assessment gates, reinforcement ordering and seed integrity.');
`
try{await build({stdin:{contents:source,loader:'jsx',resolveDir:process.cwd()},define:{'import.meta.env':'{}'},bundle:true,platform:'node',format:'cjs',jsx:'automatic',outfile:output,packages:'external',logLevel:'silent',plugins:[{name:'test-context',setup(build){build.onLoad({filter:/[\\/]src[\\/]learning\.jsx$/},args=>({contents:readFileSync(args.path,'utf8')+'\nexport { Store as StoreForTests };',loader:'jsx'}))}}]});const result=spawnSync(process.execPath,[output],{stdio:'inherit'});process.exitCode=result.status??1}finally{for(const path of [output,'.check-learning.css'])try{unlinkSync(path)}catch{}}
