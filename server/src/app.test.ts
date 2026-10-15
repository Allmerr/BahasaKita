import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
import { AVATAR_LIMIT, avatarExtension, ownsAvatar } from './avatar.js'

const userId = '11111111-1111-4111-8111-111111111111'
const otherId = '22222222-2222-4222-8222-222222222222'
const preferences = { textSize: 'normal', theme: 'light', speed: '1', comfortable: false, contrast: false, language: 'default', dataSaver: false }
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZlS8AAAAASUVORK5CYII=', 'base64')

async function fixture(t: { after: (fn: () => Promise<void>) => void }) {
  const state = { profile: { name: 'Dina', grade: 'SD', goal: 'Mengenal kata', preferences, avatar_path: null as string | null }, failSave: false, failUpload: false, failSign: false, oldSchema: false, files: new Set<string>(), deleted: [] as string[], signed: [] as string[], scopes: [] as unknown[] }
  const client = {
    auth: { getUser: async (token: string) => token === 'valid' ? { data: { user: { id: userId, email: 'dina@example.test' } }, error: null } : { data: { user: null }, error: { message: 'invalid' } } },
    from: (table: string) => {
      assert.equal(table, 'learner_profiles')
      let patch: Record<string, unknown> | undefined
      let scoped: unknown
      const query = {
        select: (_fields: string) => query,
        update: (value: Record<string, unknown>) => { patch = value; return query },
        eq: (column: string, value: unknown) => { assert.equal(column, 'user_id'); scoped = value; state.scopes.push(value); return query },
        single: async () => {
          assert.equal(scoped, userId, 'Every read/write must be scoped to verified user')
          if (patch && state.failSave) return { data: null, error: { code: '42501' } }
          if (patch) Object.assign(state.profile, patch)
          const data: Record<string, unknown> = { ...state.profile }
          if (state.oldSchema) delete data.avatar_path
          return { data, error: null }
        },
      }
      return query
    },
    storage: { from: (bucket: string) => {
      assert.equal(bucket, 'profile-photos')
      return {
        upload: async (path: string, bytes: Buffer, options: { contentType: string, upsert: boolean }) => {
          assert.ok(ownsAvatar(path, userId)); assert.equal(options.contentType, 'image/png'); assert.equal(options.upsert, false); assert.deepEqual(bytes, png)
          if (state.failUpload) return { data: null, error: { message: 'unavailable' } }
          state.files.add(path); return { data: { path }, error: null }
        },
        remove: async (paths: string[]) => { for (const path of paths) { assert.ok(ownsAvatar(path, userId)); state.files.delete(path); state.deleted.push(path) }; return { data: null, error: null } },
        createSignedUrl: async (path: string, lifetime: number) => { assert.ok(ownsAvatar(path, userId)); assert.equal(lifetime, 3600); state.signed.push(path); return state.failSign ? { data: null, error: { message: 'unavailable' } } : { data: { signedUrl: 'https://storage.example.test/' + path + '?token=test' }, error: null } },
      }
    } },
  }
  const server = createApp(() => client as unknown as SupabaseClient).listen(0, '127.0.0.1')
  await new Promise<void>(resolve => server.once('listening', resolve))
  t.after(() => new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve())))
  const address = server.address()
  assert.ok(address && typeof address !== 'string')
  const base = `http://127.0.0.1:${address.port}/api/v1/me`
  const request = (path = '', options: RequestInit = {}) => fetch(base + path, { ...options, headers: { Authorization: 'Bearer valid', ...options.headers } })
  return { state, base, request, upload: () => request('/avatar', { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: new Uint8Array(png).buffer }) }
}

test('profile edits persist all three fields, discard ownership and preserve photo/preferences', async t => {
  const f = await fixture(t)
  f.state.profile.avatar_path = `${userId}/old.png`
  const response = await f.request('/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: ' Dina Baru ', grade: 'SMP', goal: 'Memahami cerita', user_id: otherId, avatar_path: `${otherId}/other.png` }) })
  assert.equal(response.status, 200)
  const saved = await response.json()
  assert.equal(saved.name, 'Dina Baru'); assert.equal(saved.grade, 'SMP'); assert.equal(saved.goal, 'Memahami cerita')
  const loaded = await (await f.request()).json()
  assert.equal(loaded.profile.name, 'Dina Baru'); assert.equal(loaded.profile.grade, 'SMP'); assert.equal(loaded.profile.goal, 'Memahami cerita')
  assert.equal(loaded.profile.avatar_path, `${userId}/old.png`); assert.deepEqual(loaded.preferences, preferences)
})
test('photo uploads persist, replace the old object and delete independently of profile fields', async t => {
  const f = await fixture(t)
  const first = await f.upload(); assert.equal(first.status, 200)
  const avatar = await first.json(); assert.ok(ownsAvatar(avatar.avatar_path, userId)); assert.ok(avatar.avatar_url)
  const second = await f.upload(); assert.equal(second.status, 200)
  const replacement = await second.json(); assert.notEqual(replacement.avatar_path, avatar.avatar_path)
  assert.deepEqual(f.state.deleted, [avatar.avatar_path]); assert.equal(f.state.files.size, 1)
  const loaded = await (await f.request()).json(); assert.equal(loaded.profile.avatar_path, replacement.avatar_path)
  const removed = await f.request('/avatar', { method: 'DELETE' }); assert.equal(removed.status, 200)
  assert.equal(f.state.files.size, 0); assert.equal(f.state.profile.avatar_path, null); assert.equal(f.state.profile.name, 'Dina')
})
test('failed photo saves retain the old photo and remove the unreferenced upload', async t => {
  const f = await fixture(t)
  f.state.profile.avatar_path = `${userId}/old.png`; f.state.files.add(f.state.profile.avatar_path); f.state.failSave = true
  const response = await f.upload(); assert.equal(response.status, 503)
  assert.equal(f.state.profile.avatar_path, `${userId}/old.png`); assert.deepEqual([...f.state.files], [`${userId}/old.png`])
})
test('invalid files and oversized uploads are rejected before storage writes', async t => {
  const f = await fixture(t)
  for (const type of ['image/png', 'image/svg+xml']) {
    const response = await f.request('/avatar', { method: 'PUT', headers: { 'Content-Type': type }, body: '<svg></svg>' })
    assert.equal(response.status, 400)
  }
  const large = await f.request('/avatar', { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body: new Uint8Array(AVATAR_LIMIT + 1).buffer })
  assert.equal(large.status, 413); assert.equal(f.state.files.size, 0)
})
test('anonymous/invalid sessions cannot read or upload and foreign avatar references are never signed', async t => {
  const f = await fixture(t)
  assert.equal((await fetch(f.base)).status, 401)
  assert.equal((await f.request('/avatar', { method: 'PUT', headers: { Authorization: 'Bearer invalid' } })).status, 401)
  f.state.profile.avatar_path = `${otherId}/private.png`
  const data = await (await f.request()).json(); assert.equal(data.profile.avatar_url, null); assert.deepEqual(f.state.signed, [])
})
test('missing photo migration/storage does not break existing profile loads', async t => {
  const f = await fixture(t)
  f.state.oldSchema = true
  const loaded = await f.request(); assert.equal(loaded.status, 200); assert.equal((await loaded.json()).profile.avatar_url, null)
  assert.equal((await f.upload()).status, 503)
  f.state.oldSchema = false; f.state.profile.avatar_path = `${userId}/photo.png`; f.state.failSign = true
  const response = await f.request(); assert.equal(response.status, 200); assert.equal((await response.json()).profile.name, 'Dina')
})
test('avatar validation rejects mismatched types, empty files and foreign/traversal paths', () => {
  assert.equal(avatarExtension('image/png', png), 'png')
  assert.throws(() => avatarExtension('image/jpeg', png)); assert.throws(() => avatarExtension('image/png', Buffer.alloc(0)))
  assert.equal(ownsAvatar(`${otherId}/photo.png`, userId), false); assert.equal(ownsAvatar(`${userId}/../photo.png`, userId), false)
})

test('preferences persist all accessibility options and reject forged/partial settings',async t=>{
 const f=await fixture(t),saved={...preferences,theme:'dark',textSize:'extra',speed:'0.5',comfortable:true,contrast:true,language:'bisindo',dataSaver:true}
 const response=await f.request('/preferences',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(saved)})
 assert.equal(response.status,200);assert.deepEqual((await (await f.request()).json()).preferences,saved)
 for(const body of [{theme:'light'},{...saved,score:100},{...saved,contrast:'true'}])assert.equal((await f.request('/preferences',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})).status,400)
 assert.deepEqual((await (await f.request()).json()).preferences,saved)
})
test('storage upload failures leave the existing photo intact',async t=>{
 const f=await fixture(t);f.state.profile.avatar_path=userId+'/old.png';f.state.files.add(f.state.profile.avatar_path);f.state.failUpload=true
 assert.equal((await f.upload()).status,503);assert.equal(f.state.profile.avatar_path,userId+'/old.png');assert.deepEqual(f.state.deleted,[])
})
test('avatar refresh signs only the owned saved path without mutating profile fields',async t=>{
 const f=await fixture(t);f.state.profile.avatar_path=userId+'/photo.png'
 const response=await f.request('/avatar');assert.equal(response.status,200);assert.equal((await response.json()).avatar_path,userId+'/photo.png');assert.deepEqual(f.state.signed,[userId+'/photo.png']);assert.equal(f.state.profile.name,'Dina')
})
