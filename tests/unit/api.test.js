import { beforeEach,it,expect,vi } from 'vitest'
const sdk=vi.hoisted(()=>({auth:{getSession:vi.fn(),refreshSession:vi.fn(),signOut:vi.fn()}}))
vi.mock('@supabase/supabase-js',()=>({createClient:()=>sdk}))
import { accountApi,fetchCatalog } from '../../src/supabase.js'
beforeEach(()=>{sdk.auth.getSession.mockResolvedValue({data:{session:{access_token:'unit-token'}}});sdk.auth.signOut.mockResolvedValue({error:null});sdk.auth.refreshSession.mockResolvedValue({data:{session:{access_token:'renewed-token'}},error:null})})
const response=(body,ok=true)=>({ok,json:vi.fn().mockResolvedValue(body)})
it('sends authenticated GET without a request body',async()=>{fetch.mockResolvedValue(response({profile:{name:'Dina'}}));await accountApi();expect(fetch).toHaveBeenCalledWith('/api/v1/me',expect.objectContaining({method:'GET',headers:expect.objectContaining({Authorization:'Bearer unit-token'})}));expect(fetch.mock.calls[0][1]).not.toHaveProperty('body')})
it('sends JSON updates and forwards abort signals',async()=>{fetch.mockResolvedValue(response({saved:true}));const signal=new AbortController().signal;await accountApi('/profile',{name:'Dina'},{signal});expect(fetch).toHaveBeenCalledWith('/api/v1/me/profile',expect.objectContaining({method:'PATCH',body:JSON.stringify({name:'Dina'}),signal}))})
it('sends photo bytes with explicit content type and PUT',async()=>{fetch.mockResolvedValue(response({avatar_path:'photo'}));const file=new Blob(['photo'],{type:'image/png'});await accountApi('/avatar',file,{method:'PUT'});expect(fetch).toHaveBeenCalledWith('/api/v1/me/avatar',expect.objectContaining({method:'PUT',body:file,headers:expect.objectContaining({'Content-Type':'image/png'})}))})
it('supports POST and DELETE independently of defaults',async()=>{fetch.mockResolvedValue(response({ok:true}));await accountApi('/learning/attempts',{kind:'assessment'},{method:'POST'});await accountApi('/avatar',undefined,{method:'DELETE'});expect(fetch.mock.calls.map(([,init])=>init.method)).toEqual(['POST','DELETE'])})
it('rejects expired/missing sessions before sending data',async()=>{sdk.auth.getSession.mockResolvedValue({data:{session:null}});await expect(accountApi('/profile',{})).rejects.toThrow(/masuk kembali/);expect(fetch).not.toHaveBeenCalled()})
it('shows API errors instead of treating failures as success',async()=>{fetch.mockResolvedValue(response({error:'Akses ditolak'},false));await expect(accountApi('/admin/content')).rejects.toThrow('Akses ditolak')})
it('handles HTML/offline API responses',async()=>{fetch.mockResolvedValue({ok:false,json:()=>Promise.reject(new Error('HTML'))});await expect(accountApi()).rejects.toThrow(/API server belum dapat diakses/)})
it('loads catalog without requesting an auth session',async()=>{const catalog={lessons:[],basicMaterials:[]};fetch.mockResolvedValue(response(catalog));expect(await fetchCatalog()).toEqual(catalog);expect(sdk.auth.getSession).not.toHaveBeenCalled()})
it.each([null,{lessons:[]},{lessons:{},basicMaterials:[]}])('rejects malformed catalog %j',async body=>{fetch.mockResolvedValue(response(body));await expect(fetchCatalog()).rejects.toThrow(/Materi belajar/)})
it('preserves a catalog setup error message',async()=>{fetch.mockResolvedValue(response({error:'Migrasi diperlukan'},false));await expect(fetchCatalog()).rejects.toThrow('Migrasi diperlukan')})
it('renews a rejected token and retries the original request only once',async()=>{
 fetch.mockResolvedValueOnce({...response({error:'Sesi tidak valid'},false),status:401}).mockResolvedValueOnce(response({saved:true}))
 const file=new Blob(['photo'],{type:'image/png'});await expect(accountApi('/avatar',file,{method:'PUT'})).resolves.toEqual({saved:true})
 expect(sdk.auth.refreshSession).toHaveBeenCalledOnce();expect(fetch.mock.calls[1][1]).toEqual(expect.objectContaining({method:'PUT',body:file,headers:expect.objectContaining({Authorization:'Bearer renewed-token'})}));expect(sdk.auth.signOut).not.toHaveBeenCalled()
})
it('clears an expired local session instead of looping on rejected credentials',async()=>{
 fetch.mockResolvedValue({...response({error:'Sesi tidak valid'},false),status:401});sdk.auth.refreshSession.mockResolvedValue({data:{session:null},error:{status:400,code:'refresh_token_not_found'}})
 await expect(accountApi()).rejects.toMatchObject({code:'AUTH_SESSION_EXPIRED'});expect(fetch).toHaveBeenCalledOnce();expect(sdk.auth.signOut).toHaveBeenCalledWith({scope:'local'})
})
it('stops after a renewed token is also rejected',async()=>{
 fetch.mockResolvedValue({...response({error:'Sesi tidak valid'},false),status:401});await expect(accountApi()).rejects.toMatchObject({code:'AUTH_SESSION_EXPIRED'});expect(fetch).toHaveBeenCalledTimes(2);expect(sdk.auth.refreshSession).toHaveBeenCalledOnce()
})
it('retains the session during a temporary auth-service failure',async()=>{
 fetch.mockResolvedValue({...response({},false),status:401});sdk.auth.refreshSession.mockResolvedValue({data:{session:null},error:{status:503}})
 await expect(accountApi()).rejects.toThrow(/Periksa koneksi/);expect(sdk.auth.signOut).not.toHaveBeenCalled()
})
