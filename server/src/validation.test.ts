import { test } from 'node:test'
import assert from 'node:assert/strict'
import { profileInput, preferencesInput } from './validation.js'
test('profile accepts SD, SMP and SMA and discards ownership fields', () => {
 for (const grade of ['SD', 'SMP', 'SMA']) assert.deepEqual(profileInput({ name: ' Dina ', grade, goal: 'Mengenal kata', user_id: 'other' }), { name: 'Dina', grade, goal: 'Mengenal kata' })
 for (const body of [null, { name: '', grade: 'SD' }, { name: 'Dina', grade: 'Kuliah', goal: 'Mengenal kata' }, { name: 'Dina', grade: ['SD'], goal: 'Mengenal kata' }]) assert.throws(() => profileInput(body))
})
test('preferences reject incomplete, unknown or invalid values', () => {
 const valid = { textSize: 'large', theme: 'dark', speed: '0.5', language: 'bisindo', comfortable: true, contrast: false, dataSaver: true }
 assert.deepEqual(preferencesInput(valid), valid)
 for (const body of [null, {}, { ...valid, theme: 'invalid' }, { ...valid, dataSaver: 'true' }, { ...valid, mastered: true }]) assert.throws(() => preferencesInput(body))
})

test('profile name bounds and every supported learning goal',()=>{
 for(const goal of ['Mengenal kata','Memahami cerita','Belajar matematika'])assert.equal(profileInput({name:'a'.repeat(30),grade:'SMA',goal}).goal,goal)
 for(const patch of [{name:'   '},{name:'a'.repeat(31)},{name:12},{goal:'unknown'},{goal:null},{grade:null}])assert.throws(()=>profileInput({name:'Dina',grade:'SD',goal:'Mengenal kata',...patch}))
})
test('preferences support all appearance choices and strictly typed toggles',()=>{
 const valid={textSize:'normal',theme:'light',speed:'1',language:'default',comfortable:false,contrast:false,dataSaver:false}
 for(const textSize of ['normal','large','extra'])for(const theme of ['light','dark'])for(const speed of ['1','0.75','0.5'])for(const language of ['default','bisindo'])assert.deepEqual(preferencesInput({...valid,textSize,theme,speed,language}),{...valid,textSize,theme,speed,language})
 for(const key of ['comfortable','contrast','dataSaver'])for(const value of ['false',0,null,undefined])assert.throws(()=>preferencesInput({...valid,[key]:value}))
 for(const key of Object.keys(valid)){const body:Record<string,unknown>={...valid};delete body[key];assert.throws(()=>preferencesInput(body))}
})
