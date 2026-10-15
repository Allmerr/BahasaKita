// Keep the displayed recommendations and API access checks in the same order.
export function orderedLessons(state, lessons = []) {
 const mastered = state.mastered || []
 const last = (state.attempts || []).filter(a => a.type === 'lesson' && lessons.some(l => l.id === a.lesson)).at(-1)
 const reinforcement = last && !last.mastered && !mastered.includes(last.lesson) ? last.lesson : null
 return [...lessons.filter(l => mastered.includes(l.id)), ...lessons.filter(l => !mastered.includes(l.id)).sort((a, b) => {
  if (a.id === reinforcement) return -1
  if (b.id === reinforcement) return 1
  return (state.assessment?.[a.aspect] ?? 0) - (state.assessment?.[b.aspect] ?? 0)
 })]
}

export function unlockedInPath(id, mastered = [], path = []) {
 if (!path.some(l => l.id === id)) return false
 return mastered.includes(id) || path.find(l => !mastered.includes(l.id))?.id === id
}
