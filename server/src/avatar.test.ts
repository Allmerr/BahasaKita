import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AVATAR_LIMIT,avatarExtension,ownsAvatar } from './avatar.js'
const uid='11111111-1111-4111-8111-111111111111'
test('avatar detects supported signatures including MIME parameters',()=>{
 assert.equal(avatarExtension(' IMAGE/JPEG; charset=binary',Buffer.from([255,216,255,0])),'jpg')
 assert.equal(avatarExtension('image/png',Buffer.from([137,80,78,71,13,10,26,10])),'png')
 assert.equal(avatarExtension('image/webp',Buffer.from('RIFF0000WEBP')),'webp')
})
test('avatar rejects mismatched, truncated, unsupported and oversized content',()=>{
 for(const [type,bytes] of [['image/jpeg',Buffer.from([255,216])],['image/webp',Buffer.from('RIFFWEBP')],['image/png',Buffer.from('not a photo')],['image/svg+xml',Buffer.from('<svg/>')],['image/png',Buffer.alloc(0)],['image/png',Buffer.alloc(AVATAR_LIMIT+1)]] as const)assert.throws(()=>avatarExtension(type,bytes))
})
test('avatar ownership permits only a single owned filename and supported extension',()=>{
 for(const ext of ['jpg','png','webp'])assert.equal(ownsAvatar(uid+'/photo-123.'+ext,uid),true)
 for(const path of [null,{},uid,uid+'/../private.png',uid+'/nested/photo.png',uid+'/photo.svg',uid+'/photo.png?token=secret',uid+'/photo.PNG','other/photo.png',uid+'/photo%2epng'])assert.equal(ownsAvatar(path,uid),false)
})
