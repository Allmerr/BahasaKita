import { describe,it,expect,vi } from 'vitest'
vi.mock('../../src/supabase.js',()=>({fetchCatalog:vi.fn()}))
import { initialState,buildPath,assessmentScore,learningDestination,canOpen,level } from '../../src/learning.jsx'
import { needsLogin,publicPages } from '../../src/access.jsx'
import { scores,lesson } from '../fixtures.js'
const state=()=>({...structuredClone(initialState),profile:{grade:'SD'},assessment:{...scores}})
describe('assessment score and access',()=>{
 it('requires assessment before learning',()=>{expect(assessmentScore(initialState)).toBeNull();expect(learningDestination(initialState)).toBe('/assessment')})
 it.each([[0,'/basic-class'],[79.99,'/basic-class'],[80,'/'],[100,'/']])('score %s routes to %s',(n,destination)=>{const s=state();s.assessment=Object.fromEntries(Object.keys(scores).map(k=>[k,n]));expect(learningDestination(s)).toBe(destination)})
 it.each([undefined,null,NaN,Infinity,-1,101,'100'])('rejects invalid skill score %s',value=>{const s=state();s.assessment.kosakata=value;expect(assessmentScore(s)).toBeNull()})
 it('uses the actual eight answers before skill averages',()=>{const s=state();s.attempts=[{type:'assessment',grade:'SD',scores,answers:Array.from({length:8},(_,i)=>({correct:i<7}))}];expect(assessmentScore(s)).toBe(87.5)})
 it('uses current-grade latest assessment, excluding lesson scores and other grades',()=>{const s=state();s.attempts=[{type:'assessment',grade:'SD',scores},{type:'assessment',grade:'SMA',scores:{...scores,kosakata:0}},{type:'lesson',score:0}];expect(assessmentScore(s)).toBe(100)})
 it('rejects foreign-grade and unknown lesson access',()=>{const s=state();expect(canOpen(lesson.id,s,[lesson])).toBe(true);expect(canOpen('unknown',s,[lesson])).toBe(false);expect(canOpen('smp-buah',s,[{...lesson,id:'smp-buah',grade:'SMP'}])).toBe(false)})
 it.each([[49,'Perlu penguatan'],[50,'Cukup'],[79,'Cukup'],[80,'Baik']])('labels score %s',(score,label)=>expect(level(score)).toBe(label))
})
describe('recommendations',()=>{
 const catalog=[lesson,{...lesson,id:'sd-kalimat',aspect:'kalimat'},{...lesson,id:'sd-bacaan',aspect:'bacaan'}]
 it('prioritizes weakest aspect without mutating catalog',()=>{const s=state();s.assessment={...scores,bacaan:0,kalimat:50};expect(buildPath(s,catalog).map(l=>l.id)).toEqual(['sd-bacaan','sd-kalimat',lesson.id]);expect(catalog[0]).toBe(lesson)})
 it('keeps mastered lessons first and reinforces the latest failed lesson',()=>{const s=state();s.mastered=['sd-bacaan'];s.attempts=[{type:'lesson',lesson:'sd-kalimat',mastered:false}];expect(buildPath(s,catalog).map(l=>l.id)).toEqual(['sd-bacaan','sd-kalimat',lesson.id])})
 it('ignores failures outside the current catalog',()=>{const s=state();s.attempts=[{type:'lesson',lesson:'other-grade',mastered:false}];expect(buildPath(s,catalog)).toEqual(catalog);expect(buildPath(s)).toEqual([])})
 it.each([[false,false,true],[false,true,false],[true,false,false],[true,true,false]])('guest interaction guard (%s,%s)',(authorized,navigation,expected)=>expect(needsLogin(authorized,navigation)).toBe(expected))
 it('keeps progress and private sessions out of public pages',()=>{expect(publicPages).toContain('/dictionary');expect(publicPages).not.toContain('/progress');expect(publicPages).not.toContain('/admin')})
})
