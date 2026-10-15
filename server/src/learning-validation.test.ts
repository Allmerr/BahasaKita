import { test } from 'node:test'
import assert from 'node:assert/strict'
import { id,question,questionPayload,lessonPayload } from './learning-validation.js'
const choice={prompt:' Pilih buah. ',visual:'🥭',options:[' Mangga ','Jeruk','Apel'],answer:0}
const assessment={...choice,grade:'SD',aspect:'kosakata',slot:'first'}
const lesson={slug:'sd-buah',title:' Nama buah ',kind:'lesson',grade:'SD',aspect:'kosakata',data:{intro:'Kenali buah.',explanation:'Baca nama buah.',wordEntry:{videoId:'dQw4w9WgXcQ'}},practice:choice,quiz:Array.from({length:5},()=>({...choice}))}
test('learning identifiers accept UUIDs and optional sources, reject malformed paths',()=>{
 assert.equal(id('11111111-1111-4111-8111-111111111111'),'11111111-1111-4111-8111-111111111111');assert.equal(id(null,true),null)
 for(const value of ['',null,12,{},'../../other','not-a-uuid'])assert.throws(()=>id(value))
})
test('choice questions trim text and discard browser-supplied score or ownership',()=>{
 const result=question({...choice,user_id:'other',score:100,correct:true})
 assert.deepEqual(result,{prompt:'Pilih buah.',visual:'🥭',options:['Mangga','Jeruk','Apel'],answer:0})
})
test('choice validation covers empty inputs, answer boundaries, fractional and wrong types',()=>{
 for(const patch of [{prompt:''},{prompt:'x'.repeat(3001)},{options:['only']},{options:Array(7).fill('x')},{options:['','valid']},{options:[{},'valid']},{answer:-1},{answer:3},{answer:0.5},{answer:'0'},{answer:null}])assert.throws(()=>question({...choice,...patch}),JSON.stringify(patch))
 for(const value of [null,[],true,'question'])assert.throws(()=>question(value))
 assert.equal(question({...choice,options:Array(6).fill('valid'),answer:5}).answer,5)
})
test('word ordering supports chunks and repeated words, and rejects impossible answers',()=>{
 assert.equal(question({prompt:'Susun kalimat.',words:['nasi','Dina makan'],answer:'Dina makan nasi'},true).answer,'Dina makan nasi')
 assert.ok(question({prompt:'Susun.',words:['sama','sama'],answer:'sama sama'},true))
 for(const words of [[],['one'],Array(13).fill('one')])assert.throws(()=>question({prompt:'Susun.',words,answer:'one'},true))
 assert.throws(()=>question({prompt:'Susun.',words:['Dina','makan'],answer:'Budi makan'},true))
 assert.throws(()=>question({prompt:'Susun.',words:['','makan'],answer:'makan'},true))
})
test('assessment validates every grade, aspect and adaptive slot',()=>{
 for(const grade of ['SD','SMP','SMA'])for(const aspect of ['kosakata','kalimat','bacaan','akademik'])for(const slot of ['first','advanced','remedial'])assert.equal(questionPayload({...assessment,grade,aspect,slot}).slot,slot)
 for(const patch of [{grade:'ALL'},{grade:['SD']},{aspect:'unknown'},{slot:'quiz'}])assert.throws(()=>questionPayload({...assessment,...patch}))
})
test('lesson editor requires five valid quiz questions, intro, explanation and known taxonomy',()=>{
 assert.equal(lessonPayload(lesson).title,'Nama buah')
 for(const patch of [{quiz:[]},{quiz:Array(4).fill(choice)},{quiz:Array(6).fill(choice)},{quiz:[choice,choice,choice,choice,{...choice,answer:99}]},{practice:{}},{data:{intro:'',explanation:'text'}},{data:{intro:'text'}},{kind:'unknown'},{grade:'ALL'},{aspect:'unknown'},{slug:''}])assert.throws(()=>lessonPayload({...lesson,...patch}),JSON.stringify(patch))
 for(const key of ['answer','correct','quiz','practice'])assert.throws(()=>lessonPayload({...lesson,data:{...lesson.data,[key]:key==='answer'?0:true}}))
})
test('basic editor normalizes grade and rejects missing slides or unsafe video protocols',()=>{
 const basic={...lesson,kind:'basic',data:{slides:[['Buah','Kenali buah.']],videoSrc:'/videos/basic.webm'}}
 assert.equal(lessonPayload(basic).grade,'ALL');assert.equal(lessonPayload({...basic,data:{...basic.data,videoSrc:'https://example.test/video.webm'}}).kind,'basic')
 for(const videoSrc of ['javascript:alert(1)','http://example.test/video','file:///private',''])assert.throws(()=>lessonPayload({...basic,data:{...basic.data,videoSrc}}))
 for(const slides of [null,[],Array(21).fill(['Judul','Isi'])])assert.throws(()=>lessonPayload({...basic,data:{...basic.data,slides}}))
 const youtube={...basic,data:{...basic.data,targetGrade:'SMP',videoSrc:'https://www.youtube.com/watch?v=XmiXc0YUrXY',start:285}}
 assert.equal((lessonPayload(youtube).data as any).targetGrade,'SMP')
 for(const targetGrade of ['TK',null,{}])assert.throws(()=>lessonPayload({...youtube,data:{...youtube.data,targetGrade}}))
 for(const start of [-1,1.5,'285',null])assert.throws(()=>lessonPayload({...youtube,data:{...youtube.data,start}}))
})
