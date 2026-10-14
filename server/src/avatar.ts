export const AVATAR_BUCKET = 'profile-photos'
export const AVATAR_LIMIT = 2 * 1024 * 1024

export function avatarExtension(contentType: string, bytes: Buffer) {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0 || bytes.length > AVATAR_LIMIT) {
    throw new Error('Pilih foto JPG, PNG, atau WebP dengan ukuran maksimal 2 MB.')
  }
  const type = contentType.split(';')[0].trim().toLowerCase()
  if (type === 'image/jpeg' && bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpg'
  if (type === 'image/png' && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png'
  if (type === 'image/webp' && bytes.length >= 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp'
  throw new Error('Berkas belum dikenali sebagai foto JPG, PNG, atau WebP.')
}

export function ownsAvatar(path: unknown, userId: string): path is string {
  return typeof path === 'string' && path.startsWith(userId + '/') && /^[a-zA-Z0-9-]+\.(jpg|png|webp)$/.test(path.slice(userId.length + 1))
}
