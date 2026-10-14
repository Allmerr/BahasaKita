export function profileInput(body: unknown) {
  const b = body as Record<string, unknown>
  if (!b || Array.isArray(b) || typeof b.name !== 'string' || !b.name.trim() || b.name.trim().length > 30 || typeof b.grade !== 'string' || !['SD', 'SMP', 'SMA'].includes(b.grade) || typeof b.goal !== 'string' || !['Mengenal kata', 'Memahami cerita', 'Belajar matematika'].includes(b.goal)) throw new Error('Profil tidak valid. Pilih jenjang SD, SMP, atau SMA.')
  return { name: b.name.trim(), grade: b.grade, goal: b.goal }
}
export function preferencesInput(body: unknown) {
  const b = body as Record<string, unknown>
  const choices: Record<string, unknown[]> = { textSize: ['normal', 'large', 'extra'], theme: ['light', 'dark'], speed: ['1', '0.75', '0.5'], language: ['default', 'bisindo'] }
  const booleans = ['comfortable', 'contrast', 'dataSaver']
  if (!b || Array.isArray(b) || Object.keys(b).some(k => !choices[k] && !booleans.includes(k))) throw new Error('Pengaturan tidak valid.')
  for (const [k, values] of Object.entries(choices)) if (!values.includes(b[k])) throw new Error('Pengaturan tidak valid.')
  for (const k of booleans) if (typeof b[k] !== 'boolean') throw new Error('Pengaturan tidak valid.')
  return Object.fromEntries([...Object.keys(choices), ...booleans].map(k => [k, b[k]]))
}
