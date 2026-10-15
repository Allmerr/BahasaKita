// Content and answer keys remain canonical in the database.
export function basicForGrade(materials, grade) {
 if (!['SD', 'SMP', 'SMA'].includes(grade)) return []
 const matching = materials.filter(m => (m.targetGrade || m.grade) === grade)
 const available = matching.length ? matching : materials.filter(m => (!m.targetGrade || m.targetGrade === 'ALL') && (!m.grade || m.grade === 'ALL'))
 const order = { kosakata: 0, kalimat: 1, bacaan: 2, akademik: 3 }
 return [...available].sort((a, b) => (order[a.aspect] ?? 4) - (order[b.aspect] ?? 4))
}

export function basicYoutubeId(source) {
 try {
  const url = new URL(source)
  if (url.protocol !== 'https:') return null
  const host = url.hostname.toLowerCase()
  let id
  if (host === 'youtu.be') id = url.pathname.slice(1)
  else if (['youtube.com', 'www.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
   id = url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(?:embed|shorts)\/([^/]+)$/.exec(url.pathname)?.[1]
  }
  return /^[a-zA-Z0-9_-]{11}$/.test(id || '') ? id : null
 } catch { return null }
}
