import { it, expect } from 'vitest'
import { dictionaryForGrade } from '../../src/gradeDictionary.js'
import { dictionaryPayload, mergedDictionary } from '../../src/dictionaryStore.js'

it('applies an admin edit and a new word without changing source entries',()=>{
 const before=dictionaryForGrade('SD').find(entry=>entry.word==='Pensil')
 const edited=dictionaryPayload('SD','pensil',{...before,meaning:'Alat menulis yang bisa diraut.',video_kind:'youtube',video_id:'https://youtu.be/abcdefghijk',video_title:'Isyarat pensil',video_start:7})
 const added=dictionaryPayload('SD',null,{word:'Krayon',emoji:'🖍️',category:'Sekolah',meaning:'Alat mewarnai.',example:'Dina memakai krayon.',video_kind:'none'})
 const result=mergedDictionary('SD',[edited,added])
 expect(result.find(entry=>entry.word==='Pensil')).toMatchObject({meaning:'Alat menulis yang bisa diraut.',videoId:'abcdefghijk',start:7})
 expect(result.find(entry=>entry.word==='Krayon')).toMatchObject({video:null,meaning:'Alat mewarnai.'})
 expect(before.video).toBeNull()
})
it('hides a built-in word and rejects unsupported remote video hosts',()=>{
 const old=dictionaryForGrade('SD').find(entry=>entry.word==='Sekolah')
 const hidden=dictionaryPayload('SD','sekolah',{...old,video_kind:'none'},true)
 expect(mergedDictionary('SD',[hidden]).some(entry=>entry.word==='Sekolah')).toBe(false)
 expect(()=>dictionaryPayload('SD',null,{...old,video_kind:'hosted',video_url:'https://example.com/a.mp4'})).toThrow(/Balai Bahasa/)
})
