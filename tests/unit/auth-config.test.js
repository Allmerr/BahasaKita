import { describe,it,expect } from 'vitest'
import { authErrorMessage } from '../../src/authErrors.js'
import { readSupabaseConfig } from '../../src/supabaseConfig.js'
import { normalizeEmail } from '../../src/auth.js'
const url='https://example.supabase.co',key='sb_publishable_test'
const jwt=role=>'header.'+btoa(JSON.stringify({role}))+'.signature'
describe('Supabase config',()=>{
 it.each([key,jwt('anon')])('accepts browser public key %s',value=>expect(readSupabaseConfig(url+'/',value)).toEqual({url,key:value}))
 it.each(['sb_secret_private',jwt('service_role'),jwt('authenticated'),'invalid',''])('rejects unsafe or missing key %s',value=>expect(readSupabaseConfig(url,value).error).toBeTruthy())
 it.each(['bad-url','http://example.supabase.co',url+'/rest/v1',url+'?key=123','https://user:password@example.supabase.co',url+'#fragment',''])('rejects invalid endpoint %s',value=>expect(readSupabaseConfig(value,key).error).toBeTruthy())
 it.each(['http://localhost:54321','http://127.0.0.1:54321','http://[::1]:54321'])('supports local Supabase %s',value=>expect(readSupabaseConfig(value,key).url).toBe(value))
})
describe('auth errors',()=>{
 it.each(['email_address_invalid','email_address_not_authorized','over_email_send_rate_limit','over_request_rate_limit','email_provider_disabled','signup_disabled','weak_password','user_already_exists','email_exists','captcha_failed','email_not_confirmed','invalid_credentials','request_timeout'])('translates %s without raw response',code=>{const message=authErrorMessage({code,message:'SECRET_TOKEN'});expect(message).toContain(`Kode: ${code}`);expect(message).not.toContain('SECRET_TOKEN')})
 it.each([new TypeError('Failed to fetch'),{name:'AuthRetryableFetchError'},{status:0}])('handles network errors',error=>expect(authErrorMessage(error)).toMatch(/koneksi internet/))
 it('handles rate limits and login fallback',()=>{expect(authErrorMessage({status:429})).toMatch(/Terlalu banyak/);expect(authErrorMessage(null,'login')).toMatch(/Login belum berhasil/);expect(authErrorMessage({status:503})).toContain('HTTP 503')})
 it('sanitizes untrusted error codes and raw secrets',()=>{expect(authErrorMessage({code:'<script>password</script>',message:'SECRET_TOKEN'})).not.toMatch(/script|password|SECRET_TOKEN/)})
 it('normalizes email casing and whitespace',()=>expect(normalizeEmail('  DINA@Example.test ')).toBe('dina@example.test'))
})
