import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createApp } from './app.js'
test('account deletion requires auth and confirmation and ignores forged target ID', async t => {
 const deleted: string[] = []
 const client = { auth: { getUser: async () => ({ data: { user: { id: 'owner' } }, error: null }) } }
 const admin = { storage: { from: () => ({ list: async (id: string) => { assert.equal(id, 'owner'); return { data: [], error: null } } }) }, auth: { admin: { deleteUser: async (id: string) => { deleted.push(id); return { error: null } } } } }
 const server = createApp(() => client as unknown as SupabaseClient, admin as unknown as SupabaseClient).listen(0, '127.0.0.1')
 await new Promise<void>(r => server.once('listening', r))
 t.after(() => new Promise<void>(r => server.close(() => r())))
 const address = server.address(); assert.ok(address && typeof address !== 'string')
 const url = `http://127.0.0.1:${address.port}/api/v1/me/account`
 assert.equal((await fetch(url, { method: 'DELETE' })).status, 401)
 const send = (body: object) => fetch(url, { method: 'DELETE', headers: { Authorization: 'Bearer valid', 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
 assert.equal((await send({ confirmation: 'wrong' })).status, 400)
 assert.deepEqual(deleted, [])
 assert.equal((await send({ confirmation: 'HAPUS AKUN', user_id: 'victim' })).status, 200)
 assert.deepEqual(deleted, ['owner'])
})
