const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
export function id(value: unknown, optional = false) { if (optional && (value === null || value === undefined)) return null; if (typeof value!=='string'||!uuid.test(value)) throw new Error('Sesi atau konten tidak valid.'); return value }
export function object(value: unknown): Record<string,any> { if (!value||typeof value!=='object'||Array.isArray(value)) throw new Error('Isi permintaan belum valid.'); return value as Record<string,any> }
export function text(value: unknown, max: number, optional = false) { if (optional && !value) return ''; if (typeof value!=='string'||!value.trim()||value.length>max) throw new Error('Isi teks belum lengkap atau terlalu panjang.'); return value.trim() }
export function question(value: unknown, order = false) {
 const q = object(value)
 const result: Record<string,unknown> = {prompt:text(q.prompt,3000),visual:typeof q.visual==='string'?q.visual.slice(0,1000):''}
 if (order && Array.isArray(q.words)) {
  if (q.words.length<2||q.words.length>12) throw new Error('Latihan susun kata perlu 2–12 kata.')
  result.words=q.words.map((v:unknown)=>text(v,100)); result.answer=text(q.answer,1000)
  const expected=String(result.answer).split(/\s+/).sort().join(' ')
  const available=(result.words as string[]).flatMap(v=>v.split(/\s+/)).sort().join(' ')
  if (expected!==available) throw new Error('Jawaban latihan harus dapat disusun dari kata yang tersedia.')
 } else {
  if (!Array.isArray(q.options)||q.options.length<2||q.options.length>6||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length) throw new Error('Isi 2–6 pilihan dan kunci jawaban yang sesuai.')
  result.options=q.options.map((v:unknown)=>text(v,1000)); result.answer=q.answer
 }
 return result
}
export function questionPayload(value: unknown) {
 const q=object(value)
 if (!['SD','SMP','SMA'].includes(q.grade)||!['kosakata','kalimat','bacaan','akademik'].includes(q.aspect)||!['first','advanced','remedial'].includes(q.slot)) throw new Error('Pilih jenjang, aspek, dan jenis soal.')
 return {...question(q),grade:q.grade,aspect:q.aspect,slot:q.slot}
}
export function lessonPayload(value: unknown) {
 const p=object(value),data=object(p.data)
 if (!['lesson','basic'].includes(p.kind)||!['kosakata','kalimat','bacaan','akademik'].includes(p.aspect)||p.kind==='lesson'&&!['SD','SMP','SMA'].includes(p.grade)) throw new Error('Jenis atau jenjang materi belum valid.')
 const result:Record<string,unknown>={slug:text(p.slug,100),kind:p.kind,grade:p.kind==='basic'?'ALL':p.grade,aspect:p.aspect,title:text(p.title,160),data}
 if (data.quiz||data.practice||data.answer!==undefined||data.correct!==undefined) throw new Error('Format isi materi tidak valid.')
 if (p.kind==='lesson') {
  text(data.intro,6000); text(data.explanation,12000)
  if (!Array.isArray(p.quiz)||p.quiz.length!==5) throw new Error('Materi perlu lima soal evaluasi.')
  result.practice=question(p.practice,true); result.quiz=p.quiz.map((v:unknown)=>question(v))
 } else if (!Array.isArray(data.slides)||!data.slides.length||data.slides.length>20||typeof data.videoSrc!=='string'||! /^(https:\/\/|\/videos\/)/.test(data.videoSrc)) throw new Error('Isi video dan bagian penjelasan kelas dasar.')
 return result
}
