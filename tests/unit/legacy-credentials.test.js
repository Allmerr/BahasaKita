import { webcrypto } from 'node:crypto'
import { beforeEach,it,expect,vi } from 'vitest'
import { createCredential,verifyCredential } from '../../src/auth.js'
// Compatibility helpers retained from the earlier local prototype, not the active Auth path.
beforeEach(()=>vi.stubGlobal('crypto',webcrypto))
it('legacy credentials use unique salts and verify only the correct password',async()=>{
 const first=await createCredential('Belajar123!'),second=await createCredential('Belajar123!')
 expect(first.salt).toHaveLength(16);expect(first.hash).toHaveLength(32);expect(first.iterations).toBe(100000)
 expect(first.salt).not.toEqual(second.salt);expect(first.hash).not.toEqual(second.hash)
 expect(await verifyCredential('Belajar123!',first)).toBe(true);expect(await verifyCredential('WrongPassword!',first)).toBe(false)
 expect(await verifyCredential('Belajar123!',{...first,hash:first.hash.slice(1)})).toBe(false)
})
it.each(['','short','a'.repeat(129)])('legacy credential rejects invalid password length',async password=>expect(createCredential(password)).rejects.toThrow(/8–128/))
it.each([null,{}, {salt:[],hash:null}])('legacy verification safely rejects malformed records %j',async credential=>expect(await verifyCredential('Belajar123!',credential)).toBe(false))
