import '@testing-library/jest-dom/vitest'
import { beforeEach, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import { JSDOM } from 'jsdom'

// Node 25 exposes its own localStorage; use browser Storage consistently on every runtime.
const testStorage=new JSDOM('',{url:'https://unit.test'}).window.localStorage
const testSessionStorage=new JSDOM('',{url:'https://unit.test'}).window.sessionStorage

beforeEach(()=>{
 vi.stubGlobal('localStorage',testStorage)
 vi.stubGlobal('sessionStorage',testSessionStorage)
 window.localStorage.clear()
 window.sessionStorage.clear()
 vi.spyOn(window,'scrollTo').mockImplementation(()=>{})
 vi.stubGlobal('fetch',vi.fn(()=>Promise.reject(new Error('Network is disabled in unit tests. Mock the expected request.'))))
 HTMLElement.prototype.scrollIntoView=vi.fn()
 HTMLElement.prototype.scrollTo=vi.fn()
 HTMLElement.prototype.scrollBy=vi.fn()
 HTMLDialogElement.prototype.showModal=vi.fn(function(){this.setAttribute('open','')})
 HTMLDialogElement.prototype.close=vi.fn(function(){this.removeAttribute('open')})
 URL.createObjectURL=vi.fn(()=> 'blob:unit-test')
 URL.revokeObjectURL=vi.fn()
})
afterEach(()=>{cleanup();vi.useRealTimers();window.localStorage.clear();vi.unstubAllGlobals()})
