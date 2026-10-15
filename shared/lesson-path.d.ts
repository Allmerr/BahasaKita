export interface PathLesson { id: string; aspect: string; grade: string }
export interface PathState {
 mastered?: string[]
 attempts?: { type?: string; lesson?: string | null; mastered?: boolean }[]
 assessment?: Record<string, number> | null
}
export function orderedLessons<T extends PathLesson>(state: PathState, lessons?: T[]): T[]
export function unlockedInPath(id: string, mastered?: string[], path?: { id: string }[]): boolean
