export function normalizeEmail(email) { return email.trim().toLowerCase() }
async function derive(password, salt, iterations) {
 const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
 const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: Uint8Array.from(salt), iterations, hash: 'SHA-256' }, key, 256)
 return Array.from(new Uint8Array(bits))
}
export async function createCredential(password) {
 if (password.length < 8 || password.length > 128) throw new Error('Gunakan kata sandi dengan 8–128 karakter.')
 const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)))
 const iterations = 100000
 return { salt, iterations, hash: await derive(password, salt, iterations) }
}
export async function verifyCredential(password, credential) {
 if (!credential || !Array.isArray(credential.salt) || !Array.isArray(credential.hash)) return false
 const hash = await derive(password, credential.salt, credential.iterations)
 return hash.length === credential.hash.length && hash.reduce((difference, value, i) => difference | (value ^ credential.hash[i]), 0) === 0
}
