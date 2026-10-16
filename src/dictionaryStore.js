import { supabase } from './supabase.js'
import { dictionaryForGrade } from './gradeDictionary.js'

export async function dictionaryRows(grade) {
 if (!supabase) throw new Error('Supabase belum dikonfigurasi.')
 const {data,error}=await supabase.from('dictionary_entries').select('*').eq('grade',grade).order('word_key')
 if(error)throw new Error('Perubahan kamus belum dapat dimuat. Pastikan migrasi 012 sudah dijalankan.')
 return data
}
export function mergedDictionary(grade,rows=[]) {
 const base=dictionaryForGrade(grade),byKey=new Map(rows.map(row=>[row.word_key,row]))
 const fromRow=(row,old)=>{
  if(row.hidden)return null
  const video=row.video_kind==='youtube'?{title:row.video_title||`Video ${row.word}`}:
   row.video_kind==='hosted'?{kind:'hosted',title:row.video_title||`Video ${row.word}`,url:row.video_url,sourceUrl:row.source_url}:null
  return {...old,word_key:row.word_key,word:row.word,emoji:row.emoji,category:row.category,meaning:row.meaning,example:row.example,video,videoId:row.video_kind==='youtube'?row.video_id:null,start:row.video_start,mediaStatus:video?'video-available':'text-visual-only'}
 }
 const result=base.map(entry=>{const row=byKey.get(entry.word.toLocaleLowerCase('id'));return row?fromRow(row,entry):entry}).filter(Boolean)
 const keys=new Set(base.map(entry=>entry.word.toLocaleLowerCase('id')))
 return [...result,...rows.filter(row=>!keys.has(row.word_key)).map(row=>fromRow(row,null)).filter(Boolean)]
}
export function dictionaryPayload(grade,key,form,hidden=false) {
 const word=form.word.trim(),kind=form.video_kind||'none',raw=form.video_id?.trim()||''
 const videoId=kind==='youtube'?(raw.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([A-Za-z0-9_-]{11})/)?.[1]||raw):null
 if(!word||!form.category.trim()||!form.meaning.trim()||!form.example.trim())throw new Error('Kata, kategori, arti, dan contoh kalimat wajib diisi.')
 if(kind==='youtube'&&!/^[A-Za-z0-9_-]{11}$/.test(videoId))throw new Error('Masukkan ID atau URL video YouTube yang valid.')
 if(kind==='hosted'&&!/^https:\/\/balaibahasajatim\.kemendikdasmen\.go\.id\/storage\/videos\/[A-Za-z0-9_-]+\.mp4$/.test(form.video_url?.trim()||''))throw new Error('Video langsung harus berasal dari Balai Bahasa Jawa Timur.')
 if(kind==='hosted'&&form.source_url?.trim()&&!/^https:\/\//.test(form.source_url.trim()))throw new Error('Tautan sumber harus memakai HTTPS.')
 return {grade,word_key:key||word.toLocaleLowerCase('id'),word,emoji:form.emoji.trim()||'📖',category:form.category.trim(),meaning:form.meaning.trim(),example:form.example.trim(),video_kind:kind,video_id:videoId,video_url:kind==='hosted'?form.video_url.trim():null,video_title:kind==='none'?null:form.video_title?.trim()||`Video ${word}`,video_start:kind==='youtube'?Number(form.video_start)||0:0,source_url:kind==='hosted'?form.source_url?.trim()||null:null,hidden,updated_at:new Date().toISOString()}
}
