import { it, expect } from 'vitest'
import { basicForGrade, basicYoutubeId } from '../../src/basicContent.js'
it('never substitutes another grade and prefers specific content over the legacy catalog',()=>{
 const legacy={id:'old',grade:'ALL'},sd={id:'sd',targetGrade:'SD',grade:'ALL'}
 expect(basicForGrade([legacy,sd],'SD')).toEqual([sd])
 expect(basicForGrade([sd],'SMP')).toEqual([])
 expect(basicForGrade([legacy],'SMP')).toEqual([legacy])
 expect(basicForGrade([sd],'ALL')).toEqual([])
})
it('recognizes supported YouTube URLs without accepting lookalike hosts',()=>{
 for(const src of ['https://www.youtube.com/watch?v=iDDkYTki6pU','https://youtu.be/iDDkYTki6pU','https://www.youtube-nocookie.com/embed/iDDkYTki6pU'])expect(basicYoutubeId(src)).toBe('iDDkYTki6pU')
 for(const src of ['/videos/basic.webm','https://youtube.com.fake.test/watch?v=iDDkYTki6pU','javascript:alert(1)','https://youtube.com/watch?v=bad'])expect(basicYoutubeId(src)).toBeNull()
})
