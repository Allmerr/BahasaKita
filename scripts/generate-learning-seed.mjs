import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { questionBank } from '../content/legacy-assessment.js'
import { allGradeLessons } from '../content/legacy-lessons.js'
import { basicMaterials } from '../content/legacy-basic.js'
const uuid = value => { const hex = createHash('sha256').update(value).digest('hex').slice(0,32); return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20)}` }
const sql = value => value === null ? 'null' : `'${String(value).replaceAll("'", "''")}'`
const json = value => sql(JSON.stringify(value)) + '::jsonb'
const statements = ['-- Generated from content/legacy-*; reruns never overwrite edited/published content.', 'begin;']
let questionCount = 0
function question({ logicalKey, kind, lessonId = null, grade, aspect, slot = null, position = 0, value }) {
 const id = uuid(logicalKey + ':1')
 const { correct, answer, prompt, options = [], ...data } = value
 const key = answer === undefined ? correct : answer
 if (key === undefined) throw new Error('Missing key: ' + logicalKey)
 statements.push(`insert into public.questions(id,logical_key,revision,kind,lesson_id,grade,aspect,slot,position,format,prompt,options,data,status) values(${sql(id)},${sql(logicalKey)},1,${sql(kind)},${sql(lessonId)},${sql(grade)},${sql(aspect)},${sql(slot)},${position},${sql(value.words ? 'order' : 'choice')},${sql(prompt)},${json(options)},${json(data)},'published') on conflict(id) do nothing;`)
 statements.push(`insert into private.answer_keys(question_id,answer) values(${sql(id)},${json(key)}) on conflict(question_id) do nothing;`)
 questionCount++
}
for (const [grade, aspects] of Object.entries(questionBank)) for (const [aspect, questions] of Object.entries(aspects)) questions.forEach((value, index) => {
 const slot = ['first','advanced','remedial'][index]
 question({ logicalKey: `assessment-${grade.toLowerCase()}-${aspect}-${slot}`, kind: 'assessment', grade, aspect, slot, value })
})
for (const lesson of allGradeLessons()) {
 const { id: slug, grade, aspect, title, practice, quiz, ...data } = lesson
 const id = uuid('lesson:' + slug + ':1')
 statements.push(`insert into public.lessons(id,slug,revision,kind,grade,aspect,title,data,status) values(${sql(id)},${sql(slug)},1,'lesson',${sql(grade)},${sql(aspect)},${sql(title)},${json(data)},'published') on conflict(id) do nothing;`)
 question({ logicalKey: `${slug}-practice`, kind: 'practice', lessonId: id, grade, aspect, value: practice })
 quiz.forEach((value, index) => question({ logicalKey: `${slug}-quiz-${index}`, kind: 'quiz', lessonId: id, grade, aspect, position: index, value }))
}
for (const basic of basicMaterials) {
 const { id: aspect, title, ...data } = basic
 const slug = 'basic-' + aspect
 data.videoSrc = `/videos/basic-${aspect}.webm`
 statements.push(`insert into public.lessons(id,slug,revision,kind,grade,aspect,title,data,status) values(${sql(uuid('lesson:' + slug + ':1'))},${sql(slug)},1,'basic','ALL',${sql(aspect)},${sql(title)},${json(data)},'published') on conflict(id) do nothing;`)
}
statements.push('commit;')
writeFileSync('supabase/migrations/005_learning_seed.sql', statements.join('\n') + '\n')
console.log(`Seed prepared: ${allGradeLessons().length} lessons, ${basicMaterials.length} basic materials, ${questionCount} questions. Keys stay in private.answer_keys.`)

const files=['004_learning_platform.sql','004b_admin_content.sql','005_learning_seed.sql','006_first_admin.sql']
writeFileSync('supabase/DEPLOY-LEARNING.sql', '-- BahasaKita: run once in Supabase SQL Editor after migrations 001-003.\n-- Bootstrap admin: kevinalmer@apps.ipb.ac.id (must already be registered).\nbegin;\n'+files.map(name=>'\n-- '+name+'\n'+readFileSync('supabase/migrations/'+name,'utf8').replace(/^begin;\r?$/gm,'').replace(/^commit;\r?$/gm,'')).join('\n')+'\ncommit;\n')
console.log('Combined deployment: supabase/DEPLOY-LEARNING.sql (one atomic transaction).')
