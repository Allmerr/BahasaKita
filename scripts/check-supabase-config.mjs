import assert from 'node:assert/strict'
import { readSupabaseConfig } from '../src/supabaseConfig.js'
const url = 'https://example.supabase.co'
const publicKey = 'sb_publishable_example'
const jwt = role => `header.${Buffer.from(JSON.stringify({ role })).toString('base64url')}.signature`
assert.deepEqual(readSupabaseConfig(url, publicKey), { url, key: publicKey })
assert.deepEqual(readSupabaseConfig(url + '/', jwt('anon')), { url, key: jwt('anon') })
for (const key of ['sb_secret_example', jwt('service_role'), jwt('authenticated'), 'invalid']) assert.ok(readSupabaseConfig(url, key).error)
for (const endpoint of ['bad-url', 'http://example.supabase.co', url + '/rest/v1', url + '?apikey=example', 'https://user:password@example.supabase.co']) assert.ok(readSupabaseConfig(endpoint, publicKey).error)
assert.ok(readSupabaseConfig('', '').error)
assert.ok(readSupabaseConfig('https://YOUR_PROJECT.supabase.co', 'YOUR_PUBLISHABLE_KEY').error)
assert.equal(readSupabaseConfig('http://127.0.0.1:54321', publicKey).url, 'http://127.0.0.1:54321')
console.log('PASS: public/anon key config, unsafe key rejection, URL validation and local Supabase')
