import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { PGlite } from '@electric-sql/pglite'

const migration = (name: string) => readFileSync(new URL('../../supabase/migrations/' + name, import.meta.url), 'utf8')
test('basic YouTube release: grade catalog, private keys, both assessment branches, preserved attempts and safe reruns', async t => {
 const db = new PGlite()
 t.after(() => db.close())
 await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,email text,raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
 create table learner_profiles(user_id uuid primary key references auth.users,name text,grade text,goal text);`)
 const users = ['SD', 'SMP', 'SMA'].map((grade, i) => ({ grade, id: `${String(i + 1).repeat(8)}-1111-4111-8111-111111111111` }))
 for (const user of users) {
  await db.query('insert into auth.users(id,email) values($1,$2)', [user.id, user.grade + '@example.test'])
  await db.query('insert into learner_profiles values($1,$2,$3,$4)', [user.id, 'Siswa', user.grade, 'Belajar'])
 }
 for (const name of ['004_learning_platform.sql', '004b_admin_content.sql', '005_learning_seed.sql']) await db.exec(migration(name))
 const rpc = async (name: string, args: unknown[] = []) => (await db.query<{v: any}>(`select public.${name}(${args.map((_, i) => '$' + (i + 1)).join(',')}) v`, args)).rows[0].v
 const asUser = async (uid: string | null) => {
  await db.exec('reset role')
  await db.query("select set_config('request.jwt.claim.sub',$1,false)", [uid || ''])
  await db.exec(uid ? 'set role authenticated' : 'set role anon')
 }
 await asUser(users[0].id)
 const historical = await rpc('bk_start_attempt', ['assessment', null])
 await db.exec('reset role')
 const originalKey = (await db.query<{answer: number}>('select answer from private.answer_keys where question_id=$1', [historical.question.id])).rows[0].answer
 await db.exec(migration('008_basic_youtube.sql'))
 const counts = (await db.query('select (select count(*) from public.lessons) lessons,(select count(*) from public.questions) questions')).rows
 await db.exec(migration('008_basic_youtube.sql'))
 assert.deepEqual((await db.query('select (select count(*) from public.lessons) lessons,(select count(*) from public.questions) questions')).rows, counts)
 const keys = new Map((await db.query<{question_id: string, answer: number}>('select * from private.answer_keys')).rows.map(r => [r.question_id, r.answer]))
 assert.equal(keys.get(historical.question.id), originalKey)
 assert.equal((await db.query<{status: string}>('select status from questions where id=$1', [historical.question.id])).rows[0].status, 'archived')
 await asUser(null)
 const catalog = await rpc('bk_catalog')
 assert.equal(catalog.basicMaterials.length, 12)
 assert.equal(catalog.lessons.length, 12, 'Regular lessons remain intact')
 assert.ok(!JSON.stringify(catalog).includes('"answer"') && !JSON.stringify(catalog).includes('"correct"'))
 await assert.rejects(db.query('select * from private.answer_keys'))
 const videos: Record<string, string> = { SD: 'iDDkYTki6pU', SMP: 'XmiXc0YUrXY', SMA: 'cvwI6-6lfGY' }
 const answer = (a: any, choice: number | null) => rpc('bk_answer', [a.id, a.question.id, choice === null ? null : JSON.stringify(choice), crypto.randomUUID(), false])
 await asUser(users[0].id)
 let old = await rpc('bk_get_attempt', [historical.id])
 assert.equal(old.question.id, historical.question.id)
 while (old.status === 'active') old = await answer(old, keys.get(old.question.id)!)
 assert.equal(old.score, 100, 'An in-flight attempt still uses its original questions and keys')
 for (const { grade, id } of users) {
  const materials = catalog.basicMaterials.filter((m: any) => m.targetGrade === grade)
  assert.equal(materials.length, 4)
  for (const m of materials) assert.ok(m.videoSrc.endsWith(videos[grade]) && m.slides.length >= 2)
  await asUser(id)
  for (const remedial of [false, true]) {
   let a = await rpc('bk_start_attempt', ['assessment', null])
   let answered = 0
   while (a.status === 'active') {
    assert.equal(a.question.sourceVideoId, videos[grade])
    assert.ok(materials.some((m: any) => m.id === a.question.basicSlug))
    assert.equal(a.question.slot, answered % 2 === 0 ? 'first' : remedial ? 'remedial' : 'advanced')
    a = await answer(a, remedial && answered % 2 === 0 ? null : keys.get(a.question.id)!)
    answered++
   }
   assert.equal(answered, 8)
   assert.equal(a.score, remedial ? 50 : 100)
  }
 }
})
